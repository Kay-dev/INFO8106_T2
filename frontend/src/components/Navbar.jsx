import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // 调用登出 API
      // await fetch('/api/logout', {
      //   method: 'POST',
        
      // });

      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
                <NavLink to='/my-events' className={linkClass}>
                  My Eveents
                </NavLink>
                <NavLink to='/login' className={linkClass}>
                  Log in
                </NavLink>
                <NavLink to='/sign-up' className={linkClass}>
                  Sign up
                </NavLink>
                <NavLink to='/logout' className={linkClass} onClick={handleLogout} >
                  Log out
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
