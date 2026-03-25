import './Login.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import BigEcoLoop from '../../assets/Big-EcoLoop.png';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();

  const [mode, setMode] = useState('login');

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isLogin = mode === 'login';
  const switchMode = (nextMode) => {
    setMode(nextMode);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setServerError('');

    try {
      // setSubmitting(true);

      if (mode === 'login') {
        await login(username.trim(), password);
        navigate('/dashboard');
        return;
      }

      await signup({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      navigate('/dashboard');
    } catch (error) {
      // setServerError(err.message || 'Something went wrong.');
      console.log(error)
    // } finally {
    //   setSubmitting(false);
    }
  };

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
        <form className='auth__login-form' onSubmit={handleSubmit}>
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
          <h1 className='auth__signup-form--header'>Create Account</h1>

          <div className='auth__signup-form--box-one'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='janedoe'
            />
          </div>

          <div className='auth__signup-form--box-two'>
            <label htmlFor='email'>Email</label>
            <input 
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='janedoe@xyz.com'
            />
          </div>

          <div className='auth__signup-form--box-three'>
            <label htmlFor='password'>Password</label>
            <input 
              id='signup-password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className='auth__signup-form--box-four'>
            <label htmlFor='confirm-password'>Confirm Password</label>
            <input 
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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