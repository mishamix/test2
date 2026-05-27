import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useProperties } from '../hooks/useFetchProperties';
import PropertyCard from '../components/PropertyCard';
import Loading, { SkeletonCard } from '../components/Loading';
import Input from '../components/Input';
import Select from '../components/Select';

export default function PropertiesPage() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('type') || 'all',
    minPrice: '',
    maxPrice: '',
  });

  const { properties, loading } = useProperties({
    location: filters.location || undefined,
    propertyType: filters.propertyType !== 'all' ? filters.propertyType : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType !== 'all') params.set('type', filters.propertyType);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
    });
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return filters.location || filters.propertyType !== 'all' || filters.minPrice || filters.maxPrice;
  }, [filters]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="section-heading">{t('properties.title')}</h1>
          <p className="section-subheading">{t('properties.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder={t('properties.location')}
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full"
              />
              <Select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                options={[
                  { value: 'all', label: t('properties.propertyType') },
                  { value: 'house', label: t('properties.types.house') },
                  { value: 'apartment', label: t('properties.types.apartment') },
                  { value: 'villa', label: t('properties.types.villa') },
                  { value: 'penthouse', label: t('properties.types.penthouse') },
                ]}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Min Price ($)"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max Price ($)"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={handleSearch} className="btn btn-primary flex-1 md:flex-none">
                <Search className="w-4 h-4 mr-2" />
                {t('common.search')}
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-ghost">
                  <X className="w-4 h-4 mr-2" />
                  {t('common.clear')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary-600 dark:text-secondary-400">
            {properties.length} {t('properties.allProperties').toLowerCase()} found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400 hidden sm:inline">
              {t('properties.sortBy')}:
            </span>
            <Select
              value=""
              onChange={() => {}}
              options={[
                { value: 'newest', label: t('properties.newest') },
                { value: 'price-desc', label: t('properties.priceHighToLow') },
                { value: 'price-asc', label: t('properties.priceLowToHigh') },
              ]}
              className="w-auto min-w-[160px]"
            />
            <div className="hidden sm:flex items-center gap-1 border border-secondary-200 dark:border-secondary-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-luxury-gold text-white' : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-luxury-gold text-white' : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {properties.map((property) => (
              viewMode === 'grid' ? (
                <PropertyCard key={property.id} property={property} />
              ) : (
                <div key={property.id}>
                  <PropertyCard property={property} />
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
              {t('properties.noResults')}
            </h3>
            <p className="text-secondary-500 mb-6">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
