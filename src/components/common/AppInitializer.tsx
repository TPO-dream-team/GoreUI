import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGore } from '@/utility/stores_slices/goreSlice';
import type { AppDispatch, RootState } from '@/utility/store';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  const gore = useSelector((state: RootState) => state.mountain.gore);
  const loading = useSelector((state: RootState) => state.mountain.loading);
  const isRehydrated = useSelector((state: RootState) => state._persist?.rehydrated);

  useEffect(() => {
    if (!isRehydrated) return;

    const attemptFetch = () => {
      if (!gore && !loading) {
        console.log("Attempting to fetch...");
        dispatch(fetchGore());
      }
    };

    attemptFetch();

    const retryInterval = setInterval(() => {
      attemptFetch();
    }, 5000);

    return () => clearInterval(retryInterval);
  }, [dispatch, isRehydrated, gore]);

  if (!isRehydrated || !gore) {
    return (
      <div className='flex items-center justify-center min-h-screen text-center p-4'>
        <div className="space-y-4">
          <p>Že dolgo se nisi prijavil v spletno stran. Prosim prijavi se z internetno povezavo.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}