import { createBrowserRouter } from 'react-router-dom'
import { getSubscriptionPrices } from '../api/subscriptions'
import { weddingOrganizers } from '../api/wo-loaders'
import NotFound from '../components/errors/not-found'
import AppLayout from '../layouts/app-layout'
import GuestLayout from '../layouts/guest-layout'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Dashboard from '../pages/dashboard'
import Premium from '../pages/premium'
import Profiles from '../pages/wedding-organizers/_id'
import ProtectedRoutes from '../utils/protected-routes'
import PublicRoutes from '../utils/public-routes'
import bonusPackagesRoutes from './bonus-packages'
import bookingTrxRoutes from './booking-trx'
import subscriptionsRoutes from './subscriptions'
import weddingOrganizersRoutes from './wedding-organizers'
import weddingPackagesRoutes from './wedding-packages'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: 'me',
        element: <Profiles />,
        loader: weddingOrganizers,
        shouldRevalidate: () => true,
      },
      {
        path: 'premium',
        element: <Premium />,
        loader: getSubscriptionPrices,
        shouldRevalidate: () => true,
      },
      ...weddingOrganizersRoutes,
      ...bonusPackagesRoutes,
      ...weddingPackagesRoutes,
      ...bookingTrxRoutes,
      ...subscriptionsRoutes,
    ],
  },
  {
    path: '/',
    element: (
      <PublicRoutes>
        <GuestLayout />
      </PublicRoutes>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
])

export default router
