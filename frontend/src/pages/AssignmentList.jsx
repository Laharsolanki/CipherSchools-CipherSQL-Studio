import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments } from '../services/api';

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAssignments()
            .then(data => {
                setAssignments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="assignment-list">
            <header className="assignment-list__header">
                <h1 className="assignment-list__title">CipherSQL Studio Assignments</h1>
                <p className="assignment-list__subtitle">Select an assignment to begin practicing your SQL skills with our AI-powered interactive sandbox.</p>
                <button className="btn btn--outline mt-sm">Explore New Challenges</button>
            </header>
            
            <main>
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <h3>Loading Assignments...</h3>
                    </div>
                ) : (
                    <div className="assignment-list__grid">
                        {assignments.map((assignment, index) => (
                            <div key={assignment._id} className="assignment-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="assignment-card__header">
                                    <span className={`difficulty difficulty--${assignment.difficulty.toLowerCase()}`}>
                                        {assignment.difficulty}
                                    </span>
                                    <span className="assignment-card__icon">★</span>
                                </div>
                                <h2 className="assignment-card__title">{assignment.title}</h2>
                                <p className="assignment-card__desc">{assignment.description}</p>
                                
                                <div className="assignment-card__footer">
                                    <span className="assignment-card__time">15 mins avg.</span>
                                    <Link to={`/assignments/${assignment._id}`} className="btn btn--primary">
                                        Attempt Now <span className="arrow">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AssignmentList;
