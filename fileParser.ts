import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Asset } from '../types/portfolio';

export interface ParsedFileData {
  assets: Omit<Asset, 'id'>[];
  errors: string[];
}

export interface FileRow {
  [key: string]: string | number;
}

// Specific column mappings for the Excel format described
const EXCEL_COLUMN_MAPPINGS = {
  // Exact column names as specified
  activo: ['activo', 'asset', 'nombre', 'name', 'descripcion', 'description'],
  unidadMonetaria: ['unidad monetaria', 'unidad_monetaria', 'currency', 'moneda'],
  cantidad: ['cantidad', 'shares', 'quantity', 'units', 'unidades'],
  montoMonedaOrigen: ['monto moneda origen', 'monto_moneda_origen', 'monto moneda de origen', 'current_value', 'valor_actual', 'amount'],
  claseActivo: ['clase de activo', 'clase_de_activo', 'clase activo', 'category', 'tipo', 'asset_class'],
  isin: ['isin', 'codigo_isin'],
  nemoLocal: ['nemo local', 'nemo_local', 'nemotecnico', 'ticker', 'symbol', 'codigo']
};

// Category mappings based on the specified asset classes
const ASSET_CLASS_MAPPINGS: { [key: string]: Asset['category'] } = {
  // Spanish asset classes as specified
  'alternativo': 'Alternative Investments',
  'alternativos': 'Alternative Investments',
  'balanceado': 'Balanceado',
  'caja': 'Caja',
  'dif valorizacion': 'Other',
  'diferencia valorizacion': 'Other',
  'money market': 'Caja',
  'no especificado': 'Other',
  'pasivos': 'Other',
  'renta fija': 'Fixed Income',
  'renta variable': 'Equities',
  
  // English equivalents
  'alternative': 'Alternative Investments',
  'alternatives': 'Alternative Investments',
  'balanced': 'Balanceado',
  'cash': 'Caja',
  'money_market': 'Caja',
  'unspecified': 'Other',
  'liabilities': 'Other',
  'fixed income': 'Fixed Income',
  'fixed_income': 'Fixed Income',
  'bonds': 'Fixed Income',
  'equities': 'Equities',
  'equity': 'Equities',
  'stocks': 'Equities',
  'variable income': 'Equities',
  'variable_income': 'Equities'
};

function findColumnIndex(headers: string[], possibleNames: string[]): number {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim().replace(/[_\s]+/g, ' '));
  
  for (const name of possibleNames) {
    const normalizedName = name.toLowerCase().trim().replace(/[_\s]+/g, ' ');
    const index = normalizedHeaders.findIndex(header => 
      header === normalizedName || 
      header.includes(normalizedName) || 
      normalizedName.includes(header)
    );
    if (index !== -1) return index;
  }
  return -1;
}

function normalizeCategory(category: string): Asset['category'] {
  const normalized = category.toLowerCase().trim().replace(/[_\s]+/g, ' ');
  return ASSET_CLASS_MAPPINGS[normalized] || 'Other';
}

function parseNumericValue(value: any): number {
  if (typeof value === 'number') return Math.abs(value); // Take absolute value
  if (typeof value === 'string') {
    // Remove common currency symbols, separators, and handle negative values
    const cleaned = value.replace(/[$,\s%\(\)]/g, '').replace(/\./g, '');
    let parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return 0;
    return Math.abs(parsed); // Take absolute value to handle negative amounts
  }
  return 0;
}

function normalizeCurrency(currency: string): 'USD' | 'CLP' | string {
  const normalized = currency.toLowerCase().trim();
  if (normalized.includes('usd') || normalized.includes('dollar')) return 'USD';
  if (normalized.includes('clp') || normalized.includes('peso')) return 'CLP';
  return currency.trim();
}

function validateAsset(asset: Omit<Asset, 'id'>, rowIndex: number): string[] {
  const errors: string[] = [];
  
  if (!asset.name || asset.name.trim() === '') {
    errors.push(`Row ${rowIndex + 1}: Missing asset name (Activo)`);
  }
  
  if (asset.currentValue <= 0) {
    errors.push(`Row ${rowIndex + 1}: Invalid or missing amount (Monto Moneda Origen)`);
  }
  
  // Symbol can be empty as some instruments might not have ISIN or Nemo Local
  if (!asset.symbol && !asset.isin && !asset.nemoLocal) {
    // This is a warning, not an error
    errors.push(`Row ${rowIndex + 1}: No identifier found (ISIN, Nemo Local, or Symbol)`);
  }
  
  return errors;
}

export function parseCSV(file: File): Promise<ParsedFileData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as FileRow[];
        const parsed = parseRowData(data, Object.keys(data[0] || {}));
        resolve(parsed);
      },
      error: (error) => {
        resolve({
          assets: [],
          errors: [`CSV parsing error: ${error.message}`]
        });
      }
    });
  });
}

