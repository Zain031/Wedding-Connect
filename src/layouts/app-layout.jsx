import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import { getNotifications, markNotificationAsRead } from '../api/notifications'
import image from '../assets/Logo.png'
import { CloseSVG } from '../assets/svgs'
import Navbar from './partials/navbar'
import SidebarMenu from './partials/sidebar-menu'

function AppLayout() {
  const { role } = useSelector((state) => state.auth)
  const [isDark, setIsDark] = useState(JSON.parse(localStorage.getItem('isDark')))
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    const res = await getNotifications()
    setNotifications(res.data.filter((notification) => !notification.read))
  }

  const handleMarkNotificationAsRead = async (id) => {
    await markNotificationAsRead(id)
    fetchNotifications()
  }

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark))
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className={`drawer ${isMenuOpen ? 'lg:drawer-open' : ''}`}>
      <input id="my-drawer-3" type="checkbox" checked={isMenuOpen} readOnly className="drawer-toggle" />
      <div className="drawer-content mx-auto flex w-full max-w-7xl flex-col">
        <Navbar
          setIsMenuOpen={setIsMenuOpen}
          theme={isDark}
          toggleTheme={setIsDark}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
        />
        <Outlet />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu menu-lg min-h-full w-80 space-y-4 bg-accent-content p-4 text-neutral-content">
          <div className="flex items-start justify-center rounded-lg">
            <div className="-my-5">
              <img src={image} className="size-48" alt="logo" />
            </div>
            <button
              className="btn btn-circle btn-ghost btn-sm lg:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <CloseSVG />
            </button>
          </div>
          <SidebarMenu />
          {role === 'ROLE_WO' && (
            <li className="flex-1 justify-end">
              <NavLink to="/premium">
                <svg className="size-6 fill-yellow-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 17.5858 15.75 18C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z"
                  />
                </svg>
                <span className="font-bold">Premium</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AppLayout
