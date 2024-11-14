import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { BellSVG, HamburgerMenuSVG } from '../../assets/svgs'
import { logout } from '../../redux/feature/authSlice'

const notificationTypes = {
  WEDDING_ORGANIZER: 'wedding-organizers',
  ORDER: 'booking-transactions',
  SUBSCRIPTION: 'subscriptions',
}

const Navbar = ({ setIsMenuOpen, theme, toggleTheme, notifications, onMarkNotificationAsRead }) => {
  const { role } = useSelector((state) => state.auth)
  const apiUrl = import.meta.env.VITE_API_URL
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      },
    })
    Toast.fire({
      icon: 'success',
      title: 'Logout success',
    })

    navigate('/login')
  }

  return (
    <div className="navbar w-full">
      <div className="flex-1 space-x-3">
        <label
          htmlFor="my-drawer-3"
          className="btn btn-square btn-ghost"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <HamburgerMenuSVG />
        </label>
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" className="theme-controller" checked={theme} onChange={() => toggleTheme(!theme)} />

          {/* sun icon */}
          <svg className="swap-off h-6 w-6 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <div className="indicator">
              <span
                className={`${notifications.length === 0 ? 'hidden' : 'badge indicator-item badge-secondary badge-sm'}`}
              >
                {notifications.length}
              </span>
              <BellSVG isDark={theme} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-80 rounded-box border border-base-200 bg-base-100 p-3 shadow"
          >
            <div>
              <p className="text-sm font-bold">Notifications</p>
              <p className="text-xs opacity-50">You have {notifications.length} unread notifications</p>
            </div>
            <div className="divider my-1" />
            {notifications.map((notification) => (
              <li key={notification?.id}>
                <Link
                  to={
                    notification?.dataType === 'SUBSCRIPTION'
                      ? `/${notificationTypes[notification?.dataType]}`
                      : `/${notificationTypes[notification?.dataType]}/${notification?.dataId}`
                  }
                  className="text-sm hover:bg-accent hover:text-accent-content"
                  onClick={() => onMarkNotificationAsRead(notification?.id)}
                >
                  {notification.message}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              <img
                alt="Avatar"
                src={
                  user?.avatar
                    ? `${apiUrl}/${user?.avatar.url}`
                    : `https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp`
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-60 rounded-box border border-base-200 bg-base-100 p-3 shadow"
          >
            <div>
              <p className="text-sm font-bold">{user?.name || 'You are an Admin!'}</p>
              <p className="text-xs opacity-50">
                {user?.email ? user?.email : 'The only way to do great work is to love what you do.'}
              </p>
            </div>
            <div className="divider my-1" />
            {role === 'ROLE_WO' && (
              <li>
                <Link to="/me" className="hover:bg-primary hover:text-primary-content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="-mr-1 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  Profile
                </Link>
              </li>
            )}
            <li>
              <button className="hover:bg-secondary hover:text-secondary-content" onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="-mr-1 size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
