import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import 'tippy.js/dist/tippy.css'
import { FolderSVG, HomeSVG } from '../../assets/svgs'

function SidebarMenu() {
  const { role } = useSelector((state) => state.auth)

  return (
    <>
      <li>
        <NavLink to="/">
          <HomeSVG />
          Dashboard
        </NavLink>
      </li>

      {role === 'ROLE_ADMIN' && (
        <>
          <li>
            <details open>
              <summary>
                <FolderSVG />
                Subscriptions
              </summary>
              <ul>
                <li>
                  <NavLink to="/subscriptions" end>
                    Manage Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/subscriptions/packages">Manage Packages</NavLink>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <NavLink to="/wedding-organizers">
              <FolderSVG />
              Wedding Organizers
            </NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink to="/wedding-packages">
          <FolderSVG />
          Wedding Packages
        </NavLink>
      </li>

      {role === 'ROLE_WO' && (
        <>
          <li>
            <NavLink to="/bonus-packages">
              <FolderSVG />
              Products
            </NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink to="/booking-transactions">
          <FolderSVG />
          Booking Transactions
        </NavLink>
      </li>
    </>
  )
}

export default SidebarMenu
