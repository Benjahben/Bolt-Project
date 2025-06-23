import React, { useState } from 'react';
import { InvestmentProfile, AssetAllocation } from '../types/portfolio';
import { Edit3, Save, X, Plus, Trash2, Settings } from 'lucide-react';

interface ProfileEditorProps {
  profiles: InvestmentProfile[];
  onProfilesUpdate: (profiles: InvestmentProfile[]) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profiles,
  onProfilesUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<InvestmentProfile | null>(null);
  const [localProfiles, setLocalProfiles] = useState<InvestmentProfile[]>(profiles);

  const startEditing = (profile: InvestmentProfile) => {
    setEditingProfile({ ...profile, assetAllocations: [...profile.assetAllocations] });
  };

  const cancelEditing = () => {
    setEditingProfile(null);
  };

  const saveProfile = () => {
    if (!editingProfile) return;

    const updatedProfiles = localProfiles.map(p => 
      p.id === editingProfile.id ? editingProfile : p
    );
    setLocalProfiles(updatedProfiles);
    setEditingProfile(null);
  };

  const updateCategoryAllocation = (category: string, percentage: number) => {
    if (!editingProfile) return;

    const updatedProfile = {
      ...editingProfile,
      targetAllocations: {
        ...editingProfile.targetAllocations,
        [category]: percentage
      }
    };

    // Recalculate asset allocations to maintain proportions within categories
    const categoryAssets = editingProfile.assetAllocations.filter(asset => asset.category === category);
    const totalCategoryPercentage = categoryAssets.reduce((sum, asset) => sum + asset.categoryPercentage, 0);
    
    if (totalCategoryPercentage > 0) {
      const updatedAssetAllocations = editingProfile.assetAllocations.map(asset => {
        if (asset.category === category) {
          const newTargetPercentage = (asset.categoryPercentage / totalCategoryPercentage) * percentage;
          return {
            ...asset,
            targetPercentage: newTargetPercentage
          };
        }
        return asset;
      });

      updatedProfile.assetAllocations = updatedAssetAllocations;
    }

    setEditingProfile(updatedProfile);
  };

  const updateAssetAllocation = (assetIndex: number, field: keyof AssetAllocation, value: any) => {
    if (!editingProfile) return;

    const updatedAssets = [...editingProfile.assetAllocations];
    updatedAssets[assetIndex] = { ...updatedAssets[assetIndex], [field]: value };

    // Recalculate category percentage for this asset
    if (field === 'targetPercentage') {
      const category = updatedAssets[assetIndex].category;
      const categoryTotal = editingProfile.targetAllocations[category];
      updatedAssets[assetIndex].categoryPercentage = categoryTotal > 0 ? (value / categoryTotal) * 100 : 0;
    }

    setEditingProfile({
      ...editingProfile,
      assetAllocations: updatedAssets
    });
  };

  const addAsset = (category: string) => {
    if (!editingProfile) return;

    const newAsset: AssetAllocation = {
      symbol: '',
      name: '',
      category: category as any,
      targetPercentage: 0,
      categoryPercentage: 0
    };

    setEditingProfile({
      ...editingProfile,
      assetAllocations: [...editingProfile.assetAllocations, newAsset]
    });
  };

  const removeAsset = (assetIndex: number) => {
    if (!editingProfile) return;

    const updatedAssets = editingProfile.assetAllocations.filter((_, index) => index !== assetIndex);
    setEditingProfile({
      ...editingProfile,
      assetAllocations: updatedAssets
    });
  };

  const saveAllChanges = () => {
    onProfilesUpdate(localProfiles);
    setIsOpen(false);
  };

  const resetChanges = () => {
    setLocalProfiles(profiles);
    setEditingProfile(null);
    setIsOpen(false);
  };

  const getTotalAllocation = () => {
    if (!editingProfile) return 0;
    return Object.values(editingProfile.targetAllocations).reduce((sum, val) => sum + val, 0);
  };

  const categories = ['Fixed Income', 'Equities', 'Alternative Investments'];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors flex items-center"
      >
        <Settings className="w-4 h-4 mr-2" />
        Edit Profiles
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Edit Investment Profiles</h3>
            <button
              onClick={resetChanges}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!editingProfile ? (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">
                Select a profile to edit its target allocations and asset weightings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900">{profile.name}</h4>
                        <p className="text-sm text-slate-600">{profile.currency} • {profile.riskLevel}</p>
                      </div>
                      <button
                        onClick={() => startEditing(profile)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Fixed Income:</span>
                        <span>{profile.targetAllocations['Fixed Income']}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equities:</span>
                        <span>{profile.targetAllocations['Equities']}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alternatives:</span>
                        <span>{profile.targetAllocations['Alternative Investments']}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-slate-900">{editingProfile.name}</h4>
                  <p className="text-sm text-slate-600">{editingProfile.currency} • {editingProfile.riskLevel}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </button>
                </div>
              </div>

              {/* Category Allocations */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-medium text-slate-900 mb-3">Category Allocations</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category} className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {category}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingProfile.targetAllocations[category as keyof typeof editingProfile.targetAllocations]}
                          onChange={(e) => updateCategoryAllocation(category, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm">
                  <span className={`font-medium ${getTotalAllocation() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {getTotalAllocation()}%
                  </span>
                  {getTotalAllocation() !== 100 && (
                    <span className="text-red-600 ml-2">
                      (Must equal 100%)
                    </span>
                  )}
                </div>
              </div>

              {/* Asset Allocations */}
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryAssets = editingProfile.assetAllocations.filter(asset => asset.category === category);
                  return (
                    <div key={category} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-slate-900">{category} Assets</h5>
                        <button
                          onClick={() => addAsset(category)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Asset
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {categoryAssets.map((asset, index) => {
                          const globalIndex = editingProfile.assetAllocations.findIndex(a => a === asset);
                          return (
                            <div key={globalIndex} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border">
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  placeholder="Symbol"
                                  value={asset.symbol}
                                  onChange={(e) => updateAssetAllocation(globalIndex, 'symbol', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  placeholder="Asset Name"
                                  value={asset.name}
                                  onChange={(e) => updateAssetAllocation(globalIndex, 'name', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="Target %"
                                    value={asset.targetPercentage}
                                    onChange={(e) => updateAssetAllocation(globalIndex, 'targetPercentage', parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-slate-600">%</span>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="Cat %"
                                    value={asset.categoryPercentage}
                                    onChange={(e) => updateAssetAllocation(globalIndex, 'categoryPercentage', parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-slate-600">%</span>
                                </div>
                              </div>
                              <div className="col-span-1">
                                <button
                                  onClick={() => removeAsset(globalIndex)}
                                  className="w-full h-8 text-red-600 hover:text-red-800 flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={resetChanges}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveAllChanges}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;