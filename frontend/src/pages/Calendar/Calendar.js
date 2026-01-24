import React, { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import dueDatesData from "./DueDates.json";
import artPiecesData from "../../data/artworks.json";

// Get the current academic year start (September)
const getCurrentAcademicYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 8 ? year : year - 1;
};

// Convert month-day string to full date with correct academic year
const getAcademicDate = (monthDayStr) => {
  const parts = monthDayStr.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const academicYearStart = getCurrentAcademicYear();
  const year = month >= 9 ? academicYearStart : academicYearStart + 1;
  return new Date(year, month - 1, day);
};

// Format date to comparable string
const formatDateKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Pre-compute all dates with academic year applied
  const dueDatesWithYear = useMemo(() => {
    const assignmentsByDate = {};
    const quizzesByDate = {};

    dueDatesData.assignments.forEach((assignment) => {
      const date = getAcademicDate(assignment.dueDate);
      const key = formatDateKey(date);
      if (!assignmentsByDate[key]) {
        assignmentsByDate[key] = [];
      }
      assignmentsByDate[key].push(assignment);
    });

    dueDatesData.quizzes?.forEach((quiz) => {
      const date = getAcademicDate(quiz.dueDate);
      const key = formatDateKey(date);
      if (!quizzesByDate[key]) {
        quizzesByDate[key] = [];
      }
      quizzesByDate[key].push(quiz);
    });

    return { assignmentsByDate, quizzesByDate };
  }, []);

  const onDateClick = (date) => {
    setSelectedDate(date);
    const key = formatDateKey(date);
    setAssignments(dueDatesWithYear.assignmentsByDate[key] || []);
    setQuizzes(dueDatesWithYear.quizzesByDate[key] || []);
  };

  // Select current date on mount
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
        <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--accent-color)" }}>
          Homework Due:
        </h3>
        <ul className="space-y-2" style={{ color: "var(--accent-color)" }}>
          {assignments.map((assignment, index) => {
            if (isNaN(parseInt(assignment.id))) {
              return (
                <li
                  key={`${assignment.id}-${index}`}
                  className="py-1 px-2 rounded hover:bg-[var(--button-color)] transition-colors duration-200"
                >
                  {assignment.id}
                </li>
              );
            } else {
              const artPiece = artPiecesData.find(
                (piece) => piece.id === parseInt(assignment.id)
              );
              if (!artPiece) return null;

              return (
                <li
                  key={`${assignment.id}-${index}`}
                  className="py-1 px-2 rounded hover:bg-[var(--button-color)] transition-colors duration-200"
                >
                  <a
                    href={`/exhibit?id=${assignment.id}`}
                    className="flex items-center transition-colors duration-200"
                    style={{ color: "var(--accent-color)" }}
                  >
                    <span className="font-bold mr-2" style={{ color: "var(--accent-color)" }}>
                      {assignment.id}.
                    </span>
                    <span style={{ color: "var(--accent-color)" }}>{artPiece.name}</span>
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
        <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--accent-color)" }}>
          Quizzes:
        </h3>
        <ul className="space-y-2" style={{ color: "var(--text-color)" }}>
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
          <p className="text-lg" style={{ color: "var(--text-color)" }}>
            Nothing due today.
          </p>
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

  const academicYearStart = getCurrentAcademicYear();
  const formattedSelectedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="flex flex-col items-center p-6 max-w-4xl mx-auto"
      style={{ color: "var(--text-color)" }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--accent-color)" }}>
          Class Calendar
        </h1>
        <p className="text-md max-w-2xl mx-auto" style={{ color: "var(--text-color)" }}>
          This calendar breaks down a consistent study approach to cover all materials by
          the date of the AP test in the spring.
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-color)", opacity: 0.8 }}>
          Academic Year: {academicYearStart}-{academicYearStart + 1}
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
        <div className="bg-[var(--button-color)] py-3 px-6" style={{ color: "var(--button-text-color)" }}>
          <h2 className="text-xl font-semibold">{formattedSelectedDate}</h2>
        </div>

        <div className="p-6" style={{ color: "var(--text-color)" }}>
          {selectedDate ? renderContent() : <p className="text-center py-4">Select a date to view items due</p>}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
