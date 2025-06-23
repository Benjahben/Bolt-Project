import React from 'react';
import { InvestmentProfile } from '../types/portfolio';
import { Shield, TrendingUp, Zap, Target } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: InvestmentProfile[];
  selectedProfileId: string;
  onProfileSelect: (profileId: string) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedProfileId,
  onProfileSelect
}) => {
  const getProfileIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Preservation':
        return <Target className="w-5 h-5" />;
      case 'Conservative':
        return <Shield className="w-5 h-5" />;
      case 'Moderate':
        return <TrendingUp className="w-5 h-5" />;
      case 'Aggressive':
        return <Zap className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Preservation':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'Conservative':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Aggressive':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Investment Profiles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProfileId === profile.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => onProfileSelect(profile.id)}
          >
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getRiskColor(profile.riskLevel)}`}>
              {getProfileIcon(profile.riskLevel)}
              <span className="ml-2">{profile.riskLevel}</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">{profile.name}</h4>
            <p className="text-sm text-slate-600 mb-4">{profile.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Fixed Income:</span>
                <span className="font-medium">{profile.targetAllocations['Fixed Income']}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Equities:</span>
                <span className="font-medium">{profile.targetAllocations['Equities']}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Alternatives:</span>
                <span className="font-medium">{profile.targetAllocations['Alternative Investments']}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSelector;