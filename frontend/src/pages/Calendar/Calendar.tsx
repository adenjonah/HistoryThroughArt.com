import React, { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { Link } from "react-router-dom";
import { useDueDates, useArtworks } from "../../hooks/useSanityData";
import PageHeading from "../../components/PageHeading";

const getCurrentAcademicYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 8 ? year : year - 1;
};

const getAcademicDate = (monthDayStr) => {
  if (typeof monthDayStr !== "string") return null;
  const parts = monthDayStr.split("-");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  // transformDueDates emits "" for malformed Sanity dates; bail before those
  // turn into an Invalid Date and pollute the calendar with a "NaN-NaN-NaN" key.
  if (Number.isNaN(month) || Number.isNaN(day)) return null;
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
      if (!date) return;
      const key = formatDateKey(date);
      if (!assignmentsByDate[key]) assignmentsByDate[key] = [];
      assignmentsByDate[key].push(assignment);
      allDatesWithItems.add(key);
    });

    dueDatesData.quizzes?.forEach((quiz) => {
      const date = getAcademicDate(quiz.dueDate);
      if (!date) return;
      const key = formatDateKey(date);
      if (!quizzesByDate[key]) quizzesByDate[key] = [];
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

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = formatDateKey(date);
    if (dueDatesWithYear.allDatesWithItems.has(key)) {
      return (
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--gold-soft)]" />
      );
    }
    return null;
  };

  const renderAssignments = () => {
    if (assignments.length === 0) return null;

    return (
      <div className="mb-5">
        <h3
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ letterSpacing: "0.08em", color: "var(--text-muted)" }}
        >
          Homework Due
        </h3>
        <ul className="flex flex-col gap-0.5">
          {assignments.map((assignment, index) => {
            if (isNaN(parseInt(assignment.id))) {
              return (
                <li
                  key={`${assignment.id}-${index}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm
                    text-[var(--text-strong)] font-medium transition-colors duration-150"
                  style={{ background: "rgba(85,40,111,0.16)" }}
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
                <Link
                  to={`/exhibit?id=${assignment.id}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm
                    transition-colors duration-150 group"
                  style={{ background: "rgba(85,40,111,0.16)" }}
                >
                  <span className="flex items-center gap-3.5">
                    <span
                      className="font-semibold min-w-[1.75rem]"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--gold-color)" }}
                    >
                      {assignment.id}
                    </span>
                    <span className="text-[var(--text-strong)]">{artPiece.name}</span>
                  </span>
                  <span className="text-[var(--text-muted)] text-xs ml-2">→</span>
                </Link>
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
        <h3
          className="text-xs font-semibold uppercase mb-3"
          style={{ letterSpacing: "0.08em", color: "var(--text-muted)" }}
        >
          Quizzes
        </h3>
        <ul className="flex flex-col gap-0.5">
          {quizzes.map((quiz, index) => (
            <li
              key={index}
              className="py-2.5 px-3 rounded-md text-sm text-[var(--text-strong)] font-medium
                transition-colors duration-150"
              style={{ background: "rgba(85,40,111,0.16)" }}
            >
              {quiz.title}
            </li>
          ))}
        </ul>
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
        <div className="animate-pulse text-lg text-[var(--text-color)]">
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-10 max-w-2xl mx-auto">
      <PageHeading
        eyebrow={`${academicYearStart}–${academicYearStart + 1}`}
        title="Study Calendar"
        className="mb-6 w-full"
      />

      <div className="w-full bg-[var(--surface-1)] rounded-xl overflow-hidden border border-[var(--border-gold)]">
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

        <div className="border-t border-[var(--border-soft)]">
          <div className="px-5 py-4">
            <h2 className="font-display text-lg text-[var(--text-strong)]">
              {formattedSelectedDate}
            </h2>
          </div>
          <div className="px-5 pb-5">
            {assignments.length === 0 && quizzes.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--text-muted)] font-medium">
                  No assignments due
                </p>
              </div>
            ) : (
              <div className="py-2">
                {renderAssignments()}
                {renderQuizzes()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
