import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useUser } from "../context/UserContext";
import { toast } from 'react-toastify';
import { logout } from "../services/login";
import { Inbox } from "@trycourier/react-inbox";

const theme ={
  message: {
    unreadIndicator: {
      color: 'white',
    },
    icon: {
      color: 'white',
    }
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userLogout } = useUser();


  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await logout();
      userLogout();
      navigate('/');
      toast.success('You have successfully logged out.');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getMenuForRole = (role) => {

    switch (role) {
      case 'admin':
        return (
          <>
            <NavLink to='/add-event' className={linkClass}>Add Event</NavLink>
          </>
        );
      case 'user':
        return (
          <>
            <NavLink to='/my-events' className={linkClass}>My Events</NavLink>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <nav className='bg-indigo-700 border-b border-indigo-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
              <img className='h-10 w-auto' src={logo} alt='Eco Events' />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                Eco Events
              </span>
            </NavLink>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <NavLink to='/' className={linkClass}>
                  Home
                </NavLink>
                <NavLink to='/events' className={linkClass}>
                  Events
                </NavLink>
                {user && getMenuForRole(user.role)}


                {
                  user ? 
                  <>
                    <NavLink to='/logout' className={linkClass} onClick={handleLogout} >
                      Log out
                    </NavLink>
                    <Inbox className='custom-icon px-3 py-2' theme= {theme} />
                  </>
                    :
                    <>
                      <NavLink to='/login' className={linkClass}>
                        Login
                      </NavLink>
                      <NavLink to='/sign-up' className={linkClass}>
                        Sign Up
                      </NavLink>
                    </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};
export default Navbar;
