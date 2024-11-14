import BonusPackages from '../pages/bonus-packages'
import BonusPackageById from '../pages/bonus-packages/_id'

const bonusPackagesRoutes = [
  {
    path: '/bonus-packages',
    element: <BonusPackages />,
  },
  {
    path: '/bonus-packages/:id',
    element: <BonusPackageById />,
  },
]

export default bonusPackagesRoutes
