import './Footer.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubAlt, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import BigEcoLoop from '../../assets/Big-EcoLoop.png';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__logo'>
        <img className='footer__logo--img' src={BigEcoLoop} alt='EcoLoop logo'/>
        <p className='footer__logo--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      <div className='footer__links'>
        <h4>Sitemap</h4>
        <Link to={'/about'}>About Us</Link>
        <Link to={'/resources'}>Resources</Link>
        <Link to={'/login'}>Login</Link>
      </div>

      <div className='footer__socials'>
        <a href='https://github.com/reneemes' aria-label='GitHub'>
          <FontAwesomeIcon icon={faGithubAlt} size='2xl' />
        </a>
        <a href='https://www.linkedin.com/in/reneemessersmith/' aria-label='LinkedIn'>
          <FontAwesomeIcon icon={faLinkedinIn} size='2xl' />
        </a>
      </div>

      <div className='footer__copyright'>
        <p className='footer__copyright--trademark'>Copyright © 2026 EcoLoop. All rights reserved.</p> 
        <p className='footer__copyright--disclosure'>EcoLoop is a project for educational purposes.</p>
      </div>
    </footer>
  )
}

export default Footer;