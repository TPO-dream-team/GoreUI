import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGore } from '@/utility/stores_slices/goreSlice';
import type { AppDispatch, RootState } from '@/utility/store';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  
  const { gore, loading } = useSelector((state: RootState) => state.mountain);
  const isRehydrated = useSelector((state: RootState) => state._persist?.rehydrated);
  
  const hasNoData = !gore || (Array.isArray(gore) && gore.length === 0);
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (isRehydrated && hasNoData && !loading && !hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      dispatch(fetchGore(false));
    }
  }, [isRehydrated, hasNoData, loading, dispatch]);

  if (!isRehydrated || (loading && hasNoData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="mb-4 text-gray-600">Please sign in while connected to the internet.</p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
          disabled={loading}
          onClick={() => dispatch(fetchGore(true))}
        >
          {loading ? 'Connecting...' : 'Retry'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}