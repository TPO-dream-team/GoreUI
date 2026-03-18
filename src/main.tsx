import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/utility/store.ts';
import { registerSW } from 'virtual:pwa-register';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppInitializer from './components/common/AppInitializer';


const updateSW = registerSW({ // God knows what these do bdw. 
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use!')
  },
})



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppInitializer> {/* Skrbi, da obstajo gore na vsaki spletni strani */}
          <RouterProvider router={router} />
        </AppInitializer>
      </PersistGate>
    </Provider>
  </StrictMode >,
)



