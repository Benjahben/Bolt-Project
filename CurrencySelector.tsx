import React from 'react';
import { DollarSign, Banknote } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: 'USD' | 'CLP';
  onCurrencySelect: (currency: 'USD' | 'CLP') => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencySelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Currency</h3>
      <p className="text-sm text-slate-600 mb-4">
        Choose the base currency for your investment profiles and portfolio analysis.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedCurrency === 'USD'
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => onCurrencySelect('USD')}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              selectedCurrency === 'USD' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">US Dollar</h4>
              <p className="text-sm text-slate-600">USD</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            International markets, ETFs, and global diversification strategies.
          </p>
        </div>

        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedCurrency === 'CLP'
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => onCurrencySelect('CLP')}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              selectedCurrency === 'CLP' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Chilean Peso</h4>
              <p className="text-sm text-slate-600">CLP</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Local Chilean market instruments, bonds, and domestic investment strategies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;