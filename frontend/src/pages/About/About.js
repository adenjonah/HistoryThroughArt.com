import React from 'react';
import '../Home/Home.css'; // Assuming the CSS file is shared
import './About.css'

function About() {
  return (
    <div className='about pagecontainer'>
      <h1 className="about title">About Us</h1>
      <p className='about blurb'>Get to know the amazing team behind this project!</p>
      <div className='team-cards'>
        <div className='team-card'>
          <img src='' alt='Mrs. Korus' className='headshot' />
          <h2>Mrs. Korus</h2>
          <p className='about blurb'>The passionate AP Art History teacher at North Central High School who inspires curiosity and a love for art in her students.</p>
        </div>
        <div className='team-card'>
          <img src='path/to/headshot2.jpg' alt='Caleb Stewart' className='headshot' />
          <h2>Caleb Stewart</h2>
          <p className='about blurb'>A computer science whiz studying at Eastern Washington University. Caleb, a proud alum of Mrs. Korus' class, graduated in 2021 and brings his tech expertise to our team.</p>
        </div>
        <div className='team-card'>
          <img src='path/to/headshot3.jpg' alt='Jonah Aden' className='headshot' />
          <h2>Jonah Aden</h2>
          <p className='about blurb'>Another computer science major, currently at Columbia University. Jonah, also a former student of Mrs. Korus, graduated in 2022.</p>
        </div>
      </div>
      <p className='about blurb'>We are thrilled to bring you an enriching experience, blending art history with cutting-edge technology.</p>
      <p className='about blurb'>Have questions or feedback? Reach out to us at: <strong>info@smartart.com</strong></p>
    </div>
  );
}

export default About;