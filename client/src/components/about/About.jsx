import './About.scss';

function About() {
  return (
    <section className="about" aria-labelledby="about-heading">
      <div className="about__container">
        
        <header className="about__header">
          <h2 id="about-heading">About Us</h2>
          <p className="about__intro">
            We believe sustainable living shouldn’t be confusing.
          </p>
        </header>

        <div className="about__content">
          <p>
            Recycling is one of the simplest ways to make a positive impact on the planet—but for many people, it’s filled with uncertainty.
            What goes where? Can this actually be recycled? Where do you even take it?
          </p>

          <p>
            <strong>That’s why we built EcoLoop.</strong>
          </p>

          <p>
            Our mission is to remove the guesswork from recycling and make it easy for anyone to live a little greener every day.
            By combining simple guidance, location-based tools, and impact tracking, we help you make confident, informed choices—without the frustration.
          </p>

          <p>
            We’re passionate about turning small actions into meaningful change. Whether you’re just getting started or already committed
            to sustainable living, our goal is to support you every step of the way.
          </p>

          <p>
            Because when recycling is simple, more people do it—and that’s when real impact happens.
          </p>
        </div>

        {/* Values Section */}
        <section className="about__values" aria-labelledby="values-heading">
          <h3 id="values-heading">Our Values</h3>

          <ul className="about__values-list">
            <li>
              <h4>Simplicity first</h4>
              <p>Sustainability should feel accessible, not overwhelming</p>
            </li>
            <li>
              <h4>Transparency</h4>
              <p>Clear, honest guidance you can trust</p>
            </li>
            <li>
              <h4>Impact-driven</h4>
              <p>Small habits can lead to big environmental change</p>
            </li>
            <li>
              <h4>Community</h4>
              <p>We’re building a greener future together</p>
            </li>
          </ul>
        </section>

      </div>
    </section>
  )
}

export default About;