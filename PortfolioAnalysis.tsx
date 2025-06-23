import React, { useState } from 'react';
import { Portfolio, InvestmentProfile, CategoryAnalysis, RebalanceRecommendation } from '../types/portfolio';
import { formatCurrency, formatPercentage } from '../utils/portfolioCalculations';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface PortfolioAnalysisProps {
  portfolio: Portfolio;
  profile: InvestmentProfile;
  gapAnalysis: CategoryAnalysis[];
  recommendations: RebalanceRecommendation[];
}

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({
  portfolio,
  profile,
  gapAnalysis,
  recommendations
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Over':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'Under':
        return <TrendingDown className="w-5 h-5 text-orange-500" />;
      case 'On Target':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Missing':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Over':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Under':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'On Target':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Missing':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{portfolio.clientName}</h3>
            <p className="text-sm text-slate-600">
              Profile: {profile.name} • Total Value: {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            Last Updated: {portfolio.lastUpdated.toLocaleDateString()}
          </div>
        </div>

        {/* Category-Level Analysis */}
        <div className="space-y-4">
          {gapAnalysis.map((analysis) => (
            <div key={analysis.category} className="border border-slate-200 rounded-lg">
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleCategory(analysis.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {expandedCategories.has(analysis.category) ? 
                        <ChevronDown className="w-5 h-5 text-slate-400" /> : 
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      }
                      <h4 className="font-medium text-slate-900 ml-2">{analysis.category}</h4>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analysis.status)}`}>
                      {getStatusIcon(analysis.status)}
                      <span className="ml-2">{analysis.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-slate-600">Current</div>
                      <div className="font-medium">{formatPercentage(analysis.currentPercentage)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-600">Target</div>
                      <div className="font-medium">{formatPercentage(analysis.targetPercentage)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-600">Gap</div>
                      <div className={`font-medium ${analysis.gap > 0 ? 'text-red-600' : analysis.gap < 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {analysis.gap > 0 ? '+' : ''}{formatPercentage(analysis.gap)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-600">Amount</div>
                      <div className={`font-medium ${analysis.gap > 0 ? 'text-red-600' : analysis.gap < 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {analysis.gap > 0 ? '+' : ''}{formatCurrency(analysis.gapAmount)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-3 relative">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        analysis.status === 'Over' ? 'bg-red-500' :
                        analysis.status === 'Under' ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(analysis.currentPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div
                    className="absolute top-0 w-0.5 h-2 bg-slate-600"
                    style={{ left: `${Math.min(analysis.targetPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Asset-Level Breakdown */}
              {expandedCategories.has(analysis.category) && analysis.assetBreakdown && (
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <h5 className="font-medium text-slate-900 mb-3">Asset Breakdown</h5>
                  <div className="space-y-2">
                    {analysis.assetBreakdown.map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(asset.status)}`}>
                            {getStatusIcon(asset.status)}
                            <span className="ml-1">{asset.status}</span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{asset.symbol}</div>
                            <div className="text-sm text-slate-600">{asset.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="text-slate-600">Current</div>
                            <div className="font-medium">{formatPercentage(asset.currentPercentage)}</div>
                            <div className="text-xs text-slate-500">{formatCurrency(asset.currentValue)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-slate-600">Target</div>
                            <div className="font-medium">{formatPercentage(asset.targetPercentage)}</div>
                            <div className="text-xs text-slate-500">{formatCurrency((asset.targetPercentage / 100) * portfolio.totalValue)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-slate-600">Gap</div>
                            <div className={`font-medium ${asset.gap > 0 ? 'text-red-600' : asset.gap < 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {asset.gap > 0 ? '+' : ''}{formatPercentage(asset.gap)}
                            </div>
                            <div className={`text-xs ${asset.gap > 0 ? 'text-red-500' : asset.gap < 0 ? 'text-orange-500' : 'text-green-500'}`}>
                              {asset.gap > 0 ? '+' : ''}{formatCurrency(asset.gapAmount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Holdings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Current Asset Holdings</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-medium text-slate-700">Symbol</th>
                <th className="text-left py-2 font-medium text-slate-700">Name</th>
                <th className="text-left py-2 font-medium text-slate-700">Category</th>
                <th className="text-right py-2 font-medium text-slate-700">Shares</th>
                <th className="text-right py-2 font-medium text-slate-700">Price</th>
                <th className="text-right py-2 font-medium text-slate-700">Value</th>
                <th className="text-right py-2 font-medium text-slate-700">Weight</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.assets.map((asset) => (
                <tr key={asset.id} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-900">{asset.symbol}</td>
                  <td className="py-2 text-slate-600">{asset.name}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      asset.category === 'Equities' ? 'bg-blue-100 text-blue-800' :
                      asset.category === 'Fixed Income' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-2 text-right">{asset.shares?.toLocaleString()}</td>
                  <td className="py-2 text-right">{formatCurrency(asset.price || 0)}</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(asset.currentValue)}</td>
                  <td className="py-2 text-right">{formatPercentage((asset.currentValue / portfolio.totalValue) * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebalancing Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            <h4 className="text-lg font-semibold text-slate-900">Detailed Rebalancing Recommendations</h4>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      rec.action === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.action}
                    </span>
                    <span className="ml-3 font-medium text-slate-900">{rec.category}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{formatCurrency(rec.amount)}</span>
                </div>
                
                <div className="space-y-2">
                  {rec.assets.map((asset, assetIndex) => (
                    <div key={assetIndex} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          asset.action === 'Buy' ? 'bg-green-100 text-green-800' : 
                          asset.action === 'Sell' ? 'bg-red-100 text-red-800' : 
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {asset.action}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900">{asset.symbol} - {asset.name}</div>
                          <div className="text-xs text-slate-600">
                            Current: {formatCurrency(asset.currentValue)} → Target: {formatCurrency(asset.targetValue)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(asset.recommendedAmount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalysis;