import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import dueDatesData from "./DueDates.json";
import artPiecesData from "../../data/artworks.json";

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

      // eslint-disable-next-line
  }, []);

  const renderAssignments = () => {
    if (assignments.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--accent-color)' }}>Homework Due:</h3>
        <ul className="space-y-2" style={{ color: 'var(--accent-color)' }}>
          {assignments.map((assignment) => {
            if (isNaN(parseInt(assignment.id))) {
              return <li key={assignment.id} className="py-1 px-2 rounded hover:bg-[var(--button-color)] transition-colors duration-200">{assignment.id}</li>;
            } else {
              const artPiece = artPiecesData.find(
                (piece) => piece.id === parseInt(assignment.id)
              );
              if (!artPiece) return null;

              return (
                <li key={assignment.id} className="py-1 px-2 rounded hover:bg-[var(--button-color)] transition-colors duration-200">
                  <a 
                    href={`/exhibit?id=${assignment.id}`}
                    className="flex items-center transition-colors duration-200"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    <span className="font-bold mr-2" style={{ color: 'var(--accent-color)' }}>{assignment.id}.</span>
                    <span style={{ color: 'var(--accent-color)' }}>{artPiece.name}</span>
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
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--accent-color)' }}>Quizzes:</h3>
        <ul className="space-y-2" style={{ color: 'var(--text-color)' }}>
          {quizzes.map((quiz, index) => (
            <li 
              key={index} 
              className="py-1 px-2 rounded hover:bg-[var(--button-color)] transition-colors duration-200"
            >
              {quiz.title}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderContent = () => {
    if (assignments.length === 0 && quizzes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg" style={{ color: 'var(--text-color)' }}>Nothing due today.</p>
        </div>
      );
    }

    return (
      <div className="py-4">
        {renderAssignments()}
        {renderQuizzes()}
      </div>
    );
  };

  const formattedSelectedDate = selectedDate ? 
    selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto" style={{ color: 'var(--text-color)' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--accent-color)' }}>Class Calendar</h1>
        <p className="text-md max-w-2xl mx-auto" style={{ color: 'var(--text-color)' }}>
          This calendar breaks down a consistent study approach to cover all
          materials by the date of the AP test in the spring, assuming you start
          in September 2024.
        </p>
      </div>
      
      <div className="w-full max-w-xl bg-[var(--foreground-color)] rounded-xl shadow-lg overflow-hidden">
        <Calendar 
          onClickDay={onDateClick} 
          value={selectedDate} 
          className="custom-calendar"
          locale="en-US"
          nextLabel={<span className="calendar-nav-arrow">›</span>}
          prevLabel={<span className="calendar-nav-arrow">‹</span>}
          next2Label={<span className="calendar-nav-arrow">»</span>}
          prev2Label={<span className="calendar-nav-arrow">«</span>}
        />
      </div>
      
      <div className="w-full max-w-xl mt-8 bg-[var(--foreground-color)] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[var(--button-color)] py-3 px-6" style={{ color: 'var(--button-text-color)' }}>
          <h2 className="text-xl font-semibold">{formattedSelectedDate}</h2>
        </div>
        
        <div className="p-6" style={{ color: 'var(--text-color)' }}>
          {selectedDate ? (
            renderContent()
          ) : (
            <p className="text-center py-4">Select a date to view items due</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
