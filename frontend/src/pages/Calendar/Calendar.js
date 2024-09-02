import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'
import data from './DueDates.json'; // Import the JSON file

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const onDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];

    // Filter assignments for the selected date
    const dueAssignments = data.assignments.filter(
      (assignment) => assignment.dueDate === formattedDate
    );

    // Filter quizzes for the selected date
    const dueQuizzes = data.quizzes.filter(
      (quiz) => quiz.dueDate === formattedDate
    );

    setAssignments(dueAssignments);
    setQuizzes(dueQuizzes);
  };

  const renderContent = () => {
    if (assignments.length === 0 && quizzes.length === 0) {
      return <p>Nothing due on this day.</p>;
    }
    
    return (
      <div>
        {assignments.length > 0 && (
          <div>
            <h3>Assignments Due on {selectedDate.toDateString()}</h3>
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment.id}>Assignment ID: {assignment.id}</li>
              ))}
            </ul>
          </div>
        )}
        {quizzes.length > 0 && (
          <div>
            <h3>Quizzes Due on {selectedDate.toDateString()}</h3>
            <ul>
              {quizzes.map((quiz, index) => (
                <li key={index}>{quiz.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Korus' Class Calendar</h2>
      <Calendar
        onClickDay={onDateClick}
        value={selectedDate}
      />
      <div className="details-section">
        {selectedDate ? renderContent() : <p>Select a date to view details.</p>}
      </div>
    </div>
  );
}

export default CalendarPage;