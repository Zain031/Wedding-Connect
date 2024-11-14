import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const PublicRoutes = ({ children }) => {
  const { isLogin } = useSelector((state) => state.auth)
  const location = useLocation()

  if (isLogin) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export default PublicRoutes
