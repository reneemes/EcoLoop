import './Login.scss';
import { useState } from 'react';
import BigEcoLoop from '../../assets/Big-EcoLoop.png';

function Login() {
  const [mode, setMode] = useState('login');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const switchMode = (nextMode) => {
    setMode(nextMode);
  }

  return (
    <section className='auth'>
      <div className='auth__logo'>
        <img className='auth__logo--img' src={BigEcoLoop} alt='EcoLoop logo'/>
      </div>

      <form className='auth__login-form'>
        <h1 className='auth__login-form--header'>Login</h1>

        <div className='auth__login-form--box-one'>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='janedoe@xyz.com'
            disabled={mode !== "signup"}
          />
        </div>

        <div className='auth__login-form--box-two'>
          <label htmlFor='password'>Password</label>
          <input 
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* <div className='auth__login-form--box-three'>
          <label>Show Password</label>
        </div> */}

        <p className='auth__login-form--box-four'>
          Forgot Password?
        </p>

        <button className='auth__login-form--box-five'>
          Log In
        </button>

        <p className='auth__login-form--box-six'>
          Don't have an account? <span onClick={() => switchMode('signup')} aria-selected={mode === 'signup'}>Sign Up</span>
        </p>
      </form>
    </section>
  )
}

export default Login;