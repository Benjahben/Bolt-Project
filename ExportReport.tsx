import React from 'react';
import { Portfolio, InvestmentProfile, CategoryAnalysis, RebalanceRecommendation } from '../types/portfolio';
import { Download, FileText, Table } from 'lucide-react';

interface ExportReportProps {
  portfolio: Portfolio;
  profile: InvestmentProfile;
  gapAnalysis: CategoryAnalysis[];
  recommendations: RebalanceRecommendation[];
}

const ExportReport: React.FC<ExportReportProps> = ({
  portfolio,
  profile,
  gapAnalysis,
  recommendations
}) => {
  const generateCSVData = () => {
    const headers = ['Category', 'Current %', 'Target %', 'Gap %', 'Gap Amount', 'Status'];
    const rows = gapAnalysis.map(analysis => [
      analysis.category,
      analysis.currentPercentage.toFixed(1),
      analysis.targetPercentage.toFixed(1),
      analysis.gap.toFixed(1),
      analysis.gapAmount.toFixed(0),
      analysis.status
    ]);
    
    return [headers, ...rows];
  };

  const downloadCSV = () => {
    const csvData = generateCSVData();
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.clientName}_Rebalancing_Report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Portfolio Rebalancing Report - ${portfolio.clientName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .status-over { color: #dc2626; }
            .status-under { color: #ea580c; }
            .status-target { color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Portfolio Rebalancing Report</h1>
            <p><strong>Client:</strong> ${portfolio.clientName}</p>
            <p><strong>Profile:</strong> ${profile.name}</p>
            <p><strong>Total Portfolio Value:</strong> $${portfolio.totalValue.toLocaleString()}</p>
            <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Gap Analysis</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Current %</th>
                  <th>Target %</th>
                  <th>Gap %</th>
                  <th>Gap Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${gapAnalysis.map(analysis => `
                  <tr>
                    <td>${analysis.category}</td>
                    <td>${analysis.currentPercentage.toFixed(1)}%</td>
                    <td>${analysis.targetPercentage.toFixed(1)}%</td>
                    <td>${analysis.gap > 0 ? '+' : ''}${analysis.gap.toFixed(1)}%</td>
                    <td>$${analysis.gapAmount.toLocaleString()}</td>
                    <td class="status-${analysis.status.toLowerCase().replace(' ', '-')}">${analysis.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          ${recommendations.length > 0 ? `
          <div class="section">
            <h2>Rebalancing Recommendations</h2>
            ${recommendations.map(rec => `
              <h3>${rec.action} ${rec.category} - $${rec.amount.toLocaleString()}</h3>
              <table>
                <thead>
                  <tr><th>Symbol</th><th>Name</th><th>Recommended Amount</th></tr>
                </thead>
                <tbody>
                  ${rec.assets.map(asset => `
                    <tr>
                      <td>${asset.symbol}</td>
                      <td>${asset.name}</td>
                      <td>$${asset.recommendedAmount.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `).join('')}
          </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h4 className="text-lg font-semibold text-slate-900 mb-4">Export Report</h4>
      <p className="text-sm text-slate-600 mb-4">
        Generate reports for client presentation and record keeping.
      </p>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Table className="w-4 h-4 mr-2" />
          Export to CSV
        </button>
        
        <button
          onClick={generatePDFReport}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate PDF Report
        </button>
        
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ExportReport;