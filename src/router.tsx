import { createBrowserRouter } from 'react-router-dom';
import { Navigation } from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppPage from './pages/AppPage';
import ScannerPage from './pages/ScannerPage';
import ChatPage from './pages/ChatPage';
import BoardPage from './pages/BoardPage';
import BoardChatPage from './pages/BoardChatPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    children: [
      { 
        // Path ./  
        index: true,
        element: <AppPage />  //TODO naredi dejanski index page
      },
      { 
        path: "scanner", 
        element: <ScannerPage /> 
      },
      { 
        path: "chat", 
        element: <ProtectedRoute><ChatPage /></ProtectedRoute> 
      },
      {
        path: "board",
        element: <ProtectedRoute><BoardPage /></ProtectedRoute> 
      },
      {
        path: "board/:id",
        element: <ProtectedRoute><BoardChatPage /></ProtectedRoute> 
      }
    ],
  },
]);

