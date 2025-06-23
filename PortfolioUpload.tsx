import React, { useState, useCallback } from 'react';
import { Upload, FileText, Plus, X, Download, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Asset, Portfolio } from '../types/portfolio';
import { parseCSV, parseExcel, downloadTemplate, ParsedFileData } from '../utils/fileParser';

interface PortfolioUploadProps {
  onPortfolioUpload: (portfolio: Omit<Portfolio, 'id' | 'lastUpdated'>) => void;
  selectedProfileId: string;
}

const PortfolioUpload: React.FC<PortfolioUploadProps> = ({
  onPortfolioUpload,
  selectedProfileId
}) => {
  const [clientName, setClientName] = useState('');
  const [assets, setAssets] = useState<Omit<Asset, 'id'>[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResults, setParseResults] = useState<ParsedFileData | null>(null);
  const [showResults, setShowResults] = useState(false);

  const addNewAsset = () => {
    setAssets([...assets, {
      symbol: '',
      name: '',
      category: 'Equities',
      currentValue: 0,
      shares: 0,
      price: 0
    }]);
  };

  const updateAsset = (index: number, field: keyof Omit<Asset, 'id'>, value: any) => {
    const updatedAssets = [...assets];
    updatedAssets[index] = { ...updatedAssets[index], [field]: value };
    
    // Auto-calculate currentValue when shares or price changes
    if (field === 'shares' || field === 'price') {
      const shares = field === 'shares' ? value : updatedAssets[index].shares || 0;
      const price = field === 'price' ? value : updatedAssets[index].price || 0;
      updatedAssets[index].currentValue = shares * price;
    }
    
    setAssets(updatedAssets);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!clientName.trim() || assets.length === 0) return;

    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    const portfolio: Omit<Portfolio, 'id' | 'lastUpdated'> = {
      clientName: clientName.trim(),
      profileId: selectedProfileId,
      assets: assets.map((asset, index) => ({ ...asset, id: `asset-${index}` })),
      totalValue
    };

    onPortfolioUpload(portfolio);
    
    // Reset form
    setClientName('');
    setAssets([]);
    setShowManualEntry(false);
    setParseResults(null);
    setShowResults(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setParseResults(null);
    
    try {
      let results: ParsedFileData;
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        results = await parseCSV(file);
      } else if (file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
        results = await parseExcel(file);
      } else {
        results = {
          assets: [],
          errors: ['Unsupported file format. Please upload CSV or Excel files only.']
        };
      }
      
      setParseResults(results);
      setShowResults(true);
      
      if (results.assets.length > 0) {
        setAssets(results.assets);
      }
      
    } catch (error) {
      setParseResults({
        assets: [],
        errors: [`File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
      setShowResults(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const getCurrency = (): 'USD' | 'CLP' => {
    return selectedProfileId.includes('usd') ? 'USD' : 'CLP';
  };

  const getCategoryOptions = () => {
    return [
      { value: 'Equities', label: getCurrency() === 'USD' ? 'Equities' : 'Renta Variable' },
      { value: 'Fixed Income', label: getCurrency() === 'USD' ? 'Fixed Income' : 'Renta Fija' },
      { value: 'Alternative Investments', label: getCurrency() === 'USD' ? 'Alternatives' : 'Alternativos' },
      { value: 'Caja', label: 'Caja' },
      { value: 'Balanceado', label: getCurrency() === 'USD' ? 'Balanced' : 'Balanceado' },
      { value: 'Other', label: getCurrency() === 'USD' ? 'Other' : 'Otros' }
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Client Portfolio</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Client Name
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter client name"
        />
      </div>

      {!showManualEntry ? (
        <div className="space-y-4">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Need a template?</h4>
                <p className="text-sm text-blue-700">
                  Download a sample template with the correct column format for {getCurrency()} portfolios.
                </p>
              </div>
              <button
                onClick={() => downloadTemplate(getCurrency())}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto w-12 h-12 text-slate-400 mb-4" />
            <p className="text-slate-600 mb-2">Drop your CSV or Excel file here</p>
            <p className="text-sm text-slate-500 mb-4">
              Supported formats: .csv, .xlsx, .xls
            </p>
            <div className="space-y-2">
              <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                Choose File
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {isProcessing && (
                <p className="text-sm text-blue-600">Processing file...</p>
              )}
            </div>
          </div>

          {/* Expected Columns Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-slate-600 mr-2" />
              <h4 className="font-medium text-slate-900">Expected Excel Column Format</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700 mb-2">Required Columns:</p>
                <ul className="text-slate-600 space-y-1">
                  <li>• <strong>Activo</strong> - Asset name/description</li>
                  <li>• <strong>Monto Moneda Origen</strong> - Current value/amount</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-700 mb-2">Optional Columns:</p>
                <ul className="text-slate-600 space-y-1">
                  <li>• <strong>Unidad Monetaria</strong> - Currency (USD, CLP, etc.)</li>
                  <li>• <strong>Cantidad</strong> - Shares/quantity</li>
                  <li>• <strong>Clase de Activo</strong> - Asset class/category</li>
                  <li>• <strong>ISIN</strong> - International identifier</li>
                  <li>• <strong>Nemo Local</strong> - Local ticker/symbol</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-800">
                <strong>Asset Categories:</strong> Renta Fija, Renta Variable, Alternativo, Balanceado, Caja, Money Market, No Especificado, Pasivos, Dif Valorizacion
              </p>
            </div>
          </div>

          {/* Parse Results */}
          {showResults && parseResults && (
            <div className="space-y-4">
              {parseResults.assets.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-900">
                      Successfully parsed {parseResults.assets.length} assets
                    </h4>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>Total portfolio value: ${parseResults.assets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}</p>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(
                        parseResults.assets.reduce((acc, asset) => {
                          acc[asset.category] = (acc[asset.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => (
                        <span key={category} className="text-xs bg-green-100 px-2 py-1 rounded">
                          {category}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {parseResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-900">
                      {parseResults.errors.filter(e => !e.startsWith('Warning')).length} error(s) and {parseResults.errors.filter(e => e.startsWith('Warning')).length} warning(s) found
                    </h4>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="text-sm space-y-1">
                      {parseResults.errors.slice(0, 15).map((error, index) => (
                        <li key={index} className={error.startsWith('Warning') ? 'text-amber-700' : 'text-red-700'}>
                          • {error}
                        </li>
                      ))}
                      {parseResults.errors.length > 15 && (
                        <li className="font-medium text-slate-600">... and {parseResults.errors.length - 15} more issues</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center">
            <span className="text-slate-500">or</span>
          </div>
          
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors flex items-center justify-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Enter Assets Manually
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-900">Asset Holdings</h4>
            <button
              onClick={addNewAsset}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Asset
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assets.map((asset, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder={getCurrency() === 'USD' ? 'Symbol' : 'Nemotécnico'}
                    value={asset.symbol}
                    onChange={(e) => updateAsset(index, 'symbol', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder={getCurrency() === 'USD' ? 'Asset Name' : 'Nombre'}
                    value={asset.name}
                    onChange={(e) => updateAsset(index, 'name', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={asset.category}
                    onChange={(e) => updateAsset(index, 'category', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {getCategoryOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    placeholder={getCurrency() === 'USD' ? 'Shares' : 'Cantidad'}
                    value={asset.shares || ''}
                    onChange={(e) => updateAsset(index, 'shares', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder={getCurrency() === 'USD' ? 'Price' : 'Precio'}
                    value={asset.price || ''}
                    onChange={(e) => updateAsset(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    placeholder={getCurrency() === 'USD' ? 'Value' : 'Valor'}
                    value={asset.currentValue || ''}
                    onChange={(e) => updateAsset(index, 'currentValue', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeAsset(index)}
                    className="w-full h-8 text-red-600 hover:text-red-800 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              onClick={() => {
                setShowManualEntry(false);
                setParseResults(null);
                setShowResults(false);
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Back to Upload
            </button>
            <button
              onClick={handleSubmit}
              disabled={!clientName.trim() || assets.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Submit button for file upload */}
      {!showManualEntry && assets.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!clientName.trim() || assets.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Analyze Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioUpload;