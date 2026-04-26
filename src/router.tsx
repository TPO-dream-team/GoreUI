import { createBrowserRouter } from 'react-router-dom';
import { Navigation } from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppPage from './pages/AppPage/AppPage';
import ScannerPage from './pages/ScannerPage/ScannerPage';
import ChatPage from './pages/ChatPage/ChatPage';
import BoardPage from './pages/BoardPage/BoardPage';
import BoardChatPage from './pages/BoardChatPage/BoardChatPage';
import ChatCommentPage from './pages/ChatCommentPage/ChatCommentPage';
import ModeratorPage from './pages/ModeratorPage/ModeratorPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import AdminRoute from './components/common/AdminRoute';
import HelpPage from './pages/HelpPage/HelpPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    children: [
      { 
        // Path ./  
        index: true,
        element: <AppPage />
      },
      { 
        path: "scanner", 
        element: <ProtectedRoute><ScannerPage /></ProtectedRoute>
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
        path: "help",
        element: <ProtectedRoute><HelpPage /></ProtectedRoute> 
      },
      {
        path: "profile/:id",
        element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> 
      }
    ],
  },
]);

