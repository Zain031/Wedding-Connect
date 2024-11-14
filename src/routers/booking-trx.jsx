import { Outlet } from 'react-router-dom'
import { getAllOrders, getOrderById } from '../api/trx-loaders'
import { getAllPackages } from '../api/wo-package-loaders'
import TransactionsIndex from '../pages/booking-transactions'
import TransactionDetails from '../pages/booking-transactions/_id'
import CreateTransaction from '../pages/booking-transactions/create'

const bookingTrxRoutes = [
  {
    path: 'booking-transactions',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <TransactionsIndex />,
        loader: getAllOrders,
        shouldRevalidate: () => true,
      },
      {
        path: 'create',
        element: <CreateTransaction />,
        loader: getAllPackages,
      },
      {
        path: ':id',
        element: <TransactionDetails />,
        loader: getOrderById,
        shouldRevalidate: () => true,
      },
      {
        path: ':id/edit',
        element: <TransactionsIndex />,
      },
    ],
  },
]

export default bookingTrxRoutes
