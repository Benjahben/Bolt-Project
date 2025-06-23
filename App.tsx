import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CurrencySelector from './components/CurrencySelector';
import ProfileSelector from './components/ProfileSelector';
import ProfileEditor from './components/ProfileEditor';
import PortfolioUpload from './components/PortfolioUpload';
import PortfolioAnalysis from './components/PortfolioAnalysis';
import ToleranceSettings from './components/ToleranceSettings';
import ExportReport from './components/ExportReport';
import { investmentProfiles, samplePortfolios } from './data/mockData';
import { Portfolio, InvestmentProfile, CategoryAnalysis, RebalanceRecommendation, ToleranceBand } from './types/portfolio';
import { performGapAnalysis, generateRebalanceRecommendations } from './utils/portfolioCalculations';

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'CLP'>('USD');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [profiles, setProfiles] = useState<InvestmentProfile[]>(investmentProfiles);
  const [toleranceBands, setToleranceBands] = useState<ToleranceBand[]>([
    { category: 'Fixed Income', tolerance: 2 },
    { category: 'Equities', tolerance: 3 },
    { category: 'Alternative Investments', tolerance: 1 },
    { category: 'Caja', tolerance: 1 },
    { category: 'Balanceado', tolerance: 2 },
    { category: 'Other', tolerance: 1 }
  ]);

  // Filter profiles by selected currency
  const availableProfiles = profiles.filter(p => p.currency === selectedCurrency);

  // Set default profile when currency changes
  useEffect(() => {
    if (availableProfiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(availableProfiles[0].id);
    } else if (availableProfiles.length > 0 && !availableProfiles.find(p => p.id === selectedProfileId)) {
      setSelectedProfileId(availableProfiles[0].id);
    }
  }, [selectedCurrency, availableProfiles, selectedProfileId]);

  // Load sample portfolio on mount
  useEffect(() => {
    const currencyPortfolios = samplePortfolios.filter(p => p.currency === selectedCurrency);
    if (currencyPortfolios.length > 0) {
      setCurrentPortfolio(currencyPortfolios[0]);
    } else {
      setCurrentPortfolio(null);
    }
  }, [selectedCurrency]);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  
  const handlePortfolioUpload = (portfolioData: Omit<Portfolio, 'id' | 'lastUpdated'>) => {
    const newPortfolio: Portfolio = {
      ...portfolioData,
      id: `portfolio-${Date.now()}`,
      currency: selectedCurrency,
      lastUpdated: new Date()
    };
    setCurrentPortfolio(newPortfolio);
  };

  const gapAnalysis: CategoryAnalysis[] = currentPortfolio && selectedProfile
    ? performGapAnalysis(currentPortfolio, selectedProfile, toleranceBands)
    : [];

  const recommendations: RebalanceRecommendation[] = currentPortfolio && gapAnalysis.length > 0
    ? generateRebalanceRecommendations(currentPortfolio, gapAnalysis)
    : [];

  const loadSamplePortfolio = (portfolio: Portfolio) => {
    setCurrentPortfolio(portfolio);
    setSelectedProfileId(portfolio.profileId);
  };

  const handleCurrencyChange = (currency: 'USD' | 'CLP') => {
    setSelectedCurrency(currency);
    setCurrentPortfolio(null);
    setSelectedProfileId('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Currency Selection */}
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencySelect={handleCurrencyChange}
          />

          {/* Investment Profile Selection */}
          {availableProfiles.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <ProfileSelector
                  profiles={availableProfiles}
                  selectedProfileId={selectedProfileId}
                  onProfileSelect={setSelectedProfileId}
                />
              </div>
              <div className="ml-4">
                <ProfileEditor
                  profiles={profiles}
                  onProfilesUpdate={setProfiles}
                />
              </div>
            </div>
          )}

          {/* Portfolio Upload */}
          {selectedProfileId && (
            <PortfolioUpload
              onPortfolioUpload={handlePortfolioUpload}
              selectedProfileId={selectedProfileId}
            />
          )}

          {/* Sample Portfolio Selector */}
          {samplePortfolios.filter(p => p.currency === selectedCurrency).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Or Try Sample Portfolios</h3>
              <div className="flex flex-wrap gap-3">
                {samplePortfolios
                  .filter(portfolio => portfolio.currency === selectedCurrency)
                  .map((portfolio) => (
                    <button
                      key={portfolio.id}
                      onClick={() => loadSamplePortfolio(portfolio)}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      {portfolio.clientName}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Controls */}
          {currentPortfolio && (
            <div className="flex justify-between items-center">
              <ToleranceSettings
                toleranceBands={toleranceBands}
                onToleranceChange={setToleranceBands}
              />
              
              {selectedProfile && (
                <ExportReport
                  portfolio={currentPortfolio}
                  profile={selectedProfile}
                  gapAnalysis={gapAnalysis}
                  recommendations={recommendations}
                />
              )}
            </div>
          )}

          {/* Portfolio Analysis */}
          {currentPortfolio && selectedProfile && (
            <PortfolioAnalysis
              portfolio={currentPortfolio}
              profile={selectedProfile}
              gapAnalysis={gapAnalysis}
              recommendations={recommendations}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;