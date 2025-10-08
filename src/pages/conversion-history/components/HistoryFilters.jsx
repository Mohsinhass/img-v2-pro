import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const HistoryFilters = ({ onSearch, onFilterChange, onSortChange, onClearAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isExpanded, setIsExpanded] = useState(false);

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'svg', label: 'SVG' },
    { value: 'webp', label: 'WEBP' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'File Name' },
    { value: 'size', label: 'File Size' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFormatChange = (value) => {
    setSelectedFormat(value);
    onFilterChange({ format: value, status: selectedStatus });
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    onFilterChange({ format: selectedFormat, status: value });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFormat('all');
    setSelectedStatus('all');
    setSortBy('newest');
    onSearch('');
    onFilterChange({ format: 'all', status: 'all' });
    onSortChange('newest');
  };

  return (
    <div className="bg-card border border-border rounded-lg mb-6">
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          Search & Filters
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Format Filter */}
          <Select
            options={formatOptions}
            value={selectedFormat}
            onChange={handleFormatChange}
            placeholder="Filter by format"
          />

          {/* Status Filter */}
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Filter by status"
          />

          {/* Sort */}
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={handleSortChange}
            placeholder="Sort by"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onClearAll}
            >
              Download All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
                  onClearAll();
                }
              }}
            >
              Clear History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryFilters;