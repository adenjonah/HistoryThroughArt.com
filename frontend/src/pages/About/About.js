import React, { useState } from "react";
import JonahHeadshot from "./jonah-headshot.webp";
import CalebHeadshot from "./caleb-headshot.webp";
import KorusHeadshot from "./korus-headshot.webp";

function About() {
  const [flippedCards, setFlippedCards] = useState({
    caleb: false,
    korus: false,
    jonah: false
  });

  const handleCardClick = (cardId, e) => {
    // Prevent flip when clicking links
    if (e.target.tagName === 'A') return;
    
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div className="flex flex-col items-center justify-start text-center h-full w-full bg-[var(--background-color)] pt-10">
      <h1 className="text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-4">About Us</h1>

      <div className="flex justify-center flex-wrap max-w-7xl mx-auto mb-8 gap-5">
        {/* Caleb Card */}
        <div className="w-[350px] md:w-[280px] h-[400px] group [perspective:1000px]">
          <div 
            className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
              flippedCards.caleb ? '[transform:rotateY(180deg)]' : ''
            } lg:group-hover:[transform:rotateY(180deg)]`}
            onClick={(e) => handleCardClick('caleb', e)}
          >
            {/* Front Side */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <img src={CalebHeadshot} alt="Caleb Stewart" className="h-[300px] w-[220px] object-cover rounded-full mx-auto mb-4" />
              <h2 className="text-2xl text-[var(--accent-color)] font-bold">Caleb Stewart</h2>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <div className="flex flex-col h-full justify-between">
                <p className="text-[var(--accent-color)] italic mt-8">
                  Caleb is a Senior at Eastern Washington University. A proud alum of
                  Mrs. Korus' history classes, graduated in 2021 and brings his tech
                  expertise to our team.
                </p>
                <a
                  href="https://www.linkedin.com/in/caleb-stewart-281594274/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--button-color)] text-[var(--button-text-color)] px-6 py-2 rounded-lg mt-4 mb-4 hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300"
                >
                  View LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mrs. Korus Card */}
        <div className="w-[350px] md:w-[280px] h-[400px] group [perspective:1000px]">
          <div 
            className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
              flippedCards.korus ? '[transform:rotateY(180deg)]' : ''
            } lg:group-hover:[transform:rotateY(180deg)]`}
            onClick={(e) => handleCardClick('korus', e)}
          >
            {/* Front Side */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <img src={KorusHeadshot} alt="Mrs. Korus" className="h-[300px] w-[220px] object-cover rounded-full mx-auto mb-4" />
              <h2 className="text-2xl text-[var(--accent-color)] font-bold">Mrs. Korus</h2>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <div className="flex flex-col h-full justify-between">
                <p className="text-[var(--accent-color)] italic mt-8">
                  The passionate AP Art History teacher at North Central High School
                  who inspires curiosity and a love for art in her students.
                </p>
                <a
                  href="https://www.spokesman.com/stories/2010/mar/11/teacher-of-year-honors-go-to-three/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--button-color)] text-[var(--button-text-color)] px-6 py-2 rounded-lg mt-4 mb-4 hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300"
                >
                  Read Article
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Jonah Card */}
        <div className="w-[350px] md:w-[280px] h-[400px] group [perspective:1000px]">
          <div 
            className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
              flippedCards.jonah ? '[transform:rotateY(180deg)]' : ''
            } lg:group-hover:[transform:rotateY(180deg)]`}
            onClick={(e) => handleCardClick('jonah', e)}
          >
            {/* Front Side */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <img src={JonahHeadshot} alt="Jonah Aden" className="h-[300px] w-[220px] object-cover rounded-full mx-auto mb-4" />
              <h2 className="text-2xl text-[var(--accent-color)] font-bold">Jonah Aden</h2>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[var(--foreground-color)] p-5 rounded-xl shadow-lg text-center">
              <div className="flex flex-col h-full justify-between">
                <p className="text-[var(--accent-color)] italic mt-8">
                  Jonah is a Junior at Columbia University majoring in Computer
                  Science, Political Science, and Statistics. He had Mrs. Korus as a
                  history teacher in 7th, 8th, 10th, and 12th grade. Jonah graduated
                  North Central in 2022.
                </p>
                <a
                  href="https://www.linkedin.com/in/jonah-aden/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--button-color)] text-[var(--button-text-color)] px-6 py-2 rounded-lg mt-4 mb-4 hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300"
                >
                  View LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-4">Our Story</h1>
      <p className="text-lg text-[var(--text-color)] max-w-[80%] mx-auto mb-8 leading-relaxed lg:max-w-[40%]">
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

      <p className="text-[var(--text-color)] mb-4 max-w-[80%] lg:max-w-[40%]">
        Reach out to us at: <br></br>
        <strong>
          <a href="mailto:HistoryThroughArt@gmail.com" className="ml-2">
            HistoryThroughArt@gmail.com
          </a>
        </strong>
      </p>
      
      <a
        href="https://github.com/adenjonah/APAH"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-24"
      >
        <button className="bg-[var(--button-color)] text-[var(--text-color)] px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-[#586069] hover:-translate-y-1 border-none">
          View on GitHub
        </button>
      </a>
    </div>
  );
}

export default About;
