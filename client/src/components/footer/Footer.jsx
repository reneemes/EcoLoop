import './Footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__logo'>
        <a>EcoLoop</a>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      <div className='footer__links'>
        <Link to={'/about'}>About Us</Link>
        <Link to={'/resources'}>Resources</Link>
        <Link to={'/login'}>Login</Link>
      </div>

      <div className='footer__socials'>
        
      </div>
    </footer>
  )
}

export default Footer;