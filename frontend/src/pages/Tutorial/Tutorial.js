import React from "react";
import "../Home/Home.css";
import "./Tutorial.css";

function Tutorial() {
  return (
    <div className="pagecontainer">
      <h1 className="title">Tutorial</h1>
      <p className="aboutblurb">
        The following video provides a comprehensive walkthrough of this site's
        features and design, explaining common uses and ideas for utilizing this
        learning aid:
      </p>

      <div className="about video">
        <iframe
          width="700"
          height="400"
          src="https://www.youtube.com/embed/pv1N-USnLhE"
          title="Tutorial"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Tutorial;
