import { InvestmentProfile, Portfolio, Asset } from '../types/portfolio';

// USD Profiles
export const usdProfiles: InvestmentProfile[] = [
  {
    id: 'usd-preservation',
    name: 'Capital Preservation',
    description: 'Ultra-conservative, capital protection focused',
    currency: 'USD',
    targetAllocations: {
      'Fixed Income': 70,
      'Equities': 10,
      'Alternative Investments': 5,
      'Caja': 10,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (70% total)
      { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Fixed Income', targetPercentage: 25, categoryPercentage: 35.7 },
      { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'Fixed Income', targetPercentage: 20, categoryPercentage: 28.6 },
      { symbol: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'Fixed Income', targetPercentage: 15, categoryPercentage: 21.4 },
      { symbol: 'VTEB', name: 'Vanguard Tax-Exempt Bond ETF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 14.3 },
      
      // Equities (10% total)
      { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', category: 'Equities', targetPercentage: 6, categoryPercentage: 60.0 },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equities', targetPercentage: 4, categoryPercentage: 40.0 },
      
      // Alternative Investments (5% total)
      { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Alternative Investments', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Caja (10% total)
      { symbol: 'VMOT', name: 'Vanguard Short-Term Treasury ETF', category: 'Caja', targetPercentage: 10, categoryPercentage: 100.0 },
      
      // Balanceado (5% total)
      { symbol: 'VBAL', name: 'Vanguard Balanced ETF', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Preservation'
  },
  {
    id: 'usd-conservative',
    name: 'Conservative Growth',
    description: 'Low risk, income and modest growth',
    currency: 'USD',
    targetAllocations: {
      'Fixed Income': 50,
      'Equities': 25,
      'Alternative Investments': 10,
      'Caja': 10,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (50% total)
      { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Fixed Income', targetPercentage: 20, categoryPercentage: 40.0 },
      { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'Fixed Income', targetPercentage: 15, categoryPercentage: 30.0 },
      { symbol: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 20.0 },
      { symbol: 'VTEB', name: 'Vanguard Tax-Exempt Bond ETF', category: 'Fixed Income', targetPercentage: 5, categoryPercentage: 10.0 },
      
      // Equities (25% total)
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equities', targetPercentage: 15, categoryPercentage: 60.0 },
      { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'Equities', targetPercentage: 10, categoryPercentage: 40.0 },
      
      // Alternative Investments (10% total)
      { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'Alternative Investments', targetPercentage: 6, categoryPercentage: 60.0 },
      { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 40.0 },
      
      // Caja (10% total)
      { symbol: 'VMOT', name: 'Vanguard Short-Term Treasury ETF', category: 'Caja', targetPercentage: 10, categoryPercentage: 100.0 },
      
      // Balanceado (5% total)
      { symbol: 'VBAL', name: 'Vanguard Balanced ETF', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Conservative'
  },
  {
    id: 'usd-moderate',
    name: 'Moderate Growth',
    description: 'Balanced risk, growth and income',
    currency: 'USD',
    targetAllocations: {
      'Fixed Income': 35,
      'Equities': 40,
      'Alternative Investments': 10,
      'Caja': 5,
      'Balanceado': 10,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (35% total)
      { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Fixed Income', targetPercentage: 15, categoryPercentage: 42.9 },
      { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 28.6 },
      { symbol: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 28.6 },
      
      // Equities (40% total)
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equities', targetPercentage: 20, categoryPercentage: 50.0 },
      { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'Equities', targetPercentage: 15, categoryPercentage: 37.5 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Equities', targetPercentage: 5, categoryPercentage: 12.5 },
      
      // Alternative Investments (10% total)
      { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'Alternative Investments', targetPercentage: 6, categoryPercentage: 60.0 },
      { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 40.0 },
      
      // Caja (5% total)
      { symbol: 'VMOT', name: 'Vanguard Short-Term Treasury ETF', category: 'Caja', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Balanceado (10% total)
      { symbol: 'VBAL', name: 'Vanguard Balanced ETF', category: 'Balanceado', targetPercentage: 10, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Moderate'
  },
  {
    id: 'usd-aggressive',
    name: 'Aggressive Growth',
    description: 'High risk, maximum growth potential',
    currency: 'USD',
    targetAllocations: {
      'Fixed Income': 15,
      'Equities': 60,
      'Alternative Investments': 15,
      'Caja': 5,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (15% total)
      { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 66.7 },
      { symbol: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'Fixed Income', targetPercentage: 5, categoryPercentage: 33.3 },
      
      // Equities (60% total)
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equities', targetPercentage: 25, categoryPercentage: 41.7 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Equities', targetPercentage: 20, categoryPercentage: 33.3 },
      { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'Equities', targetPercentage: 15, categoryPercentage: 25.0 },
      
      // Alternative Investments (15% total)
      { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'Alternative Investments', targetPercentage: 8, categoryPercentage: 53.3 },
      { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 26.7 },
      { symbol: 'PDBC', name: 'Invesco Optimum Yield Diversified Commodity', category: 'Alternative Investments', targetPercentage: 3, categoryPercentage: 20.0 },
      
      // Caja (5% total)
      { symbol: 'VMOT', name: 'Vanguard Short-Term Treasury ETF', category: 'Caja', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Balanceado (5% total)
      { symbol: 'VBAL', name: 'Vanguard Balanced ETF', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Aggressive'
  }
];

// CLP Profiles
export const clpProfiles: InvestmentProfile[] = [
  {
    id: 'clp-preservation',
    name: 'Preservación de Capital',
    description: 'Ultra conservador, enfocado en protección de capital',
    currency: 'CLP',
    targetAllocations: {
      'Fixed Income': 70,
      'Equities': 5,
      'Alternative Investments': 5,
      'Caja': 15,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (70% total)
      { symbol: 'BTU', name: 'Bono del Tesoro de Chile 10 años', category: 'Fixed Income', targetPercentage: 30, categoryPercentage: 42.9 },
      { symbol: 'BCP', name: 'Bonos Corporativos Chile', category: 'Fixed Income', targetPercentage: 25, categoryPercentage: 35.7 },
      { symbol: 'UF', name: 'Depósitos UF', category: 'Fixed Income', targetPercentage: 15, categoryPercentage: 21.4 },
      
      // Equities (5% total)
      { symbol: 'IPSA', name: 'Índice IPSA', category: 'Equities', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Alternative Investments (5% total)
      { symbol: 'GOLD-CLP', name: 'Oro en Pesos Chilenos', category: 'Alternative Investments', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Caja (15% total)
      { symbol: 'DAP', name: 'Depósitos a Plazo', category: 'Caja', targetPercentage: 10, categoryPercentage: 66.7 },
      { symbol: 'MM-CLP', name: 'Money Market CLP', category: 'Caja', targetPercentage: 5, categoryPercentage: 33.3 },
      
      // Balanceado (5% total)
      { symbol: 'FBAL-CLP', name: 'Fondo Balanceado Chile', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Preservation'
  },
  {
    id: 'clp-conservative',
    name: 'Crecimiento Conservador',
    description: 'Bajo riesgo, ingresos y crecimiento modesto',
    currency: 'CLP',
    targetAllocations: {
      'Fixed Income': 55,
      'Equities': 20,
      'Alternative Investments': 10,
      'Caja': 10,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (55% total)
      { symbol: 'BTU', name: 'Bono del Tesoro de Chile 10 años', category: 'Fixed Income', targetPercentage: 25, categoryPercentage: 45.5 },
      { symbol: 'BCP', name: 'Bonos Corporativos Chile', category: 'Fixed Income', targetPercentage: 20, categoryPercentage: 36.4 },
      { symbol: 'UF', name: 'Depósitos UF', category: 'Fixed Income', targetPercentage: 10, categoryPercentage: 18.2 },
      
      // Equities (20% total)
      { symbol: 'IPSA', name: 'Índice IPSA', category: 'Equities', targetPercentage: 15, categoryPercentage: 75.0 },
      { symbol: 'IGPA', name: 'Índice General de Precios de Acciones', category: 'Equities', targetPercentage: 5, categoryPercentage: 25.0 },
      
      // Alternative Investments (10% total)
      { symbol: 'REITS-CLP', name: 'REITs Chile', category: 'Alternative Investments', targetPercentage: 6, categoryPercentage: 60.0 },
      { symbol: 'GOLD-CLP', name: 'Oro en Pesos Chilenos', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 40.0 },
      
      // Caja (10% total)
      { symbol: 'DAP', name: 'Depósitos a Plazo', category: 'Caja', targetPercentage: 10, categoryPercentage: 100.0 },
      
      // Balanceado (5% total)
      { symbol: 'FBAL-CLP', name: 'Fondo Balanceado Chile', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Conservative'
  },
  {
    id: 'clp-moderate',
    name: 'Crecimiento Moderado',
    description: 'Riesgo equilibrado, crecimiento e ingresos',
    currency: 'CLP',
    targetAllocations: {
      'Fixed Income': 35,
      'Equities': 40,
      'Alternative Investments': 10,
      'Caja': 5,
      'Balanceado': 10,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (35% total)
      { symbol: 'BTU', name: 'Bono del Tesoro de Chile 10 años', category: 'Fixed Income', targetPercentage: 18, categoryPercentage: 51.4 },
      { symbol: 'BCP', name: 'Bonos Corporativos Chile', category: 'Fixed Income', targetPercentage: 12, categoryPercentage: 34.3 },
      { symbol: 'UF', name: 'Depósitos UF', category: 'Fixed Income', targetPercentage: 5, categoryPercentage: 14.3 },
      
      // Equities (40% total)
      { symbol: 'IPSA', name: 'Índice IPSA', category: 'Equities', targetPercentage: 25, categoryPercentage: 62.5 },
      { symbol: 'IGPA', name: 'Índice General de Precios de Acciones', category: 'Equities', targetPercentage: 15, categoryPercentage: 37.5 },
      
      // Alternative Investments (10% total)
      { symbol: 'REITS-CLP', name: 'REITs Chile', category: 'Alternative Investments', targetPercentage: 6, categoryPercentage: 60.0 },
      { symbol: 'GOLD-CLP', name: 'Oro en Pesos Chilenos', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 40.0 },
      
      // Caja (5% total)
      { symbol: 'DAP', name: 'Depósitos a Plazo', category: 'Caja', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Balanceado (10% total)
      { symbol: 'FBAL-CLP', name: 'Fondo Balanceado Chile', category: 'Balanceado', targetPercentage: 10, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Moderate'
  },
  {
    id: 'clp-aggressive',
    name: 'Crecimiento Agresivo',
    description: 'Alto riesgo, máximo potencial de crecimiento',
    currency: 'CLP',
    targetAllocations: {
      'Fixed Income': 20,
      'Equities': 55,
      'Alternative Investments': 15,
      'Caja': 5,
      'Balanceado': 5,
      'Other': 0
    },
    assetAllocations: [
      // Fixed Income (20% total)
      { symbol: 'BTU', name: 'Bono del Tesoro de Chile 10 años', category: 'Fixed Income', targetPercentage: 12, categoryPercentage: 60.0 },
      { symbol: 'BCP', name: 'Bonos Corporativos Chile', category: 'Fixed Income', targetPercentage: 8, categoryPercentage: 40.0 },
      
      // Equities (55% total)
      { symbol: 'IPSA', name: 'Índice IPSA', category: 'Equities', targetPercentage: 30, categoryPercentage: 54.5 },
      { symbol: 'IGPA', name: 'Índice General de Precios de Acciones', category: 'Equities', targetPercentage: 20, categoryPercentage: 36.4 },
      { symbol: 'MSCI-CL', name: 'MSCI Chile', category: 'Equities', targetPercentage: 5, categoryPercentage: 9.1 },
      
      // Alternative Investments (15% total)
      { symbol: 'REITS-CLP', name: 'REITs Chile', category: 'Alternative Investments', targetPercentage: 8, categoryPercentage: 53.3 },
      { symbol: 'GOLD-CLP', name: 'Oro en Pesos Chilenos', category: 'Alternative Investments', targetPercentage: 4, categoryPercentage: 26.7 },
      { symbol: 'COMM-CLP', name: 'Commodities Chile', category: 'Alternative Investments', targetPercentage: 3, categoryPercentage: 20.0 },
      
      // Caja (5% total)
      { symbol: 'DAP', name: 'Depósitos a Plazo', category: 'Caja', targetPercentage: 5, categoryPercentage: 100.0 },
      
      // Balanceado (5% total)
      { symbol: 'FBAL-CLP', name: 'Fondo Balanceado Chile', category: 'Balanceado', targetPercentage: 5, categoryPercentage: 100.0 }
    ],
    riskLevel: 'Aggressive'
  }
];

export const investmentProfiles = [...usdProfiles, ...clpProfiles];

export const sampleAssets: Asset[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', category: 'Equities', currentValue: 150000, shares: 1000, price: 150 },
  { id: '2', symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Fixed Income', currentValue: 80000, shares: 800, price: 100 },
  { id: '3', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equities', currentValue: 120000, shares: 500, price: 240 },
  { id: '4', symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'Alternative Investments', currentValue: 30000, shares: 300, price: 100 },
  { id: '5', symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'Fixed Income', currentValue: 60000, shares: 600, price: 100 },
  { id: '6', symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Equities', currentValue: 90000, shares: 300, price: 300 },
  { id: '7', symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Alternative Investments', currentValue: 20000, shares: 100, price: 200 },
  { id: '8', symbol: 'JPGB', name: 'JPM Global Corporate Bond ETF', category: 'Fixed Income', currentValue: 45000, shares: 450, price: 100 },
  { id: '9', symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'Equities', currentValue: 75000, shares: 1250, price: 60 },
  { id: '10', symbol: 'VMOT', name: 'Vanguard Short-Term Treasury ETF', category: 'Caja', currentValue: 25000, shares: 250, price: 100 },
  { id: '11', symbol: 'VBAL', name: 'Vanguard Balanced ETF', category: 'Balanceado', currentValue: 15000, shares: 150, price: 100 }
];

export const samplePortfolios: Portfolio[] = [
  {
    id: 'portfolio-1',
    clientName: 'Johnson Family Trust',
    profileId: 'usd-moderate',
    currency: 'USD',
    assets: [
      sampleAssets[1], // BND
      sampleAssets[2], // VTI
      sampleAssets[3], // VNQ
      sampleAssets[4], // TLT
      sampleAssets[5], // QQQ
      sampleAssets[6], // GLD
      sampleAssets[7], // JPGB
      sampleAssets[8], // VXUS
      sampleAssets[9], // VMOT
      sampleAssets[10] // VBAL
    ],
    totalValue: 560000,
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'portfolio-2',
    clientName: 'Smith Retirement Account',
    profileId: 'usd-conservative',
    currency: 'USD',
    assets: [
      sampleAssets[1], // BND
      sampleAssets[2], // VTI
      sampleAssets[4], // TLT
      sampleAssets[6], // GLD
      sampleAssets[7], // JPGB
      sampleAssets[8], // VXUS
      sampleAssets[9]  // VMOT
    ],
    totalValue: 405000,
    lastUpdated: new Date('2024-01-10')
  }
];