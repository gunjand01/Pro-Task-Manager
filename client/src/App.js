import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Auth/Login/login';
import Register from './pages/Auth/Register/register';
import AuthLayout from './pages/Auth/Layout';
import AuthProvider from './pages/context/AuthProvider';
import TaskProvider from './pages/context/TaskProvider';
import AdminLayout from './pages/Admin/Layout';
import Board from './pages/Admin/Board/main';
import Analytics from './pages/Admin/Analytics/analytics';
import Settings from './pages/Admin/Settings/settings';
import PublicLayout from './pages/Public/public';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: ( 
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [ 
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <TaskProvider>
              <Board />
          </TaskProvider>
        ),
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/tasks/:taskId',
    element: <PublicLayout />,
  },
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
