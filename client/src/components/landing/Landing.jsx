import './Landing.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RecycleIcon from '../../assets/recycle-icon.png';
import Lightbulb from '../../assets/Lightbulb.png';
import Plant from '../../assets/Plant.png';
import Trees from '../../assets/trees.jpg';

function Landing() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const reviews = [
    "I finally know what I can recycle. This app made it so easy.",
    "Honestly didn’t realize how much I was recycling wrong until I tried this.",
    "Clean design, fast answers, no confusion."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % reviews.length);
        setFade(true); // fade back in
      }, 500); // match CSS duration
    }, 5000); // change every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='landing'>
      <h1 className='landing__headline'>Recycle Smarter. Live Greener.</h1>

      {/* Hero */}
      <div className='landing__hero'>
        <img className='landing__hero--img' src={Trees}/>

        <div className='landing__hero--text'>
          <p>
            Take the guesswork out of recycling with an app designed 
            to make sustainable living simple.
          </p>
          <Link to={'/login'}>
            <button className='landing__hero--cta cta-btn'>Get Started</button>
          </Link>
        </div>
      </div>

      {/* Benefits */}
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

          <li className="landing__benefits--item">
            <article>
              <img src={Lightbulb}/>
              <h3>Learn how to recycle anything</h3>
              <p>
                From plastics to electronics, get clear, easy-to-follow guidance on how to recycle different items properly.
              </p>
            </article>
          </li>

          <li className="landing__benefits--item">
            <article>
              <img src={Plant}/>
              <h3>Track your impact over time</h3>
              <p>
                See how your recycling efforts add up and stay motivated as you build better habits.
              </p>
            </article>
          </li>
        </ul>
      </section>

      {/* How it Works */}
      <section className='landing__how' aria-labelledby='how-heading'>
        <h2 id='how-heading'>How it works</h2>

        {/* <div> */}
          {/* <img src={RecyclingBin}/> */}
          <ul className='landing__how--steps'>
            <li>
              <h3>1. Search your item</h3>
              <p>Type in what you want to recycle and get instant guidance.</p>
            </li>

            <li>
              <h3>2. Find a nearby location</h3>
              <p>We show you the closest recycling centers and drop-off points.</p>
            </li>

            <li>
              <h3>3. Recycle with confidence</h3>
              <p>Follow simple instructions and make a real environmental impact.</p>
            </li>
          </ul>
          {/* <img src={BigEcoLoop}/> */}
        {/* </div> */}
      </section>

      {/* Testimonials */}
      <section className='landing__testimonials'>
        <h2>What people are saying</h2>
        <blockquote className={`slide ${fade ? "active-review" : ""}`}>
          "{reviews[index]}"
        </blockquote>
      </section>

      {/* Final CTA */}
      <section className='landing__cta'>
        <h2>Take the First Step Toward Greener Living</h2>
        <p>
          Join thousands of people making sustainable living simple every day.
        </p>
        <Link to={'/login'}>
          <button className='landing__cta--button cta-btn'>
            Get Started for Free
          </button>
        </Link>
      </section>
    </section>
  )
}

export default Landing;