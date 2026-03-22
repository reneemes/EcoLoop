import './Login.scss';
import BigEcoLoop from '../../assets/Big-EcoLoop.png';

function Login() {
  return (
    <section className='auth'>
      <div className='auth__logo'>
        <img className='auth__logo--img' src={BigEcoLoop} alt='EcoLoop logo'/>
      </div>

      <form className='auth__login-form'>
        <h1 className='auth__login-form--header'>Log In</h1>

        <div className='auth__login-form--box-one'>
          <label>Username</label>
          <input placeholder='janedoe@xyz.com'></input>
        </div>

        <div className='auth__login-form--box-two'>
          <label>Password</label>
          <input placeholder='**********'></input>
        </div>

        <div className='auth__login-form--box-three'>
          <label>Remember me</label>
          {/* <input placeholder='**********'></input> */}
        </div>

        <div className='auth__login-form--box-four'>
          <label>Forgot Password</label>
          {/* <input placeholder='**********'></input> */}
        </div>

        <div className='auth__login-form--box-five'>
          <label>Log In</label>
          {/* <input placeholder='**********'></input> */}
        </div>

        <div className='auth__login-form--box-six'>
          <label>Don't have an account? Sign Up</label>
          {/* <input placeholder='**********'></input> */}
        </div>
      </form>
    </section>
  )
}

export default Login;