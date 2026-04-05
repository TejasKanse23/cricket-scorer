import { useState } from 'react';
import '../styles/MatchSetup.css';

export default function MatchSetup({ dispatch, theme, onToggleTheme }) {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [totalOvers, setTotalOvers] = useState(20);
  const [oversInput, setOversInput] = useState('20');
  const [mode, setMode] = useState('normal'); // 'normal' | 'manual'
  const [manualRuns, setManualRuns] = useState('');
  const [manualOvers, setManualOvers] = useState('');

  const handleOversChange = (val) => {
    setOversInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n > 0 && n <= 100) setTotalOvers(n);
  };

  const getOvers = () => {
    const n = parseInt(oversInput, 10);
    return (!isNaN(n) && n > 0 && n <= 100) ? n : 20;
  };

  const handleStart = () => {
    dispatch({
      type: 'START_MATCH',
      teamA: teamA.trim() || 'Team A',
      teamB: teamB.trim() || 'Team B',
      totalOvers: getOvers(),
    });
  };

  const handleManualTarget = () => {
    if (!manualRuns || !manualOvers) return;
    
    // When manually setting a target, the overs played in the 1st innings 
    // restrict the total overs for the 2nd innings chase.
    const chaseOvers = Number(manualOvers);
    
    dispatch({
      type: 'START_MATCH',
      teamA: teamA.trim() || 'Team A',
      teamB: teamB.trim() || 'Team B',
      totalOvers: chaseOvers,
    });
    setTimeout(() => {
      dispatch({
        type: 'SET_MANUAL_TARGET',
        targetRuns: Number(manualRuns),
        oversPlayed: chaseOvers,
      });
    }, 0);
  };

  return (
    <div className="setup-wrapper">
      <div className="setup-card">
        {/* Logo + Theme Toggle */}
        <div className="setup-logo">
          <div className="logo-row">
            <span className="cricket-emoji">🏏</span>
            <button
              id="theme-toggle-setup"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <h1>Cricket Scorer</h1>
          <p className="setup-sub">Professional Ball-by-Ball Scoring</p>
        </div>

        <div className="setup-form">
          {/* Quick Start Notice */}
          <div className="quick-note">
            💡 Team names are optional — leave blank to use Team A / Team B
          </div>

          <div className="input-group">
            <label>Team A <span className="opt-tag">optional</span></label>
            <input
              id="teamA-input"
              type="text"
              placeholder="Team A"
              value={teamA}
              onChange={e => setTeamA(e.target.value)}
              maxLength={30}
            />
          </div>

          <div className="input-group">
            <label>Team B <span className="opt-tag">optional</span></label>
            <input
              id="teamB-input"
              type="text"
              placeholder="Team B"
              value={teamB}
              onChange={e => setTeamB(e.target.value)}
              maxLength={30}
            />
          </div>

          <div className="input-group">
            <label>Number of Overs</label>
            <div className="overs-input-row">
              <input
                id="overs-input"
                type="number"
                placeholder="e.g. 20"
                value={oversInput}
                onChange={e => handleOversChange(e.target.value)}
                min={1}
                max={100}
                className="overs-number-input"
              />
              <div className="overs-quick-chips">
                {[5, 10, 20, 50].map(o => (
                  <button
                    key={o}
                    id={`over-btn-${o}`}
                    className={`overs-micro-chip ${getOvers() === o ? 'active' : ''}`}
                    onClick={() => { setOversInput(String(o)); setTotalOvers(o); }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mode-tabs">
            <button
              id="mode-normal"
              className={`mode-tab ${mode === 'normal' ? 'active' : ''}`}
              onClick={() => setMode('normal')}
            >
              🏏 Full Match
            </button>
            <button
              id="mode-manual"
              className={`mode-tab ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              🎯 Set Target
            </button>
          </div>

          {mode === 'manual' && (
            <div className="manual-target-fields">
              <div className="input-row">
                <div className="input-group half">
                  <label>1st Inn Runs</label>
                  <input
                    id="manual-runs"
                    type="number"
                    placeholder="e.g. 165"
                    value={manualRuns}
                    onChange={e => setManualRuns(e.target.value)}
                    min={0}
                  />
                </div>
                <div className="input-group half">
                  <label>Overs Played</label>
                  <input
                    id="manual-overs"
                    type="number"
                    placeholder={`e.g. ${getOvers()}`}
                    value={manualOvers}
                    onChange={e => setManualOvers(e.target.value)}
                    min={0}
                    max={getOvers()}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            id="start-match-btn"
            className="start-btn"
            onClick={mode === 'manual' ? handleManualTarget : handleStart}
            disabled={mode === 'manual' && (!manualRuns || !manualOvers)}
          >
            {mode === 'manual' ? '🎯 Start 2nd Innings' : '🏏 Start Match'}
          </button>
        </div>

        <p className="created-by">Created by Tejas Kanse</p>
      </div>
    </div>
  );
}
