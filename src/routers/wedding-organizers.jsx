import { Outlet } from 'react-router-dom'
import { cities } from '../api/city-loaders'
import { weddingOrganizerById, weddingOrganizers } from '../api/wo-loaders'
import WeddingOrganizers from '../pages/wedding-organizers'
import Profiles from '../pages/wedding-organizers/_id'
import EditWeddingOrganizer from '../pages/wedding-organizers/edit'

const editLoader = async ({ params }) => {
  const wo = await weddingOrganizerById({ params })
  const citiesData = await cities()

  return { wo: wo.data, cities: citiesData.data }
}

const weddingOrganizersRoutes = [
  {
    path: 'wedding-organizers',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <WeddingOrganizers />,
        loader: weddingOrganizers,
        shouldRevalidate: () => true,
      },
      {
        path: ':id',
        element: <Profiles />,
        loader: weddingOrganizerById,
        shouldRevalidate: () => true,
      },
      {
        path: ':id/edit',
        element: <EditWeddingOrganizer />,
        loader: editLoader,
      },
    ],
  },
]

export default weddingOrganizersRoutes
