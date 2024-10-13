import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // Import the Calendar CSS file
import dueDatesData from './DueDates.json'; // Import the JSON file with due dates
import artPiecesData from '../../Data/artworks.json'; // Import the JSON file with art piece details

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date points to today
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const onDateClick = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0];


        // Filter assignments and quizzes for the selected date
        const dueAssignments = dueDatesData.assignments.filter(
            (assignment) => {
                return assignment.dueDate === formattedDate
            }
        );
        const dueQuizzes = dueDatesData.quizzes?.filter(
            (quiz) => quiz.dueDate === formattedDate
        ) || [];

        setAssignments(dueAssignments);
        setQuizzes(dueQuizzes);
    };

    // console.log(assignments);
    const renderAssignments = () => {
        if (assignments.length === 0) {
            return null;
        }

        return (
            <div>
                <h3>Homework Due:</h3>
                <ul>
                    {assignments.map((assignment) => {
                        // Checks if the assignment ID is not a number
                        if (isNaN(parseInt(assignment.id))) {
                            return (
                                <li key={assignment.id}>
                                    {assignment.id}
                                </li>
                            );
                        } else {
                            // Find the corresponding art piece by its numeric ID
                            const artPiece = artPiecesData.find(piece => piece.id === parseInt(assignment.id));
                            if (!artPiece) return null; // Handle case where art piece is not found

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
                        <li key={index}>
                            {quiz.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderContent = () => {
        if (assignments.length === 0 && quizzes.length === 0) {
            return <p className='details-section'>Nothing due today.</p>;
        }

        return (
            <div className='details-section'>
                {renderAssignments()}
                {renderQuizzes()}
            </div>
        );
    };

    return (
        <div className="calendar-page">
            <h2>Class Calendar</h2>
            <p className='subhead'>
                This calendar breaks down a consistent study approach to cover all materials
                by the date of the AP test in the spring, assuming you start in September 2024.
            </p>
            <Calendar
                onClickDay={onDateClick}
                value={selectedDate}
            />
            <div className="details-section">
                {selectedDate ? renderContent() : <p>Select a date to view items due</p>}
            </div>
        </div>
    );

}

export default CalendarPage;