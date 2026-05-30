import React, { useState } from "react";
import JonahHeadshot from "./jonah-headshot.webp";
import CalebHeadshot from "./caleb-headshot.webp";
import KorusHeadshot from "./korus-headshot.webp";
import PageHeading from "../../components/PageHeading";

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

interface Person {
  id: string;
  name: string;
  image: string;
  bio: string;
  link: { href: string; label: string };
}

/** Circular headshot with a purple-gold duotone treatment (grayscale base +
 *  gold→aubergine gradient tint). Uses a NORMAL-blend overlay on purpose:
 *  mix-blend-mode forces an isolated compositing buffer that flattens the
 *  parent's `transform-style: preserve-3d`, which silently broke the card flip.
 *  `isolation: isolate` further guarantees this headshot can't affect the 3D. */
function DuoHeadshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: 168,
        height: 168,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid var(--gold-color)",
        margin: "0 auto",
        flexShrink: 0,
        isolation: "isolate",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          filter: "grayscale(100%) brightness(1.05) contrast(1.02) sepia(0.25)",
          display: "block",
        }}
      />
      {/* Gold→aubergine duotone tint (normal blend — safe for 3D flip) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(150deg, rgba(205,161,78,0.42), rgba(85,40,111,0.55))",
        }}
      />
    </div>
  );
}

interface FlipCardProps {
  person: Person;
  isFlipped: boolean;
  onFlip: (id: string) => void;
}

function FlipCard({ person, isFlipped, onFlip }: FlipCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "A" || (e.target as HTMLElement).closest("a")) return;
    onFlip(person.id);
  };

  return (
    <div className="w-full max-w-[320px] sm:w-[280px] h-[380px] sm:h-[400px] group [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer rounded-xl ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        } lg:group-hover:[transform:rotateY(180deg)]`}
        onClick={handleClick}
      >
        {/* Front — headshot + name */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] rounded-xl flex flex-col items-center justify-center text-center p-6"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-gold)",
          }}
        >
          <DuoHeadshot src={person.image} alt={person.name} />
          <h2
            className="font-display mt-5 text-2xl"
            style={{ color: "var(--gold-soft)" }}
          >
            {person.name}
          </h2>
        </div>

        {/* Back — bio + link */}
        <div
          className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl p-6 text-center flex flex-col justify-between"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-gold)",
          }}
        >
          <p
            className="font-display italic text-sm leading-relaxed mt-4"
            style={{ color: "var(--text-default)" }}
          >
            {person.bio}
          </p>
          <a
            href={person.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center self-center mb-2 px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80 touch-manipulation"
            style={{
              background: "var(--gold-color)",
              color: "var(--ink-on-gold)",
              textDecoration: "none",
            }}
          >
            {person.link.label}
          </a>
        </div>
      </div>
    </div>
  );
}

function About() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="flex flex-col items-center justify-start text-center h-full w-full pt-6 sm:pt-10 px-4 pb-16 sm:pb-24"
      style={{ background: "var(--background-color)" }}
    >
      <PageHeading title="About Us" className="mb-8" />

      <div className="flex justify-center flex-wrap max-w-7xl mx-auto mb-8 gap-4 sm:gap-6 w-full">
        {PEOPLE.map((person) => (
          <FlipCard
            key={person.id}
            person={person}
            isFlipped={!!flippedCards[person.id]}
            onFlip={handleFlip}
          />
        ))}
      </div>

      <h2
        className="font-display text-3xl sm:text-4xl mt-4 mb-4"
        style={{ color: "var(--text-strong)" }}
      >
        Our Story
      </h2>
      <p
        className="text-base max-w-[90%] sm:max-w-2xl mx-auto mb-6 leading-relaxed"
        style={{ color: "var(--text-default)" }}
      >
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

      <p
        className="mb-4 max-w-[90%] sm:max-w-2xl text-sm sm:text-base"
        style={{ color: "var(--text-muted)" }}
      >
        Reach out to us at:{" "}
        <a
          href="mailto:HistoryThroughArt@gmail.com"
          className="font-semibold hover:opacity-80 transition-opacity break-all"
          style={{ color: "var(--gold-soft)" }}
        >
          HistoryThroughArt@gmail.com
        </a>
      </p>

      <a
        href="https://github.com/adenjonah/APAH"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80 touch-manipulation"
        style={{
          background: "transparent",
          color: "var(--text-strong)",
          border: "1px solid var(--border-gold)",
          textDecoration: "none",
        }}
      >
        View on GitHub
      </a>
    </div>
  );
}

export default About;
