import React, { useState } from 'react';
import { ToleranceBand } from '../types/portfolio';
import { Settings, Save } from 'lucide-react';

interface ToleranceSettingsProps {
  toleranceBands: ToleranceBand[];
  onToleranceChange: (bands: ToleranceBand[]) => void;
}

const ToleranceSettings: React.FC<ToleranceSettingsProps> = ({
  toleranceBands,
  onToleranceChange
}) => {
  const [localBands, setLocalBands] = useState<ToleranceBand[]>(toleranceBands);
  const [isOpen, setIsOpen] = useState(false);

  const categories = ['Fixed Income', 'Equities', 'Alternative Investments', 'Caja', 'Balanceado', 'Other'];

  const updateTolerance = (category: string, tolerance: number) => {
    const updatedBands = localBands.map(band =>
      band.category === category ? { ...band, tolerance } : band
    );
    
    // Add new category if it doesn't exist
    if (!localBands.find(band => band.category === category)) {
      updatedBands.push({ category, tolerance });
    }
    
    setLocalBands(updatedBands);
  };

  const handleSave = () => {
    onToleranceChange(localBands);
    setIsOpen(false);
  };

  const getTolerance = (category: string) => {
    return localBands.find(band => band.category === category)?.tolerance || 0;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors flex items-center"
      >
        <Settings className="w-4 h-4 mr-2" />
        Tolerance Settings
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h4 className="text-lg font-semibold text-slate-900 mb-4">Tolerance Band Settings</h4>
      <p className="text-sm text-slate-600 mb-4">
        Set tolerance bands to define acceptable deviations from target allocations before triggering rebalancing recommendations.
      </p>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="flex items-center justify-between">
            <label className="font-medium text-slate-700">{category}</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">±</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={getTolerance(category)}
                onChange={(e) => updateTolerance(category, parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default ToleranceSettings;