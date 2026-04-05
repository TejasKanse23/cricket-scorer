import { useState } from 'react';
import { WICKET_TYPES } from '../cricketReducer';
import '../styles/ScoreControls.css';

// ── Options sheet for Wide ────────────────────────────────────────────────────
function WideSheet({ onConfirm, onCancel }) {
  const [extraRuns, setExtraRuns] = useState(0);
  const [runOut, setRunOut] = useState(false);

  return (
    <div className="sheet-overlay" onClick={onCancel}>
      <div className="options-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h3 className="sheet-title">↔️ Wide Ball</h3>
        <p className="sheet-sub">+1 wide penalty added automatically</p>

        <div className="sheet-section">
          <label className="sheet-label">Additional runs (batted)</label>
          <div className="chip-row">
            {[0, 1, 2, 3, 4, 6].map(r => (
              <button
                key={r}
                className={`chip ${extraRuns === r ? 'active' : ''} ${r === 4 ? 'chip-four' : ''} ${r === 6 ? 'chip-six' : ''}`}
                onClick={() => setExtraRuns(r)}
              >
                {r === 0 ? '+0' : `+${r}`}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <label className="sheet-label">Run-out on wide?</label>
          <div className="toggle-pair">
            <button className={`toggle-opt ${!runOut ? 'active' : ''}`} onClick={() => setRunOut(false)}>No</button>
            <button className={`toggle-opt ${runOut ? 'active danger' : ''}`} onClick={() => setRunOut(true)}>Run-out ✓</button>
          </div>
        </div>

        <button
          className="sheet-confirm"
          onClick={() => onConfirm({ extra: 'wide', extraRuns, wicket: runOut, wicketType: runOut ? 'Run-out' : null })}
        >
          Confirm Wide · {1 + extraRuns} run{1 + extraRuns !== 1 ? 's' : ''}
        </button>
        <button className="sheet-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Options sheet for No Ball ─────────────────────────────────────────────────
function NoBallSheet({ onConfirm, onCancel }) {
  const [batsmanRuns, setBatsmanRuns] = useState(0);
  const [withWicket, setWithWicket] = useState(false);
  const [wicketType, setWicketType] = useState('Run-out');

  return (
    <div className="sheet-overlay" onClick={onCancel}>
      <div className="options-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h3 className="sheet-title">⛔ No Ball</h3>
        <p className="sheet-sub">+1 no-ball penalty added automatically</p>

        <div className="sheet-section">
          <label className="sheet-label">Runs off the bat</label>
          <div className="chip-row">
            {[0, 1, 2, 3, 4, 6].map(r => (
              <button
                key={r}
                className={`chip ${batsmanRuns === r ? 'active' : ''} ${r === 4 ? 'chip-four' : ''} ${r === 6 ? 'chip-six' : ''}`}
                onClick={() => setBatsmanRuns(r)}
              >
                {r === 0 ? '•' : r}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <label className="sheet-label">Wicket on no ball?</label>
          <div className="toggle-pair">
            <button className={`toggle-opt ${!withWicket ? 'active' : ''}`} onClick={() => setWithWicket(false)}>No wicket</button>
            <button className={`toggle-opt ${withWicket ? 'active danger' : ''}`} onClick={() => setWithWicket(true)}>Wicket</button>
          </div>
        </div>

        {withWicket && (
          <div className="sheet-section">
            <label className="sheet-label">Wicket type</label>
            <div className="wicket-chip-row">
              {WICKET_TYPES.map(wt => (
                <button
                  key={wt}
                  className={`wicket-chip ${wicketType === wt ? 'active' : ''}`}
                  onClick={() => setWicketType(wt)}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="sheet-confirm"
          onClick={() => onConfirm({ extra: 'noball', runs: batsmanRuns, wicket: withWicket, wicketType: withWicket ? wicketType : null })}
        >
          Confirm No Ball · {1 + batsmanRuns} run{1 + batsmanRuns !== 1 ? 's' : ''}
        </button>
        <button className="sheet-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Options sheet for Wicket ──────────────────────────────────────────────────
function WicketSheet({ onConfirm, onCancel }) {
  const [wicketType, setWicketType] = useState('Bowled');
  const [runs, setRuns] = useState(0);

  return (
    <div className="sheet-overlay" onClick={onCancel}>
      <div className="options-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h3 className="sheet-title">🎯 Wicket</h3>

        <div className="sheet-section">
          <label className="sheet-label">Wicket type</label>
          <div className="wicket-chip-row">
            {WICKET_TYPES.map(wt => (
              <button
                key={wt}
                className={`wicket-chip ${wicketType === wt ? 'active' : ''}`}
                onClick={() => setWicketType(wt)}
              >
                {wt}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <label className="sheet-label">Runs before wicket</label>
          <div className="chip-row">
            {[0, 1, 2, 3, 4, 6].map(r => (
              <button
                key={r}
                className={`chip ${runs === r ? 'active' : ''} ${r === 4 ? 'chip-four' : ''} ${r === 6 ? 'chip-six' : ''}`}
                onClick={() => setRuns(r)}
              >
                {r === 0 ? '•' : r}
              </button>
            ))}
          </div>
        </div>

        <button
          className="sheet-confirm danger-confirm"
          onClick={() => onConfirm({ runs, wicket: true, wicketType })}
        >
          Confirm Wicket ({wicketType})
        </button>
        <button className="sheet-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Main ScoreControls ────────────────────────────────────────────────────────
export default function ScoreControls({ dispatch, canUndo, onScorecardToggle, showingScorecard, needsNextOverAck }) {
  const [sheet, setSheet] = useState(null); // null | 'wide' | 'noball' | 'wicket'

  const runBall = (runs) => {
    dispatch({ type: 'BALL', runs });
  };

  const confirmExtra = (payload) => {
    dispatch({ type: 'BALL', ...payload });
    setSheet(null);
  };

  const BUTTONS = [
    { id: 'btn-dot',    label: 'Dot',    cls: 'btn-dot',    action: () => runBall(0) },
    { id: 'btn-wide',   label: 'Wide',   cls: 'btn-wide',   action: () => setSheet('wide') },
    { id: 'btn-noball', label: 'No Ball',cls: 'btn-noball', action: () => setSheet('noball') },
    { id: 'btn-1',      label: '1',      cls: 'btn-run',    action: () => runBall(1) },
    { id: 'btn-2',      label: '2',      cls: 'btn-run',    action: () => runBall(2) },
    { id: 'btn-3',      label: '3',      cls: 'btn-run',    action: () => runBall(3) },
    { id: 'btn-4',      label: '4',      cls: 'btn-four',   action: () => runBall(4) },
    { id: 'btn-6',      label: '6',      cls: 'btn-six',    action: () => runBall(6) },
    { id: 'btn-wicket', label: 'Wicket', cls: 'btn-wicket', action: () => setSheet('wicket') },
  ];

  return (
    <>
      {/* Button Grid or Over Complete Overlay */}
      <div style={{ position: 'relative' }}>
        <div className="score-grid">
          {BUTTONS.map(btn => (
            <button key={btn.id} id={btn.id} className={`score-btn ${btn.cls}`} onClick={btn.action} disabled={needsNextOverAck}>
              {btn.label}
            </button>
          ))}
        </div>
        
        {needsNextOverAck && (
          <div className="over-complete-overlay">
            <div className="over-complete-content">
              <h3>Over Complete!</h3>
              <button 
                className="next-over-btn"
                onClick={() => dispatch({ type: 'START_NEXT_OVER' })}
              >
                Start Next Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="action-bar">
        <button
          id="scoreboard-btn"
          className={`action-bar-btn scoreboard-btn ${showingScorecard ? 'active' : ''}`}
          onClick={onScorecardToggle}
        >
          📋 Scoreboard
        </button>
        <button
          id="undo-btn"
          className="action-bar-btn undo-btn"
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={!canUndo}
        >
          ↩ Undo
        </button>
      </div>

      {/* Sheets */}
      {sheet === 'wide'   && <WideSheet   onConfirm={confirmExtra} onCancel={() => setSheet(null)} />}
      {sheet === 'noball' && <NoBallSheet onConfirm={confirmExtra} onCancel={() => setSheet(null)} />}
      {sheet === 'wicket' && <WicketSheet onConfirm={confirmExtra} onCancel={() => setSheet(null)} />}
    </>
  );
}
