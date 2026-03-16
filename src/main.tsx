import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/utility/store.ts';
import { registerSW } from 'virtual:pwa-register';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';


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
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode >,
)



