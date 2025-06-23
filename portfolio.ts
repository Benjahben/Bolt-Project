export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: 'Fixed Income' | 'Equities' | 'Alternative Investments' | 'Caja' | 'Balanceado' | 'Other';
  currentValue: number;
  shares?: number;
  price?: number;
  currency?: 'USD' | 'CLP' | string;
  isin?: string;
  nemoLocal?: string;
}

export interface Portfolio {
  id: string;
  clientName: string;
  profileId: string;
  currency: 'USD' | 'CLP';
  assets: Asset[];
  totalValue: number;
  lastUpdated: Date;
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  category: 'Fixed Income' | 'Equities' | 'Alternative Investments' | 'Caja' | 'Balanceado' | 'Other';
  targetPercentage: number; // Percentage of total portfolio
  categoryPercentage: number; // Percentage within the category
}

export interface InvestmentProfile {
  id: string;
  name: string;
  description: string;
  currency: 'USD' | 'CLP';
  targetAllocations: {
    'Fixed Income': number;
    'Equities': number;
    'Alternative Investments': number;
    'Caja': number;
    'Balanceado': number;
    'Other': number;
  };
  assetAllocations: AssetAllocation[]; // Detailed asset-level allocations
  riskLevel: 'Preservation' | 'Conservative' | 'Moderate' | 'Aggressive';
}

export interface CategoryAnalysis {
  category: string;
  currentValue: number;
  currentPercentage: number;
  targetPercentage: number;
  gap: number;
  gapAmount: number;
  status: 'Over' | 'Under' | 'On Target';
  assetBreakdown?: AssetAnalysis[];
}

export interface AssetAnalysis {
  symbol: string;
  name: string;
  currentValue: number;
  currentPercentage: number;
  targetPercentage: number;
  gap: number;
  gapAmount: number;
  status: 'Over' | 'Under' | 'On Target' | 'Missing';
}

export interface RebalanceRecommendation {
  category: string;
  action: 'Buy' | 'Sell';
  amount: number;
  assets: {
    symbol: string;
    name: string;
    recommendedAmount: number;
    currentValue: number;
    targetValue: number;
    action: 'Buy' | 'Sell' | 'Hold';
  }[];
}

export interface ToleranceBand {
  category: string;
  tolerance: number;
}