import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
  const { isLogin } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoutes
