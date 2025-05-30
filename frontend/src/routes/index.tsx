import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

// Lazy loaded components
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Expenses
const ExpenseList = lazy(() => import('../pages/expenses/ExpenseList'));
const ExpenseForm = lazy(() => import('../pages/expenses/ExpenseForm'));
const ExpenseDetail = lazy(() => import('../pages/expenses/ExpenseDetail'));

// Income
const IncomeList = lazy(() => import('../pages/income/IncomeList'));
const IncomeForm = lazy(() => import('../pages/income/IncomeForm'));
const IncomeDetail = lazy(() => import('../pages/income/IncomeDetail'));

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p>Loading...</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Landing />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      // Expenses routes
      {
        path: 'expenses',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ExpenseList />
          </Suspense>
        ),
      },
      {
        path: 'expenses/new',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ExpenseForm />
          </Suspense>
        ),
      },
      {
        path: 'expenses/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ExpenseDetail />
          </Suspense>
        ),
      },
      {
        path: 'expenses/edit/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ExpenseForm />
          </Suspense>
        ),
      },
      // Income routes
      {
        path: 'income',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IncomeList />
          </Suspense>
        ),
      },
      {
        path: 'income/new',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IncomeForm />
          </Suspense>
        ),
      },
      {
        path: 'income/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IncomeDetail />
          </Suspense>
        ),
      },
      {
        path: 'income/edit/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IncomeForm />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);