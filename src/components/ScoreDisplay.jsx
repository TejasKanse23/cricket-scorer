import { calcRunRate, calcRequiredRate } from '../cricketReducer';
import '../styles/ScoreDisplay.css';

function getBallClass(ball) {
  if (!ball) return 'ball-empty';
  if (ball.wicket) return 'ball-wkt';
  if (ball.label === '4') return 'ball-four';
  if (ball.label === '6') return 'ball-six';
  if (ball.extra > 0) return 'ball-extra';
  if (ball.label === '•' || ball.runs === 0) return 'ball-dot';
  return 'ball-run';
}

function getBallLabel(ball) {
  if (!ball) return '';
  if (ball.wicket) return 'W';
  if (ball.extra > 0 && ball.label?.startsWith('Wd')) return 'Wd';
  if (ball.extra > 0 && ball.label?.startsWith('NB')) return 'NB';
  if (ball.runs === 4) return '4';
  if (ball.runs === 6) return '6';
  if (ball.runs === 0 && ball.extra === 0) return '•';
  return String(ball.runs);
}

export default function ScoreDisplay({ state }) {
  const { phase, teamA, teamB, innings1, innings2, target, totalOvers } = state;
  const inn = phase === 'innings1' ? innings1 : innings2;
  const battingTeam = phase === 'innings1' ? teamA : teamB;
  const isInnings2 = phase === 'innings2';

  const balls = inn.ballsBowled;
  const overNum = Math.floor(balls / 6);
  const ballInOver = balls % 6;
  const overStr = `${overNum}.${ballInOver}`;

  const runRate = calcRunRate(inn.runs, balls);
  const totalBalls = totalOvers * 6;
  const runsNeeded = isInnings2 && target ? target - inn.runs : null;
  const ballsLeft = isInnings2 ? totalBalls - balls : null;
  const rrr = isInnings2 ? calcRequiredRate(runsNeeded, ballsLeft) : null;

  // Build the 6 ball slots for current over
  const legalBalls = inn.currentOverBalls.filter(b => b.legalBall);
  const slots = Array.from({ length: 6 }, (_, i) => legalBalls[i] || null);
  // Show all balls (legal + extras) in trail but 6 slots for legal count
  const currentOverAll = inn.currentOverBalls;

  return (
    <div className="score-display">
      {/* Team & Innings Label */}
      <div className="sd-meta">
        <span className="sd-team">{battingTeam}</span>
        <span className="sd-innings-tag">{phase === 'innings1' ? '1st Inn' : '2nd Inn'}</span>
      </div>

      {/* Big Score */}
      <div className="sd-score-row">
        <span className="sd-runs">{inn.runs}</span>
        <span className="sd-slash">/</span>
        <span className="sd-wickets">{inn.wickets}</span>
        <span className="sd-overs-small">.{overStr}</span>
      </div>

      {/* Target / Needed */}
      {isInnings2 && target && (
        <div className={`sd-target-strip ${runsNeeded <= 0 ? 'won' : ''}`}>
          {runsNeeded > 0
            ? `Need ${runsNeeded} off ${ballsLeft} balls · RRR ${rrr}`
            : `🎉 Target Achieved!`}
        </div>
      )}

      {/* Current Over — 6 Ball Slots */}
      <div className="sd-over-section">
        <span className="sd-over-label">This over</span>
        <div className="sd-ball-slots">
          {slots.map((ball, i) => (
            <div key={i} className={`sd-ball-slot ${getBallClass(ball)}`}>
              {ball ? getBallLabel(ball) : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="sd-stats-strip">
        <div className="sd-stat">
          <span className="sd-stat-val">{runRate}</span>
          <span className="sd-stat-lbl">CRR</span>
        </div>
        {isInnings2 && (
          <div className="sd-stat highlight">
            <span className="sd-stat-val">{rrr}</span>
            <span className="sd-stat-lbl">RRR</span>
          </div>
        )}
        <div className="sd-stat">
          <span className="sd-stat-val">{inn.extras}</span>
          <span className="sd-stat-lbl">Extras</span>
        </div>
        <div className="sd-stat">
          <span className="sd-stat-val">{totalOvers - overNum}</span>
          <span className="sd-stat-lbl">Overs left</span>
        </div>
      </div>
    </div>
  );
}
