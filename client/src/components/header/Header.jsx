import './Header.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  return (
    <header className='header'>
      {/* Overlay */}
      {isOpen && (
        <div className='overlay' onClick={closeNav} />
      )}

      <div className='icon-wrapper'>
        <Menu className='header__menu-btn' onClick={() => setIsOpen(true)}/>
      </div>

      <a className='header__title'>EcoLoop</a>

      <button>Login</button>
      
      {/* Mobile Nav */}
      <nav className={`header__nav-mobile ${isOpen ? 'open' : ''}`}>
        <div className='icon-wrapper'>
          <X 
            className='header__nav-mobile--link'
            id='close-btn'
            onClick={() => setIsOpen(false)}
          />
        </div>
        <Link 
          className='header__nav-mobile--link' 
          to={'/about'} 
          onClick={() => setIsOpen(false)}>About Us</Link>
        <Link 
          className='header__nav-mobile--link' 
          to={'/resources'} 
          onClick={() => setIsOpen(false)}>Resources</Link>
        <Link 
          className='header__nav-mobile--link' 
          to={'/login'} 
          onClick={() => setIsOpen(false)}>Login</Link>
      </nav>

      {/* Desktop Nav */}
      <nav className='header__nav-desktop'>

      </nav>
    </header>
  )
}

export default Header;