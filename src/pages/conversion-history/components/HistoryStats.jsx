import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoryStats = ({ totalConversions, totalSize, successRate }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const stats = [
    {
      label: 'Total Conversions',
      value: totalConversions?.toLocaleString(),
      icon: 'FileImage',
      color: 'text-primary'
    },
    {
      label: 'Total Size Processed',
      value: formatFileSize(totalSize),
      icon: 'HardDrive',
      color: 'text-accent'
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: 'TrendingUp',
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Session Summary</h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={16} />
          <span>Current Session</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className={`p-2 rounded-lg bg-background ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold text-text-primary">
                {stat?.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat?.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryStats;