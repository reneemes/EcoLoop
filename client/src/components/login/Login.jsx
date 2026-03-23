import './Login.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BigEcoLoop from '../../assets/Big-EcoLoop.png';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

function Login() {
  const [mode, setMode] = useState('login');
  // const isLogin = mode === 'login';

  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');

  const switchMode = (nextMode) => {
    setMode(nextMode);
  }

  const isLogin = mode === 'login';

  return (
    <section className='auth'>
      {isLogin ? 
        <div className='auth__logo'>
          <Link className='link' to={'/'}>
            <ArrowLeft className='auth__top--btn'/>
          </Link>
          <img className='auth__logo--img' src={BigEcoLoop} alt='EcoLoop logo'/>
        </div>
      : 
        <div className='auth__top'>
          <Link to={'/'}>
            <ArrowLeft className='auth__top--btn'/>
          </Link>
        </div>
      }

      {mode === 'login' ?
        <form className='auth__login-form'>
          <h1 className='auth__login-form--header'>Login</h1>

          <div className='auth__login-form--box-one'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='janedoe'
              // disabled={mode !== "signup"}
            />
          </div>

          <div className='auth__login-form--box-two'>
            <label htmlFor='password'>Password</label>
            <div id='password-box'>
              <input 
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                />
              <button
                type="button"
                className="auth__eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
      : 
        <form className='auth__signup-form'>
          <h1 lassName='auth__signup-form--header'>Create Account</h1>

          <div className='auth__signup-form--box-one'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='janedoe'
              // disabled={mode !== "signup"}
            />
          </div>

          <div className='auth__signup-form--box-two'>
            <label htmlFor='password'>Email</label>
            <input 
              id='email'
              // type={showPassword ? 'text' : 'password'}
              value={email}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='janedoe@xyz.com'
            />
          </div>

          <div className='auth__signup-form--box-three'>
            <label htmlFor='password'>Password</label>
            <input 
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className='auth__signup-form--box-four'>
            <label htmlFor='password'>Confirm Password</label>
            <input 
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className='auth__signup-form--box-five'>
            Sign Up
          </button>

          <p className='auth__signup-form--box-six'>
            Already have an account? <span onClick={() => switchMode('login')} aria-selected={mode === 'login'}>Log In</span>
          </p>
        </form>
      }
    </section>
  )
}

export default Login;