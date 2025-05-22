import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterList from '@/components/FilterList';
import Pagination from '@/components/Pagination';
import MapView from '@/components/MapView';
import { Meta } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Grid, MapPin } from 'lucide-react';
import { Property } from '@shared/schema';

const SearchResults: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  
  // Parse any filter parameters from URL
  useEffect(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const propertyType = searchParams.get('propertyType');
    
    const newFilters: any = {};
    if (minPrice) newFilters.minPrice = parseInt(minPrice);
    if (maxPrice) newFilters.maxPrice = parseInt(maxPrice);
    if (bedrooms) newFilters.bedrooms = parseInt(bedrooms);
    if (propertyType) newFilters.propertyType = propertyType;
    
    setFilters(newFilters);
  }, [location]);

  const pageSize = 12;

  const { data: properties, isLoading, isError } = useQuery({
    queryKey: ['/api/properties/search', query, filters],
    queryFn: () => searchProperties(query, filters),
  });

  // Calculate pagination values
  const totalItems = properties?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = properties?.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: query ? `Search results for "${query}"` : 'All properties' }
  ];

  return (
    <>
      <Meta 
        title={query ? `${query} - Search Results | StayDirectly` : 'Search Properties | StayDirectly'}
        description={`Browse ${totalItems} properties ${query ? `matching "${query}"` : ''} - book directly with hosts and save on fees.`}
        canonical={`/search${query ? `?q=${query}` : ''}`}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {query ? `Properties matching "${query}"` : 'All Properties'}
          </h1>
          
          {/* View toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-10 h-10 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('map')}
              className="w-10 h-10 p-0"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <FilterList onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          {isLoading ? 'Searching...' : 
           isError ? 'Error loading results' :
           `Showing ${startIndex + 1}-${endIndex} of ${totalItems} properties`}
        </p>
        
        {/* Map and results container - responsive layout for all screen sizes */}
        <div className={`flex flex-col ${viewMode === 'map' ? 'lg:flex-row' : ''} gap-6 mb-12`}>
          {/* Properties grid - either full width or left side depending on view mode */}
          <div className={`order-2 lg:order-1 ${viewMode === 'map' ? 'lg:w-3/5' : 'w-full'}`}>
            {isLoading ? (
              // Skeleton loading state for grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm h-auto">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 font-medium mb-2">Error loading properties</p>
                <p className="text-gray-600">Please try again later</p>
              </div>
            ) : properties?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-800 font-medium mb-2">No properties found</p>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentItems.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    totalPrice 
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !isError && properties && properties.length > 0 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>
          
          {/* Map view - either hidden, full width on mobile or right side on desktop */}
          {viewMode === 'map' && (
            <div className="order-1 lg:order-2 lg:w-2/5 h-[400px] lg:h-[calc(100vh-240px)] lg:min-h-[600px] sticky top-6 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
              {properties ? (
                <MapView 
                  properties={properties}
                  height="100%"
                  center={[25.7617, -80.1918]} // Miami, FL
                  zoom={12}
                  onMarkerClick={(property) => {
                    // Set the selected property
                    setSelectedProperty(property.id);
                    
                    // Find the element and scroll to it
                    const element = document.getElementById(`property-${property.id}`);
                    if (element) {
                      // First remove highlight class from any previously highlighted properties
                      document.querySelectorAll('.property-highlight').forEach(el => {
                        el.classList.remove('property-highlight');
                      });
                      
                      // Add highlight class to the selected property card
                      const card = element.querySelector('.card-hover');
                      if (card) {
                        card.classList.add('property-highlight');
                      }
                      
                      // Scroll to the element
                      element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center'
                      });
                    }
                    
                    // Auto-clear the highlight after 3 seconds
                    setTimeout(() => {
                      document.querySelectorAll('.property-highlight').forEach(el => {
                        el.classList.remove('property-highlight');
                      });
                      setSelectedProperty(null);
                    }, 3000);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
              
              {/* Info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm z-[1000]">
                <h3 className="font-medium text-sm md:text-base mb-1">
                  {query || 'Miami, FL'}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Showing {totalItems} {totalItems === 1 ? 'property' : 'properties'} in this area
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
