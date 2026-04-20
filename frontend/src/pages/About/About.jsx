import React, { useState } from "react";
import JonahHeadshot from "./jonah-headshot.webp";
import CalebHeadshot from "./caleb-headshot.webp";
import KorusHeadshot from "./korus-headshot.webp";
import { Button } from "@/components/ui/button";

const PEOPLE = [
  {
    id: "caleb",
    name: "Caleb Stewart",
    image: CalebHeadshot,
    bio: "Caleb is a Senior at Eastern Washington University. A proud alum of Mrs. Korus' history classes, graduated in 2021 and brings his tech expertise to our team.",
    link: { href: "https://www.linkedin.com/in/caleb-stewart-281594274/", label: "View LinkedIn" },
  },
  {
    id: "korus",
    name: "Mrs. Korus",
    image: KorusHeadshot,
    bio: "The passionate AP Art History teacher at North Central High School who inspires curiosity and a love for art in her students.",
    link: { href: "https://www.spokesman.com/stories/2010/mar/11/teacher-of-year-honors-go-to-three/", label: "Read Article" },
  },
  {
    id: "jonah",
    name: "Jonah Aden",
    image: JonahHeadshot,
    bio: "Jonah is a Junior at Columbia University majoring in Computer Science, Political Science, and Statistics. He had Mrs. Korus as a history teacher in 7th, 8th, 10th, and 12th grade. Jonah graduated North Central in 2022.",
    link: { href: "https://www.linkedin.com/in/jonah-aden/", label: "View LinkedIn" },
  },
];

function FlipCard({ person, isFlipped, onFlip }) {
  const handleClick = (e) => {
    if (e.target.tagName === "A" || e.target.closest("a")) return;
    onFlip(person.id);
  };

  return (
    <div className="w-full max-w-[320px] sm:w-[280px] h-[380px] sm:h-[400px] group [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        } lg:group-hover:[transform:rotateY(180deg)]`}
        onClick={handleClick}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--foreground-color)] p-4 sm:p-5 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
          <img
            src={person.image}
            alt={person.name}
            className="h-[200px] w-[160px] sm:h-[280px] sm:w-[200px] object-cover rounded-full mb-4"
          />
          <h2 className="text-xl sm:text-2xl text-[var(--accent-color)] font-bold">{person.name}</h2>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[var(--foreground-color)] p-4 sm:p-5 rounded-xl shadow-lg text-center">
          <div className="flex flex-col h-full justify-between">
            <p className="text-[var(--background-color)] italic mt-6 sm:mt-8 text-sm sm:text-base">
              {person.bio}
            </p>
            <Button
              asChild
              className="mt-4 mb-4 touch-manipulation"
            >
              <a href={person.link.href} target="_blank" rel="noopener noreferrer">
                {person.link.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  const [flippedCards, setFlippedCards] = useState({});

  const handleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col items-center justify-start text-center h-full w-full bg-[var(--background-color)] pt-6 sm:pt-10 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-4">About Us</h1>

      <div className="flex justify-center flex-wrap max-w-7xl mx-auto mb-8 gap-4 sm:gap-5 w-full">
        {PEOPLE.map((person) => (
          <FlipCard
            key={person.id}
            person={person}
            isFlipped={!!flippedCards[person.id]}
            onFlip={handleFlip}
          />
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-4">Our Story</h1>
      <p className="text-base sm:text-lg text-[var(--text-color)] max-w-[90%] sm:max-w-[80%] mx-auto mb-8 leading-relaxed lg:max-w-[40%]">
        This project began in the summer of 2024 with the initial goal of creating a platform to
        centralize the educational content that Mrs. Korus had produced for her AP Art History
        classes. Jonah took AP Art History his senior year of high school and really enjoyed the
        content and teaching style that Mrs. Korus provided. He had the idea for this site as an
        aid for in-class instruction. Jonah shared the idea with Caleb, a fellow Computer Science
        major, and Caleb was immediately on board with the mission. The two began planning and
        creating design mockups and pitched the idea to Mrs. Korus, who loved it. Over the summer
        they developed a basic site, and they plan on adding a plethora of features over the school
        year.
      </p>

      <p className="text-[var(--text-color)] mb-4 max-w-[90%] sm:max-w-[80%] lg:max-w-[40%] text-sm sm:text-base">
        Reach out to us at: <br />
        <strong>
          <a href="mailto:HistoryThroughArt@gmail.com" className="ml-2 break-all">
            HistoryThroughArt@gmail.com
          </a>
        </strong>
      </p>

      <Button asChild size="lg" className="mb-16 sm:mb-24 rounded-full touch-manipulation">
        <a href="https://github.com/adenjonah/APAH" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </Button>
    </div>
  );
}

export default About;
