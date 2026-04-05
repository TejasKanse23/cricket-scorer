import { calcRunRate, calcNRR } from '../cricketReducer';
import '../styles/Scorecard.css';

export default function Scorecard({ state, onReset }) {
  const { teamA, teamB, innings1, innings2, target, totalOvers, phase, matchResult } = state;
  const isResult = phase === 'result';
  const nrr = calcNRR(innings1, innings2, totalOvers);

  const renderInnings = (inn, teamName, label) => {
    const balls = inn.ballsBowled;
    const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
    const rr = calcRunRate(inn.runs, balls);

    return (
      <div className="sc-innings">
        <div className="sc-innings-header">
          <span className="sc-team">{teamName}</span>
          <span className="sc-label">{label}</span>
        </div>
        <div className="sc-score-line">
          <span className="sc-score">{inn.runs}/{inn.wickets}</span>
          <span className="sc-overs">({overs} ov)</span>
          <span className="sc-rr">RR: {rr}</span>
        </div>
        <div className="sc-extras">Extras: {inn.extras}</div>

        {/* Over-by-over table */}
        {inn.overs.length > 0 && (
          <div className="sc-table-wrap">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Over</th>
                  <th>Balls</th>
                  <th>Runs</th>
                  <th>Wkts</th>
                </tr>
              </thead>
              <tbody>
                {inn.overs.map((over, i) => {
                  const overRuns = over.reduce((s, b) => s + b.runs, 0);
                  const overWkts = over.filter(b => b.wicket).length;
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="ball-cells">
                        {over.map((b, bi) => (
                          <span
                            key={bi}
                            className={`sc-ball ${b.label === '4' ? 'four' : ''} ${b.label === '6' ? 'six' : ''} ${b.wicket ? 'wkt' : ''} ${b.extra > 0 ? 'extra' : ''}`}
                          >
                            {b.label}
                          </span>
                        ))}
                      </td>
                      <td className="center">{overRuns}</td>
                      <td className="center">{overWkts > 0 ? overWkts : '—'}</td>
                    </tr>
                  );
                })}
                {/* Current incomplete over */}
                {inn.currentOverBalls.length > 0 && (
                  <tr className="current-row">
                    <td>{inn.overs.length + 1} <span className="live-chip">live</span></td>
                    <td className="ball-cells">
                      {inn.currentOverBalls.map((b, bi) => (
                        <span
                          key={bi}
                          className={`sc-ball ${b.label === '4' ? 'four' : ''} ${b.label === '6' ? 'six' : ''} ${b.wicket ? 'wkt' : ''} ${b.extra > 0 ? 'extra' : ''}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </td>
                    <td className="center">{inn.currentOverBalls.reduce((s, b) => s + b.runs, 0)}</td>
                    <td className="center">—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="scorecard">
      <div className="sc-header">
        <span className="sc-icon">📊</span>
        <h2>Full Scorecard</h2>
      </div>

      {isResult && matchResult && (
        <div className="result-banner">
          🏆 {matchResult}
        </div>
      )}

      {/* NRR */}
      {phase === 'result' && (
        <div className="nrr-box">
          <div className="nrr-title">Net Run Rate</div>
          <div className="nrr-val">{nrr}</div>
        </div>
      )}

      {renderInnings(innings1, teamA, '1st Innings')}

      {(phase === 'innings2' || phase === 'result') && (
        <>
          <div className="sc-divider" />
          {renderInnings(innings2, teamB, '2nd Innings')}
          {target && (
            <div className="sc-target-note">
              Target set: {target} runs
            </div>
          )}
        </>
      )}

      {isResult && (
        <button id="reset-match-btn" className="reset-btn" onClick={onReset}>
          🔄 New Match
        </button>
      )}
    </div>
  );
}
