import React from "react";
import "../Home/Home.css";
import "./About.css";
import JonahHeadshot from "./jonah-headshot.webp";
import CalebHeadshot from "./caleb-headshot.webp";
import KorusHeadshot from "./korus-headshot.webp";

function About() {
  return (
    <div className="pagecontainer">
      <h1 className="about title">About Us</h1>

      <div className="team-cards">
        <div className="team-card">
          <a
            href="https://www.linkedin.com/in/caleb-stewart-281594274/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={CalebHeadshot} alt="Caleb Stewart" className="headshot" />
            <h2 className="headshot-name">Caleb Stewart</h2>
          </a>
          <p className="caption">
            Caleb is a Senior at Eastern Washington University. A proud alum of
            Mrs. Korus' history classes, graduated in 2021 and brings his tech
            expertise to our team.
          </p>
        </div>
        <div className="team-card">
          <a
            href="https://www.spokesman.com/stories/2010/mar/11/teacher-of-year-honors-go-to-three/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={KorusHeadshot} alt="Mrs. Korus" className="headshot" />
            <h2 className="headshot-name">Mrs. Korus</h2>
          </a>
          <p className="caption">
            The passionate AP Art History teacher at North Central High School
            who inspires curiosity and a love for art in her students.
          </p>
        </div>
        <div className="team-card">
          <a
            href="https://www.linkedin.com/in/jonah-aden/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={JonahHeadshot} alt="Jonah Aden" className="headshot" />
            <h2 className="headshot-name">Jonah Aden</h2>
          </a>
          <p className="caption">
            Jonah is a Junior at Columbia University majoring in Computer
            Science, Political Science, and Statistics. He had Mrs. Korus as a
            history teacher in 7th, 8th, 10th, and 12th grade. Jonah graduated
            North Central in 2022.
          </p>
        </div>
      </div>

      <h1 className="about title">Our Story</h1>
      <p className="aboutblurb">
        This project began in the summer of 2024 with the initial goal of
        creating a platform to centralize the educational content that Mrs.
        Korus had produced for her AP Art History classes. Jonah took AP Art
        History his senior year of high school and really enjoyed the content
        and teaching style that Mrs. Korus provided. He had the idea for this
        site as an aid for in-class instruction. Jonah shared the idea with
        Caleb, a fellow Computer Science major, and Caleb was immediately on
        board with the mission. The two began planning and creating design
        mockups and pitched the idea to Mrs. Korus, who loved it. Over the
        summer they developed a basic site, and they plan on adding a plethora
        of features over the school year.
      </p>

      <p className="about blurb">
        Reach out to us at:
        <strong>
          <a href="mailto:HistoryThroughArt@gmail.com">
            {" "}
            HistoryThroughArt@gmail.com
          </a>
        </strong>
      </p>
      <a
        href="https://github.com/adenjonah/APAH"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        <button className="github-button">View on GitHub</button>
      </a>
    </div>
  );
}

export default About;
