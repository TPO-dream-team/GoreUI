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

    if (!gore && !loading) {
      dispatch(fetchGore());
    }

    const retryInterval = setInterval(() => {
      if (!gore && !loading) {
        console.log("Retrying fetch...");
        dispatch(fetchGore());
      }
    }, 5000);

    return () => clearInterval(retryInterval);
  }, [dispatch, gore, loading, isRehydrated]);

  if (!isRehydrated || loading || !gore) {
    return (
      <div className='text-center'>
        Že dolgo se nisi prijavil v spletno stran. Prosim prijavi se z internetno povezavo. 
      </div>
    );
  }

  return <>{children}</>;
}