export function parseExcel(file: File): Promise<ParsedFileData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Use the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          resolve({
            assets: [],
            errors: ['File must contain at least a header row and one data row']
          });
          return;
        }
        
        // First row is headers
        const headers = jsonData[0].map(h => String(h || ''));
        const rows = jsonData.slice(1).map(row => {
          const obj: FileRow = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        const parsed = parseRowData(rows, headers);
        resolve(parsed);
        
      } catch (error) {
        resolve({
          assets: [],
          errors: [`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`]
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        assets: [],
        errors: ['Failed to read file']
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function parseRowData(rows: FileRow[], headers: string[]): ParsedFileData {
  const assets: Omit<Asset, 'id'>[] = [];
  const errors: string[] = [];
  
  // Find column indices based on the specific Excel format
  const activoIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.activo);
  const unidadMonetariaIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.unidadMonetaria);
  const cantidadIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.cantidad);
  const montoIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.montoMonedaOrigen);
  const claseActivoIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.claseActivo);
  const isinIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.isin);
  const nemoIndex = findColumnIndex(headers, EXCEL_COLUMN_MAPPINGS.nemoLocal);
  
  // Log found columns for debugging
  console.log('Column mapping results:', {
    activo: activoIndex !== -1 ? headers[activoIndex] : 'NOT FOUND',
    unidadMonetaria: unidadMonetariaIndex !== -1 ? headers[unidadMonetariaIndex] : 'NOT FOUND',
    cantidad: cantidadIndex !== -1 ? headers[cantidadIndex] : 'NOT FOUND',
    monto: montoIndex !== -1 ? headers[montoIndex] : 'NOT FOUND',
    claseActivo: claseActivoIndex !== -1 ? headers[claseActivoIndex] : 'NOT FOUND',
    isin: isinIndex !== -1 ? headers[isinIndex] : 'NOT FOUND',
    nemo: nemoIndex !== -1 ? headers[nemoIndex] : 'NOT FOUND'
  });
  
  if (activoIndex === -1) {
    errors.push('Could not find "Activo" column. Expected: Activo, Asset, Nombre, Name, Descripcion, or Description');
  }
  
  if (montoIndex === -1) {
    errors.push('Could not find "Monto Moneda Origen" column. Expected: Monto Moneda Origen, Monto_Moneda_Origen, Current_Value, Valor_Actual, or Amount');
  }
  
  // If we can't find essential columns, return early
  if (activoIndex === -1 || montoIndex === -1) {
    return { assets: [], errors };
  }
  
  rows.forEach((row, index) => {
    try {
      const activo = String(row[headers[activoIndex]] || '').trim();
      const unidadMonetaria = unidadMonetariaIndex !== -1 ? String(row[headers[unidadMonetariaIndex]] || '') : '';
      const cantidad = cantidadIndex !== -1 ? parseNumericValue(row[headers[cantidadIndex]]) : undefined;
      const monto = parseNumericValue(row[headers[montoIndex]]);
      const claseActivo = claseActivoIndex !== -1 ? String(row[headers[claseActivoIndex]] || '') : '';
      const isin = isinIndex !== -1 ? String(row[headers[isinIndex]] || '').trim() : '';
      const nemoLocal = nemoIndex !== -1 ? String(row[headers[nemoIndex]] || '').trim() : '';
      
      // Skip empty rows
      if (!activo && monto === 0) {
        return;
      }
      
      // Determine symbol priority: Nemo Local > ISIN > first available identifier
      let symbol = nemoLocal || isin || activo.split(' ')[0] || `ASSET_${index + 1}`;
      
      const asset: Omit<Asset, 'id'> = {
        symbol,
        name: activo,
        category: claseActivo ? normalizeCategory(claseActivo) : 'Other',
        currentValue: monto,
        shares: cantidad && cantidad > 0 ? cantidad : undefined,
        price: cantidad && cantidad > 0 && monto > 0 ? monto / cantidad : undefined,
        currency: unidadMonetaria ? normalizeCurrency(unidadMonetaria) : undefined,
        isin: isin || undefined,
        nemoLocal: nemoLocal || undefined
      };
      
      const validationErrors = validateAsset(asset, index);
      
      // Only add non-critical errors to the error list
      const criticalErrors = validationErrors.filter(error => 
        error.includes('Missing asset name') || error.includes('Invalid or missing amount')
      );
      
      errors.push(...criticalErrors);
      
      if (criticalErrors.length === 0) {
        assets.push(asset);
      }
      
      // Add warnings for non-critical issues
      const warnings = validationErrors.filter(error => 
        error.includes('No identifier found')
      );
      if (warnings.length > 0) {
        errors.push(...warnings.map(w => `Warning: ${w}`));
      }
      
    } catch (error) {
      errors.push(`Row ${index + 1}: Error processing row - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  return { assets, errors };
}

export function downloadTemplate(currency: 'USD' | 'CLP') {
  const headers = [
    'Activo',
    'Unidad Monetaria', 
    'Cantidad',
    'Monto Moneda Origen',
    'Clase de Activo',
    'ISIN',
    'Nemo Local'
  ];
    
  const sampleData = currency === 'USD' 
    ? [
        ['Apple Inc.', 'USD', '1000', '150000', 'Renta Variable', 'US0378331005', 'AAPL'],
        ['Vanguard Total Bond Market ETF', 'USD', '800', '80000', 'Renta Fija', 'US9229087690', 'BND'],
        ['Vanguard Real Estate ETF', 'USD', '300', '30000', 'Alternativo', 'US9229086348', 'VNQ'],
        ['Money Market Fund', 'USD', '5000', '5000', 'Money Market', 'US1234567890', 'MMF'],
        ['Balanced Fund', 'USD', '2000', '20000', 'Balanceado', 'US0987654321', 'BAL']
      ]
    : [
        ['Banco de Chile', 'CLP', '1000', '15000000', 'Renta Variable', 'CL0000000001', 'CHILE'],
        ['Bono del Tesoro de Chile 10 años', 'CLP', '800', '8000000', 'Renta Fija', 'CL0000000002', 'BTU'],
        ['Fondo Inmobiliario', 'CLP', '300', '3000000', 'Alternativo', 'CL0000000003', 'REITS'],
        ['Depósito a Plazo', 'CLP', '1', '2000000', 'Caja', '', 'DAP'],
        ['Fondo Balanceado', 'CLP', '500', '5000000', 'Balanceado', 'CL0000000004', 'FBAL']
      ];
  
  const csvContent = [headers, ...sampleData]
    .map(row => row.join(','))
    .join('\n');
    
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio_template_${currency.toLowerCase()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}