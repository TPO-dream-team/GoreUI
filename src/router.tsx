import { createBrowserRouter } from 'react-router-dom';
import { Navigation } from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppPage from './pages/AppPage';
import ScannerPage from './pages/ScannerPage';
import ChatPage from './pages/ChatPage';
import BoardPage from './pages/BoardPage';
import BoardChatPage from './pages/BoardChatPage';
import ChatCommentPage from './pages/ChatCommentPage';
import ModeratorPage from './pages/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminRoute from './components/common/AdminRoute';

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
        path: "chat/:id",
        element: <ProtectedRoute><ChatCommentPage /></ProtectedRoute> 
      },
      {
        path: "board",
        element: <ProtectedRoute><BoardPage /></ProtectedRoute> 
      },
      {
        path: "board/:id",
        element: <ProtectedRoute><BoardChatPage /></ProtectedRoute> 
      },
      {
        path: "moderation",
        element: <AdminRoute><ModeratorPage /></AdminRoute> 
      },
     {
        path: "profile/:id",
        element: <ProtectedRoute><UserProfilePage /></ProtectedRoute>
      }
    ],
  },
]);

