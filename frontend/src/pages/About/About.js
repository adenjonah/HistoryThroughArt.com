import React from 'react';
import '../Home/Home.css'; // Assuming the CSS file is shared
import './About.css';
import JonahHeadshot from "./jonah-headshot.webp";
import CalebHeadshot from "./caleb-headshot.webp";
import KorusHeadshot from "./korus-headshot.webp";

function About() {
  return (
    <div className='about pagecontainer'>
      <h1 className="about title">Tutorial</h1>
      <p className='about blurbb'>The following video provides a comprehensive walkthrough of this site's features and design, explaning common uses and ideas for utilizing this learning aid:</p>

      <div className="about video">
        <iframe width="560" title="Tutorial" height="315" src="https://www.youtube.com/embed/pv1N-USnLhE" frameborder="0" allowfullscreen></iframe>
      </div>

      <h1 className="about title">About Us</h1>
      <p className='about blurb'>This project began in the summer of 2024 with the initial goal of creating a platform to centralize the educational content that Mrs. Korus had produced for her AP Art History classes. Jonah took AP Art History his senior year of Highschool and really enjoyed the content and teaching style that Mrs. Korus provided. He had the idea for this site as an aid for in class instruction. Jonah shared the idea with Caleb, a fellow Computer Science Major, and Caleb was immediately on board with the mission. The two begun planning and creating design mockups and pitched the idea to Mrs. Korus who loved it. Over the summer they developed a basic site and they plan on adding a plethora of features over the school year.</p>
      <div className='team-cards'>
        <div className='team-card'>
          <img src={KorusHeadshot} alt='Mrs. Korus' className='headshot' />
          <h2>Mrs. Korus</h2>
          <p className='caption'>The passionate AP Art History teacher at North Central High School who inspires curiosity and a love for art in her students.</p>
        </div>
        <div className='team-card'>
          <img src={CalebHeadshot} alt='Caleb Stewart' className='headshot' />
          <h2>Caleb Stewart</h2>
          <p className='caption'>Caleb is a Senior at Eastern Washington University. A proud alum of Mrs. Korus' history classes, graduated in 2021 and brings his tech expertise to our team.</p>
        </div>
        <div className='team-card'>
          <img src={JonahHeadshot} alt='Jonah Aden' className='headshot' />
          <h2>Jonah Aden</h2>
          <p className='caption'>Jonah is a Junior at Columbia University majoring in Computer Science, Political Science, and Statistics. He had Mrs. Korus as a history teacher in 7th, 8th, 10th, and 12th grade. Jonah graduated North Central in 2022.</p>
        </div>
      </div>
      <p className='about blurb'>
        Reach out to us at: 
        <strong><a href="mailto:HistoryThroughArt@gmail.com">HistoryThroughArt@gmail.com</a></strong>
      </p>
      <a href="https://github.com/adenjonah/APAH" target="_blank" rel="noopener noreferrer" className="github-link">
        <button className="github-button">View on GitHub</button>
      </a>
    </div>
  );
}

export default About;