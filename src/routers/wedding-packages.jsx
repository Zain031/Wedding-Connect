import { Outlet } from 'react-router-dom'
import WeddingPackages from '../pages/wedding-packages'
import WeddingPackageById from '../pages/wedding-packages/_id'
import CreateWeddingPackage from '../pages/wedding-packages/create'

const weddingPackagesRoutes = [
  {
    path: 'wedding-packages',
    element: <Outlet />,
    shouldRevalidate: () => true,
    children: [
      {
        path: '',
        element: <WeddingPackages />,
      },
      {
        path: ':id',
        element: <WeddingPackageById />,
      },
      {
        path: 'create',
        element: <CreateWeddingPackage />,
      },
    ],
  },
]

export default weddingPackagesRoutes
