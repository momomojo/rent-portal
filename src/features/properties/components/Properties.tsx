import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/SelectNew';
import { LoadingFallback, PageLoadingFallback } from '@/components/LoadingFallback';
import { PropertyCard } from './PropertyCard';
import { PropertyErrorBoundary } from './PropertyErrorBoundary';
import { Input } from '@/components/ui/Input';
import { fetchProperties } from '../api/properties';
import { usePropertyFilters } from '../hooks/usePropertyFilters';
import { Plus, Filter, RefreshCw, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { useInView } from 'react-intersection-observer';

export const Properties = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, resetFilters, hasActiveFilters } = usePropertyFilters();
  const { ref: loadMoreRef, inView } = useInView();
  
  const {
    data: properties,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
    keepPreviousData: true,
    retry: 2
  });

  // Load more properties when scrolling to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  return (
    <PropertyErrorBoundary>
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Properties</h1>
            <p className="text-muted-foreground">
              Manage and view all properties
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  !
                </span>
              )}
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Filters</CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2 lg:px-3"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Search"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search properties..."
                />
                <Select
                  value={filters.type}
                  onValueChange={(value) => updateFilter('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.status}
                  onValueChange={(value) => updateFilter('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message || 'Failed to load properties'}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Alert>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.pages.map((page) =>
            page.items.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {properties?.pages[0].items.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No properties found</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex justify-center pt-4"
          >
            <LoadingFallback />
          </div>
        )}
      </div>
    </PropertyErrorBoundary>
  );
};