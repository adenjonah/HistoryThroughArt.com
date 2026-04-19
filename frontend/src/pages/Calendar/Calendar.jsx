import React, { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { useDueDates, useArtworks } from "../../hooks/useSanityData";

const getCurrentAcademicYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 8 ? year : year - 1;
};

const getAcademicDate = (monthDayStr) => {
  const parts = monthDayStr.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const academicYearStart = getCurrentAcademicYear();
  const year = month >= 9 ? academicYearStart : academicYearStart + 1;
  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch data from Sanity
  const { dueDates: dueDatesData, loading: dueDatesLoading } = useDueDates();
  const { artworks: artPiecesData, loading: artworksLoading } = useArtworks();

  const loading = dueDatesLoading || artworksLoading;

  const dueDatesWithYear = useMemo(() => {
    if (loading || !dueDatesData.assignments) {
      return { assignmentsByDate: {}, quizzesByDate: {}, allDatesWithItems: new Set() };
    }

    const assignmentsByDate = {};
    const quizzesByDate = {};
    const allDatesWithItems = new Set();

    dueDatesData.assignments.forEach((assignment) => {
      const date = getAcademicDate(assignment.dueDate);
      const key = formatDateKey(date);
      if (!assignmentsByDate[key]) {
        assignmentsByDate[key] = [];
      }
      assignmentsByDate[key].push(assignment);
      allDatesWithItems.add(key);
    });

    dueDatesData.quizzes?.forEach((quiz) => {
      const date = getAcademicDate(quiz.dueDate);
      const key = formatDateKey(date);
      if (!quizzesByDate[key]) {
        quizzesByDate[key] = [];
      }
      quizzesByDate[key].push(quiz);
      allDatesWithItems.add(key);
    });

    return { assignmentsByDate, quizzesByDate, allDatesWithItems };
  }, [loading, dueDatesData]);

  const onDateClick = (date) => {
    setSelectedDate(date);
    const key = formatDateKey(date);
    setAssignments(dueDatesWithYear.assignmentsByDate[key] || []);
    setQuizzes(dueDatesWithYear.quizzesByDate[key] || []);
  };

  useEffect(() => {
    onDateClick(new Date());
    // eslint-disable-next-line
  }, []);

  // Event dot - dark, visible
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = formatDateKey(date);
    if (dueDatesWithYear.allDatesWithItems.has(key)) {
      return (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--background-color)] opacity-60" />
      );
    }
    return null;
  };

  const renderAssignments = () => {
    if (assignments.length === 0) return null;

    return (
      <div className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--background-color)] opacity-50 mb-3">
          Homework Due
        </h3>
        <ul className="space-y-0.5">
          {assignments.map((assignment, index) => {
            if (isNaN(parseInt(assignment.id))) {
              return (
                <li
                  key={`${assignment.id}-${index}`}
                  className="py-2.5 px-3 rounded text-sm text-[var(--background-color)] font-medium
                    hover:bg-[var(--background-color)]/10 transition-colors duration-150"
                >
                  {assignment.id}
                </li>
              );
            }

            const artPiece = artPiecesData.find(
              (piece) => piece.id === parseInt(assignment.id)
            );
            if (!artPiece) return null;

            return (
              <li key={`${assignment.id}-${index}`}>
                <a
                  href={`/exhibit?id=${assignment.id}`}
                  className="flex items-center py-2.5 px-3 rounded text-sm
                    text-[var(--background-color)] hover:bg-[var(--background-color)]/10
                    transition-colors duration-150 group"
                >
                  <span className="font-bold mr-3 min-w-[1.75rem]">
                    {assignment.id}
                  </span>
                  <span className="font-medium">
                    {artPiece.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderQuizzes = () => {
    if (quizzes.length === 0) return null;

    return (
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--background-color)] opacity-50 mb-3">
          Quizzes
        </h3>
        <ul className="space-y-0.5">
          {quizzes.map((quiz, index) => (
            <li
              key={index}
              className="py-2.5 px-3 rounded text-sm text-[var(--background-color)] font-medium
                hover:bg-[var(--background-color)]/10 transition-colors duration-150"
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
        <div className="py-6 text-center">
          <p className="text-sm text-[var(--background-color)] opacity-50 font-medium">
            No assignments due
          </p>
        </div>
      );
    }

    return (
      <div className="py-2">
        {renderAssignments()}
        {renderQuizzes()}
      </div>
    );
  };

  const academicYearStart = getCurrentAcademicYear();
  const formattedSelectedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse text-lg text-[var(--text-color)]">
            Loading calendar...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 w-full">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-color)] opacity-60">
          {academicYearStart}–{academicYearStart + 1}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-color)] mt-1">
          Study Calendar
        </h1>
      </div>

      {/* Calendar card */}
      <div className="w-full bg-[var(--foreground-color)] rounded-lg overflow-hidden">
        <Calendar
          onClickDay={onDateClick}
          value={selectedDate}
          className="custom-calendar"
          locale="en-US"
          tileContent={tileContent}
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
        />

        {/* Details panel */}
        <div className="border-t border-[var(--background-color)]/15">
          <div className="px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--background-color)]">
              {formattedSelectedDate}
            </h2>
          </div>
          <div className="px-5 pb-5">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
