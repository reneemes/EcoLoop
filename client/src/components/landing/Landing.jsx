import './Landing.scss';
import Earth from '../../assets/earth.JPG';
import Nature from '../../assets/nature.jpg';
import Recycle from '../../assets/recycling.jpg';
import Green from '../../assets/green.jpg';
import RecycleIcon from '../../assets/recycle-icon.png';

function Landing() {
  return (
    <section className='landing'>
      <h1 className='landing__headline'>Recycle Smarter. Live Greener.</h1>

      <div className='landing__hero'>
        <img className='landing__hero--one' src={Nature}/>
        <div className='landing__hero--two'></div>
        <img className='landing__hero--three' src={Earth}/>
        {/* <img className='landing__hero--three' src={BigEcoLoop}/> */}
        <img className='landing__hero--four' src={Recycle}/>
        <img className='landing__hero--five' src={Green}/>
        {/* <div className='landing__hero--five'></div> */}
        <div className='landing__hero--text'>
          <p>
            Take the guesswork out of recycling with an app designed 
            to make sustainable living simple.
          </p>
          <button>Get Started</button>
        </div>
      </div>

      <section className="landing__benefits" aria-labelledby="benefits-heading">
        <h2 className="landing__benefits--heading">Why use our app?</h2>

        <ul className="landing__benefits--list">
          <li className="landing__benefits--item">
            <article>
              <img src={RecycleIcon}/>
              <h3>Find recycling facilities near you</h3>
              <p>
                Quickly locate nearby drop-off points and centers so you always know where to go.
              </p>
            </article>
          </li>

          <li className="landing__benefits-item">
            <article>
              <h3>Learn how to recycle anything</h3>
              <p>
                From plastics to electronics, get clear, easy-to-follow guidance on how to recycle different items properly.
              </p>
            </article>
          </li>

          <li className="landing__benefits-item">
            <article>
              <h3>Track your impact over time</h3>
              <p>
                See how your recycling efforts add up and stay motivated as you build better habits.
              </p>
            </article>
          </li>
        </ul>
      </section>
    </section>
  )
}

export default Landing;