import { Portfolio, InvestmentProfile, CategoryAnalysis, RebalanceRecommendation, ToleranceBand, AssetAnalysis } from '../types/portfolio';

export const calculateCategoryAllocations = (portfolio: Portfolio) => {
  const categories = {
    'Fixed Income': 0,
    'Equities': 0,
    'Alternative Investments': 0,
    'Caja': 0,
    'Balanceado': 0,
    'Other': 0
  };

  portfolio.assets.forEach(asset => {
    categories[asset.category] += asset.currentValue;
  });

  const totalValue = portfolio.totalValue;
  
  return {
    'Fixed Income': {
      value: categories['Fixed Income'],
      percentage: (categories['Fixed Income'] / totalValue) * 100
    },
    'Equities': {
      value: categories['Equities'],
      percentage: (categories['Equities'] / totalValue) * 100
    },
    'Alternative Investments': {
      value: categories['Alternative Investments'],
      percentage: (categories['Alternative Investments'] / totalValue) * 100
    },
    'Caja': {
      value: categories['Caja'],
      percentage: (categories['Caja'] / totalValue) * 100
    },
    'Balanceado': {
      value: categories['Balanceado'],
      percentage: (categories['Balanceado'] / totalValue) * 100
    },
    'Other': {
      value: categories['Other'],
      percentage: (categories['Other'] / totalValue) * 100
    }
  };
};

export const performAssetLevelAnalysis = (
  portfolio: Portfolio,
  profile: InvestmentProfile,
  category: string
): AssetAnalysis[] => {
  const categoryAssets = profile.assetAllocations.filter(allocation => allocation.category === category);
  const currentAssets = portfolio.assets.filter(asset => asset.category === category);
  
  return categoryAssets.map(targetAsset => {
    const currentAsset = currentAssets.find(asset => asset.symbol === targetAsset.symbol);
    const currentValue = currentAsset?.currentValue || 0;
    const currentPercentage = (currentValue / portfolio.totalValue) * 100;
    const targetPercentage = targetAsset.targetPercentage;
    const gap = currentPercentage - targetPercentage;
    const gapAmount = (gap / 100) * portfolio.totalValue;
    
    let status: 'Over' | 'Under' | 'On Target' | 'Missing' = 'Missing';
    if (currentValue > 0) {
      if (Math.abs(gap) <= 0.5) {
        status = 'On Target';
      } else {
        status = gap > 0 ? 'Over' : 'Under';
      }
    }

    return {
      symbol: targetAsset.symbol,
      name: targetAsset.name,
      currentValue,
      currentPercentage,
      targetPercentage,
      gap,
      gapAmount,
      status
    };
  });
};

export const performGapAnalysis = (
  portfolio: Portfolio, 
  profile: InvestmentProfile,
  toleranceBands: ToleranceBand[] = []
): CategoryAnalysis[] => {
  const currentAllocations = calculateCategoryAllocations(portfolio);
  
  return Object.entries(currentAllocations).map(([category, allocation]) => {
    const targetPercentage = profile.targetAllocations[category as keyof typeof profile.targetAllocations];
    const gap = allocation.percentage - targetPercentage;
    const gapAmount = (gap / 100) * portfolio.totalValue;
    
    const tolerance = toleranceBands.find(band => band.category === category)?.tolerance || 0;
    let status: 'Over' | 'Under' | 'On Target' = 'On Target';
    
    if (Math.abs(gap) > tolerance) {
      status = gap > 0 ? 'Over' : 'Under';
    }

    // Get asset-level breakdown for this category
    const assetBreakdown = performAssetLevelAnalysis(portfolio, profile, category);

    return {
      category,
      currentValue: allocation.value,
      currentPercentage: allocation.percentage,
      targetPercentage,
      gap,
      gapAmount,
      status,
      assetBreakdown
    };
  });
};

export const generateRebalanceRecommendations = (
  portfolio: Portfolio,
  gapAnalysis: CategoryAnalysis[]
): RebalanceRecommendation[] => {
  const recommendations: RebalanceRecommendation[] = [];

  gapAnalysis.forEach(analysis => {
    if (analysis.status !== 'On Target' && analysis.assetBreakdown) {
      const assetsNeedingRebalancing = analysis.assetBreakdown.filter(
        asset => asset.status !== 'On Target'
      );

      if (assetsNeedingRebalancing.length > 0) {
        recommendations.push({
          category: analysis.category,
          action: analysis.gap > 0 ? 'Sell' : 'Buy',
          amount: Math.abs(analysis.gapAmount),
          assets: assetsNeedingRebalancing.map(asset => {
            const targetValue = (asset.targetPercentage / 100) * portfolio.totalValue;
            const action = asset.currentValue > targetValue ? 'Sell' : 
                         asset.currentValue < targetValue ? 'Buy' : 'Hold';
            
            return {
              symbol: asset.symbol,
              name: asset.name,
              recommendedAmount: Math.abs(asset.gapAmount),
              currentValue: asset.currentValue,
              targetValue,
              action
            };
          })
        });
      }
    }
  });

  return recommendations;
};

export const formatCurrency = (amount: number, currency: 'USD' | 'CLP' = 'USD'): string => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-CL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};