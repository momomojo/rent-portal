import React, { Suspense, useState, useEffect, useRef } from 'react';
import { where, orderBy, limit, startAfter, Query, QueryConstraint } from 'firebase/firestore';
import { useFirebaseQuery } from '../hooks/useFirebaseQuery';
import { MaintenanceRequest } from '../types/maintenance';

// Lazy load components
const MaintenanceRequestCard = React.lazy(() => import('../components/MaintenanceRequestCard'));
const MaintenanceRequestForm = React.lazy(() => import('../components/MaintenanceRequestForm'));

// Loading skeleton component
const RequestSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
  </div>
);

const ITEMS_PER_PAGE = 10;

const Maintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [constraints, setConstraints] = useState<QueryConstraint[]>([
    where('status', '!=', 'completed'),
    orderBy('status', 'asc'),
    orderBy('createdAt', 'desc'),
    limit(ITEMS_PER_PAGE)
  ]);

  const { data: requests, loading, error, hasMore, refresh } = useFirebaseQuery<MaintenanceRequest>(
    'maintenance',
    constraints
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          // Load more items when the user scrolls near the bottom
          const lastItem = requests[requests.length - 1];
          if (lastItem) {
            setConstraints(prev => [
              ...prev.filter(c => !(c instanceof Query)),
              startAfter(lastItem.createdAt),
              limit(ITEMS_PER_PAGE)
            ]);
            setPage(p => p + 1);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [requests, hasMore, loading]);

  const handleFormSubmit = async () => {
    await refresh();
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Request
        </button>
      </div>

      {showForm && (
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>}>
          <MaintenanceRequestForm 
            onSubmit={handleFormSubmit}
            onClose={() => setShowForm(false)}
          />
        </Suspense>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          Error loading maintenance requests
        </div>
      )}

      <div className="grid gap-4">
        <Suspense fallback={Array.from({ length: 3 }).map((_, i) => (
          <RequestSkeleton key={i} />
        ))}>
          {requests.map((request) => (
            <MaintenanceRequestCard
              key={request.id}
              request={request}
              onUpdate={refresh}
            />
          ))}
        </Suspense>

        {loading && (
          <RequestSkeleton />
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No maintenance requests found
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
};

export default Maintenance;
