import './Header.scss';
import { useAuth } from '../../context/authContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CircleUser } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    closeNav();
    logout();
  }

  return (
    <header className='header'>
      {/* Overlay */}
      {isOpen && (
        <div className='overlay' onClick={closeNav} />
      )}

      <div className='icon-wrapper'>
        <Menu className='header__menu-btn' onClick={() => setIsOpen(true)}/>
      </div>

      <Link to={'/'} className='header__title'>EcoLoop</Link>

      {isAuthenticated ? 
        <Link to={'/dashboard'} className='header__account'> 
          <CircleUser className='header__account--btn'/>
        </Link>
      :
        <Link to={'/login'} className='header__login-btn'>Login</Link>
      }
      
      {/* Mobile Nav */}
      <nav className={`header__nav-mobile ${isOpen ? 'open' : ''}`}>
        <div className='icon-wrapper'>
          <X 
            className='header__nav-mobile--link'
            id='close-btn'
            onClick={() => setIsOpen(false)}
          />
        </div>
        {/* {isAuthenticated && (
          <Link 
            className='header__nav-mobile--link' 
            to={'/resources'} 
            onClick={() => setIsOpen(false)}>Search</Link>
        )} */}
        <Link 
          className='header__nav-mobile--link' 
          to={'/about'} 
          onClick={() => setIsOpen(false)}>About Us</Link>
        <Link 
          className='header__nav-mobile--link' 
          to={'/resources'} 
          onClick={() => setIsOpen(false)}>Resources</Link>
        {!isAuthenticated ?
          <Link 
          className='header__nav-mobile--link' 
          to={'/login'} 
          onClick={() => setIsOpen(false)}>Login</Link>
        :
          <Link
            className='header__nav-mobile--link'
            to={'/'}
            onClick={() => handleLogout()}
          >Logout</Link>
        }
      </nav>

      {/* Desktop Nav */}
      <nav className='header__nav-desktop'>

      </nav>
    </header>
  )
}

export default Header;