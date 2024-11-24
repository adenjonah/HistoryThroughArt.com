import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import dueDatesData from "./DueDates.json";
import artPiecesData from "../../Data/artworks.json";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);


  const formatDate = (date) => {
      date = date.toLocaleDateString("en-US").split("/");
      if(date.length === 3) {
          const year = date[2];
          const day = date[1];
          const month = date[0];
          return `${year}-${month}-${day}`;
      }
      return "";
  }
  const onDateClick = (date) => {
    const formattedDate = formatDate(date);

    setSelectedDate(date);

    const dueAssignments = dueDatesData.assignments.filter((assignment) => {
      return assignment.dueDate === formattedDate;
    });
    const dueQuizzes =
      dueDatesData.quizzes?.filter((quiz) => quiz.dueDate === formattedDate) ||
      [];

    setAssignments(dueAssignments);
    setQuizzes(dueQuizzes);
  };

    // Calls onDateClick when the page first loads. Makes sure that the current date is selected.
    useEffect(() => {
        onDateClick(new Date());

        // stupid error shut up
        // eslint-disable-next-line
    }, []);

  const renderAssignments = () => {
    if (assignments.length === 0) {
      return null;
    }

    return (
      <div>
        <h3>Homework Due:</h3>
        <ul>
          {assignments.map((assignment) => {
            if (isNaN(parseInt(assignment.id))) {
              return <li key={assignment.id}>{assignment.id}</li>;
            } else {
              const artPiece = artPiecesData.find(
                (piece) => piece.id === parseInt(assignment.id)
              );
              if (!artPiece) return null;

              return (
                <li key={assignment.id}>
                  <a href={`/exhibit?id=${assignment.id}`}>
                    {`${assignment.id}. ${artPiece.name}`}
                  </a>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  };

  const renderQuizzes = () => {
    if (quizzes.length === 0) {
      return null;
    }

    return (
      <div>
        <h3>Quizzes:</h3>
        <ul>
          {quizzes.map((quiz, index) => (
            <li key={index}>{quiz.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderContent = () => {
    if (assignments.length === 0 && quizzes.length === 0) {
      return <p className="details-section">Nothing due today.</p>;
    }

    return (
      <div className="details-section">
        {renderAssignments()}
        {renderQuizzes()}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Class Calendar</h2>
      <p className="subhead">
        This calendar breaks down a consistent study approach to cover all
        materials by the date of the AP test in the spring, assuming you start
        in September 2024.
      </p>
      <Calendar onClickDay={onDateClick} value={selectedDate} />
      <div className="details-section">
        {selectedDate ? (
          renderContent()
        ) : (
          <p>Select a date to view items due</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
