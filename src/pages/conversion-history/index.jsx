import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HistoryStats from './components/HistoryStats';
import HistoryFilters from './components/HistoryFilters';
import HistoryCard from './components/HistoryCard';
import EmptyHistory from './components/EmptyHistory';
import { usePlan } from '../../context/PlanContext';
import { fetchUserHistory } from '../../utils/history';

const ConversionHistory = () => {
  const { userId } = usePlan();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ format: 'all', status: 'all' });
  const [sortBy, setSortBy] = useState('newest');
  const [historyRows, setHistoryRows] = useState(null); // null=loading, []=empty

  // Mock conversion history data
  const mockHistoryData = [
    {
      id: 1,
      originalName: 'product-image-1.jpg',
      sourceFormat: 'jpg',
      targetFormat: 'webp',
      fileSize: 2456789,
      timestamp: new Date('2025-01-12T10:30:00'),
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      originalName: 'logo-design.png',
      sourceFormat: 'png',
      targetFormat: 'svg',
      fileSize: 1234567,
      timestamp: new Date('2025-01-12T09:45:00'),
      status: 'completed',
      thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 3,
      originalName: 'banner-image.webp',
      sourceFormat: 'webp',
      targetFormat: 'jpg',
      fileSize: 3456789,
      timestamp: new Date('2025-01-12T09:15:00'),
      status: 'processing',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 4,
      originalName: 'profile-photo.jpg',
      sourceFormat: 'jpg',
      targetFormat: 'png',
      fileSize: 987654,
      timestamp: new Date('2025-01-12T08:30:00'),
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 5,
      originalName: 'icon-set.svg',
      sourceFormat: 'svg',
      targetFormat: 'png',
      fileSize: 456789,
      timestamp: new Date('2025-01-12T07:45:00'),
      status: 'failed',
      thumbnail: null
    },
    {
      id: 6,
      originalName: 'background-texture.png',
      sourceFormat: 'png',
      targetFormat: 'webp',
      fileSize: 5678901,
      timestamp: new Date('2025-01-12T07:00:00'),
      status: 'completed',
      thumbnail: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 7,
      originalName: 'social-media-post.jpg',
      sourceFormat: 'jpg',
      targetFormat: 'webp',
      fileSize: 1876543,
      timestamp: new Date('2025-01-11T16:20:00'),
      status: 'completed',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/21/12/51/mobile-phone-1845233_1280.jpg?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 8,
      originalName: 'presentation-slide.png',
      sourceFormat: 'png',
      targetFormat: 'jpg',
      fileSize: 2987654,
      timestamp: new Date('2025-01-11T15:10:00'),
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center'
    }
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchUserHistory(userId);
      if (!mounted) return;
      if (res?.ok && Array.isArray(res.data)) {
        setHistoryRows(res.data);
      } else {
        setHistoryRows([]);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  const sourceData = (historyRows && historyRows.length > 0)
    ? historyRows.map((r, idx) => ({
        id: r.id || idx,
        originalName: r.file_name,
        sourceFormat: r.source_format,
        targetFormat: r.target_format,
        fileSize: r.file_size,
        timestamp: r.created_at ? new Date(r.created_at) : new Date(),
        status: r.status || 'completed',
        thumbnail: null,
      }))
    : mockHistoryData;

  // Calculate stats
  const stats = useMemo(() => {
    const totalConversions = sourceData?.length;
    const totalSize = sourceData?.reduce((sum, entry) => sum + (entry?.fileSize || 0), 0);
    const completedConversions = sourceData?.filter(entry => entry?.status === 'completed')?.length;
    const successRate = totalConversions > 0 ? Math.round((completedConversions / totalConversions) * 100) : 0;

    return {
      totalConversions,
      totalSize,
      successRate
    };
  }, [sourceData]);

  // Filter and sort history data
  const filteredAndSortedHistory = useMemo(() => {
  let filtered = sourceData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(entry =>
        entry?.originalName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply format filter
    if (filters?.format !== 'all') {
      filtered = filtered?.filter(entry =>
        entry?.sourceFormat === filters?.format || entry?.targetFormat === filters?.format
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(entry => entry?.status === filters?.status);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'name':
          return a?.originalName?.localeCompare(b?.originalName);
        case 'size':
          return b?.fileSize - a?.fileSize;
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    return filtered;
  }, [sourceData, searchTerm, filters, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleRedownload = (entry) => {
    // Mock download functionality
    console.log('Redownloading:', entry?.originalName);
    // In a real app, this would trigger the download
  };

  const handleDelete = (entry) => {
    if (window.confirm(`Are you sure you want to delete "${entry?.originalName}" from history?`)) {
      console.log('Deleting:', entry?.originalName);
      // In a real app, this would remove the entry from history
    }
  };

  const handleConvertAgain = (entry) => {
    console.log('Converting again:', entry?.originalName);
    // In a real app, this would redirect to conversion page with pre-filled data
  };

  const handleClearAll = () => {
    console.log('Clearing all history or downloading all files');
    // In a real app, this would handle bulk operations
  };

  return (
    <>
      <Helmet>
  <title>Conversion History - Img V2 Pro</title>
        <meta name="description" content="View and manage your image conversion history. Re-download converted files and track your conversion activity." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header onTabChange={() => {}} />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Conversion History
              </h1>
              <p className="text-text-secondary">
                Track your image conversions and re-download your files
              </p>
            </div>

            {sourceData?.length > 0 ? (
              <>
                {/* Stats */}
                <HistoryStats
                  totalConversions={stats?.totalConversions}
                  totalSize={stats?.totalSize}
                  successRate={stats?.successRate}
                />

                {/* Filters */}
                <HistoryFilters
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  onClearAll={handleClearAll}
                />

                {/* History List */}
                <div className="space-y-4">
                  {filteredAndSortedHistory?.length > 0 ? (
                    filteredAndSortedHistory?.map((entry) => (
                      <HistoryCard
                        key={entry?.id}
                        entry={entry}
                        onRedownload={handleRedownload}
                        onDelete={handleDelete}
                        onConvertAgain={handleConvertAgain}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-text-secondary">
                        No conversions found matching your filters.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <EmptyHistory />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ConversionHistory;