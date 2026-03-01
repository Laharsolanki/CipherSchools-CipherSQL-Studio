import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getAssignmentById, executeQuery, getHint } from '../services/api';

function AssignmentAttempt() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [hint, setHint] = useState('');
    const [hintLoading, setHintLoading] = useState(false);

    useEffect(() => {
        getAssignmentById(id).then(setAssignment).catch(console.error);
    }, [id]);

    const handleExecute = async () => {
        try {
            setError(null);
            const res = await executeQuery(query, id);
            setResults(res);
        } catch (err) {
            setResults(null);
            setError(err.response?.data?.error || err.message);
        }
    };

    const handleGetHint = async () => {
        if (!query) return alert('Please write some SQL first before asking for a hint!');
        setHintLoading(true);
        try {
            const h = await getHint(assignment.question, query);
            setHint(h);
        } catch (err) {
            alert('Error fetching hint');
        } finally {
            setHintLoading(false);
        }
    };

    if (!assignment) return <div>Loading Workspace...</div>;

    return (
        <div className="workspace">
            <header className="workspace__header">
                <div className="workspace__header-left">
                    <Link to="/" className="btn btn--outline btn--small">
                        <span className="icon">←</span> Back to Quests
                    </Link>
                    <h1 className="workspace__title">{assignment.title}</h1>
                </div>
                <div className="workspace__header-right">
                    <span className="workspace__time"><span className="icon">⏱</span> Time: 00:00</span>
                    <button className="btn btn--hint" onClick={handleGetHint} disabled={hintLoading}>
                        <span className="icon">💡</span>
                        {hintLoading ? 'Analyzing...' : 'Get Hint'}
                    </button>
                </div>
            </header>

            {hint && (
                <div className="workspace__hint-panel">
                    <span className="icon-magic">✨</span>
                    <div>
                        <strong>Teacher's Hint:</strong>
                        <p>{hint}</p>
                    </div>
                    <button className="btn-close" onClick={() => setHint('')}>×</button>
                </div>
            )}

            <main className="workspace__grid">
                {/* Left Sidebar */}
                <div className="workspace__sidebar">
                    <section className="workspace__panel workspace__panel--question">
                        <h3><span className="icon">🎯</span> Objective</h3>
                        <p>{assignment.question}</p>
                    </section>

                    <section className="workspace__panel workspace__panel--schema">
                        <h3><span className="icon">💿</span> Database Resources</h3>
                        
                        <div className="accordion">
                            <details className="accordion__item" open>
                                <summary className="accordion__header">
                                    <span className="icon">📋</span> Schema Definition
                                </summary>
                                <div className="accordion__body">
                                    <pre className="code-block code-block--info">{assignment.schemaText}</pre>
                                </div>
                            </details>
                            
                            <details className="accordion__item">
                                <summary className="accordion__header">
                                    <span className="icon">📊</span> Sample Data
                                </summary>
                                <div className="accordion__body">
                                    <pre className="code-block code-block--warning">{assignment.sampleData}</pre>
                                </div>
                            </details>
                        </div>
                    </section>
                </div>

                {/* Right Workspace */}
                <div className="workspace__main">
                    <section className="workspace__panel workspace__panel--editor">
                        <div className="panel-header">
                            <h3><span className="icon">💻</span> SQL Editor</h3>
                            <button className="btn btn--primary btn--small" onClick={handleExecute}>
                                <span className="icon">▶</span> Run Query
                            </button>
                        </div>
                        <div className="editor-container">
                            <Editor
                                height="100%"
                                defaultLanguage="sql"
                                theme="vs-dark"
                                value={query}
                                onChange={setQuery}
                                options={{ 
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                    padding: { top: 16 }
                                }}
                            />
                        </div>
                    </section>

                    <section className="workspace__panel workspace__panel--results">
                        <div className="panel-header">
                            <h3><span className="icon">🖥️</span> Execution Results</h3>
                            {results && results.rows && <span className="badge badge--success">{results.rowCount} rows</span>}
                        </div>
                        
                        <div className="results-container">
                            {error && (
                                <div className="error-message">
                                    <span className="icon">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}
                            
                            {results && results.rows && results.rows.length > 0 && (
                                <div className="table-responsive">
                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                {results.fields.map(f => <th key={f}>{f}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.rows.map((row, i) => (
                                                <tr key={i}>
                                                    {results.fields.map(f => <td key={f}>{row[f]}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {results && results.rows && results.rows.length === 0 && (
                                <div className="empty-state">
                                    <span className="empty-state__icon">📭</span>
                                    <p>Query executed successfully. 0 rows returned.</p>
                                </div>
                            )}
                            {!results && !error && (
                                <div className="empty-state">
                                    <span className="empty-state__icon">▶️</span>
                                    <p>Write your SQL query above and click <strong className="text-primary">Run Query</strong> to see results.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AssignmentAttempt;
