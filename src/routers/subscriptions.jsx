import { Outlet } from 'react-router-dom'
import { getSubscriptionPrices, getSubscriptions } from '../api/subscriptions'
import Premium from '../pages/premium'
import Subscriptions from '../pages/subscriptions'

const subscriptionsRoutes = [
  {
    path: 'subscriptions',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Subscriptions />,
        loader: getSubscriptions,
        shouldRevalidate: () => true,
      },
      {
        path: 'packages',
        element: <Premium />,
        loader: getSubscriptionPrices,
      },
    ],
  },
]

export default subscriptionsRoutes
