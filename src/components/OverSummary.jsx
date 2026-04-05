import '../styles/OverSummary.css';

function getBallClass(ball) {
  if (ball.wicket) return 'wkt';
  if (ball.label === '4') return 'four';
  if (ball.label === '6') return 'six';
  if (ball.extra > 0) return 'extra';
  return 'normal';
}

export default function OverSummary({ inn }) {
  const allOvers = inn.overs;
  const currentOverBalls = inn.currentOverBalls;

  return (
    <div className="over-summary">
      <h3 className="os-title">📋 Over Summary</h3>
      <div className="overs-list">
        {allOvers.map((over, overIdx) => {
          const total = over.reduce((s, b) => s + b.runs, 0);
          return (
            <div key={overIdx} className="over-row">
              <div className="over-num">Ov {overIdx + 1}</div>
              <div className="balls-wrap">
                {over.map((ball, bi) => (
                  <span key={bi} className={`os-ball ${getBallClass(ball)}`}>
                    {ball.label}
                  </span>
                ))}
              </div>
              <div className="over-total">{total}</div>
            </div>
          );
        })}

        {/* Current (incomplete) over */}
        {currentOverBalls.length > 0 && (
          <div className="over-row current-over">
            <div className="over-num">Ov {allOvers.length + 1} <span className="live-tag">LIVE</span></div>
            <div className="balls-wrap">
              {currentOverBalls.map((ball, bi) => (
                <span key={bi} className={`os-ball ${getBallClass(ball)}`}>
                  {ball.label}
                </span>
              ))}
              {/* Empty placeholders */}
              {Array.from({ length: Math.max(0, 6 - currentOverBalls.filter(b => b.legalBall).length) }).map((_, i) => (
                <span key={`empty-${i}`} className="os-ball empty">·</span>
              ))}
            </div>
            <div className="over-total">
              {currentOverBalls.reduce((s, b) => s + b.runs, 0)}
            </div>
          </div>
        )}

        {allOvers.length === 0 && currentOverBalls.length === 0 && (
          <div className="no-overs">No balls bowled yet</div>
        )}
      </div>
    </div>
  );
}
