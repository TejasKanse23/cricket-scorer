import { useReducer, useState, useEffect } from 'react';
import { cricketReducer, initialState } from './cricketReducer';
import MatchSetup from './components/MatchSetup';
import ScoreDisplay from './components/ScoreDisplay';
import ScoreControls from './components/ScoreControls';
import Scorecard from './components/Scorecard';
import OverSummary from './components/OverSummary';
// import './index.css'; is imported in main.jsx

function App() {
  const [state, dispatch] = useReducer(cricketReducer, initialState);
  const [theme, setTheme] = useState('light');
  const [showScorecard, setShowScorecard] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 1) Splash Screen View
  if (showSplash) {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        background: theme === 'dark' ? '#0a0d14' : '#f0f4f8',
        color: theme === 'dark' ? '#f0f4ff' : '#0f172a',
        fontFamily: "'Rajdhani', sans-serif"
      }}>
         <div style={{ fontSize: '5rem', animation: 'bounce 1.5s infinite ease-in-out' }}>🏏</div>
         <h1 style={{ fontSize: '3rem', margin: '1rem 0' }} className="fade-in">
           Cricket <span style={{ color: theme === 'dark' ? '#00e5a0' : '#009e70' }}>Scorer</span>
         </h1>
         <p style={{ fontSize: '1.2rem', color: theme === 'dark' ? '#8892a4' : '#64748b', animation: 'fadeIn 1s ease' }}>
           Created by Tejas Kanse
         </p>
      </div>
    );
  }

  // Helper Header
  const renderHeader = () => (
    <header className="app-header fade-in">
      <div className="logo">
        <span className="cricket-emoji">🏏</span> Cricket<span>Scorer</span>
      </div>
      <div className="header-actions">
        {state.phase !== 'setup' && (
          <button 
            className="header-btn danger" 
            onClick={() => {
              if(window.confirm('Are you sure you want to reset the match? All progress will be lost.')) {
                dispatch({ type: 'RESET' });
                setShowScorecard(false);
              }
            }} 
            title="Reset Match"
          >
            🔄 Reset
          </button>
        )}
        <button 
          className="header-btn" 
          onClick={handleToggleTheme} 
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );

  // 2) Setup phase
  if (state.phase === 'setup') {
    return <MatchSetup dispatch={dispatch} theme={theme} onToggleTheme={handleToggleTheme} />;
  }

  // 3) Result phase
  if (state.phase === 'result') {
    return (
      <>
        {renderHeader()}
        <main className="app-content fade-in">
          <div className="result-view">
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="result-trophy">🏆</div>
              <h2 className="result-title">Match Finished</h2>
              <p className="result-subtitle">{state.matchResult}</p>
              <button 
                className="start-btn"
                onClick={() => dispatch({ type: 'RESET' })}
              >
                🔄 New Match
              </button>
            </div>
            <Scorecard state={state} onReset={() => dispatch({ type: 'RESET' })} />
          </div>
        </main>
      </>
    );
  }

  // 4) Playing phase
  const innKey = state.phase === 'innings1' ? 'innings1' : 'innings2';
  const inn = state[innKey];

  return (
    <>
      {renderHeader()}
      <main className="app-content scoring-view fade-in">
        <ScoreDisplay state={state} />
        
        <ScoreControls 
          dispatch={dispatch} 
          canUndo={inn.history.length > 0}
          onScorecardToggle={() => setShowScorecard(!showScorecard)}
          showingScorecard={showScorecard}
          needsNextOverAck={inn.needsNextOverAck}
        />
        
        <div style={{ marginTop: '20px' }}>
          {showScorecard ? (
            <Scorecard state={state} onReset={() => dispatch({ type: 'RESET' })} />
          ) : (
            <OverSummary inn={inn} />
          )}
        </div>
      </main>

      {/* Innings Break Popup */}
      {state.needsInningsBreakAck && (
        <div className="innings-break-overlay">
          <div className="ib-card">
            <div className="ib-icon">🎯</div>
            <h2 className="ib-title">Innings Break</h2>
            
            <div className="ib-stats">
              <div className="ib-target-label">Target for {state.teamB || 'Team B'}</div>
              <div className="ib-target-runs">{state.target}</div>
              <div className="ib-target-balls">in {state.totalOvers} overs</div>
            </div>

            <button 
              className="start-btn ib-start-btn"
              onClick={() => {
                dispatch({ type: 'START_2ND_INNINGS' });
                setShowScorecard(false);
              }}
            >
              Start 2nd Innings
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;