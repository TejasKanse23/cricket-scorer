// ─── Cricket Reducer ────────────────────────────────────────────────────────
// Handles all match logic using useReducer pattern

export const WICKET_TYPES = ['Bowled', 'Caught', 'Run-out', 'Stumped', 'LBW', 'Hit Wicket'];

export const initialState = {
  phase: 'setup',         // 'setup' | 'innings1' | 'innings2' | 'result'
  teamA: '',
  teamB: '',
  totalOvers: 20,

  // Innings 1
  innings1: {
    runs: 0,
    wickets: 0,
    ballsBowled: 0,      // Legal deliveries only
    extras: 0,
    overs: [],           // Array of over arrays: each over = array of ball events
    currentOverBalls: [],
    history: [],         // For undo: snapshots of innings state
    needsNextOverAck: false,
  },

  // Innings 2
  innings2: {
    runs: 0,
    wickets: 0,
    ballsBowled: 0,
    extras: 0,
    overs: [],
    currentOverBalls: [],
    history: [],
    needsNextOverAck: false,
  },

  target: null,          // runs needed to win (innings1.runs + 1)
  targetOversPlayed: null, // For manual target entry
  manualTarget: false,
  needsInningsBreakAck: false, // For innings break popup

  matchResult: null,     // e.g. "Team A won by 5 wickets"
};

// ─── Helper: get active innings key ─────────────────────────────────────────
export const activeKey = (state) => state.phase === 'innings1' ? 'innings1' : 'innings2';

// ─── Helper: calculate overs string ─────────────────────────────────────────
export const oversStr = (balls, totalOvers) => {
  const o = Math.floor(balls / 6);
  const b = balls % 6;
  return `${o}.${b}`;
};

// ─── Helper: check if innings is complete ────────────────────────────────────
function isInningsOver(innings, totalOvers, target = null, maxWickets = 10) {
  const completedOvers = Math.floor(innings.ballsBowled / 6);
  if (target && innings.runs >= target) return true;
  return innings.wickets >= maxWickets || completedOvers >= totalOvers;
}

// ─── Helper: deep clone innings ──────────────────────────────────────────────
function cloneInnings(inn) {
  return {
    ...inn,
    overs: inn.overs.map(o => [...o]),
    currentOverBalls: [...inn.currentOverBalls],
    history: inn.history, // keep reference; we push snapshots
  };
}

// ─── Helper: save snapshot for undo ──────────────────────────────────────────
function withSnapshot(inn) {
  const snapshot = {
    runs: inn.runs,
    wickets: inn.wickets,
    ballsBowled: inn.ballsBowled,
    extras: inn.extras,
    overs: inn.overs.map(o => [...o]),
    currentOverBalls: [...inn.currentOverBalls],
    needsNextOverAck: inn.needsNextOverAck,
  };
  return { ...inn, history: [...inn.history, snapshot] };
}

// ─── Helper: apply a ball event ──────────────────────────────────────────────
// Returns updated innings object
// ballEvent: { type, runs, extra, wicket, wicketType, legalBall, label }
function applyBall(inn, ballEvent) {
  let newInn = withSnapshot(inn);

  newInn.runs += ballEvent.runs || 0;

  if (ballEvent.wicket) {
    newInn.wickets += 1;
  }

  if (ballEvent.extra) {
    newInn.extras += ballEvent.extra;
  }

  if (ballEvent.legalBall) {
    newInn.ballsBowled += 1;
  }

  // Add to current over
  newInn.currentOverBalls = [...newInn.currentOverBalls, ballEvent];

  // If we completed an over (6 legal balls)
  if (newInn.ballsBowled > 0 && newInn.ballsBowled % 6 === 0 && ballEvent.legalBall) {
    newInn.overs = [...newInn.overs, [...newInn.currentOverBalls]];
    newInn.currentOverBalls = [];
    newInn.needsNextOverAck = true;
  }

  return newInn;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
export function cricketReducer(state, action) {
  switch (action.type) {

    // ── Setup ───────────────────────────────────────────────────────────────
    case 'START_MATCH': {
      return {
        ...initialState,
        phase: 'innings1',
        teamA: action.teamA,
        teamB: action.teamB,
        totalOvers: action.totalOvers,
      };
    }

    case 'SET_MANUAL_TARGET': {
      const target = action.targetRuns + 1;
      return {
        ...state,
        phase: 'innings2',
        target,
        manualTarget: true,
        targetOversPlayed: action.oversPlayed,
        innings1: {
          ...initialState.innings1,
          runs: action.targetRuns,
          ballsBowled: Math.round(action.oversPlayed * 6),
        },
      };
    }

    // ── Ball Delivery ────────────────────────────────────────────────────────
    case 'BALL': {
      const key = activeKey(state);
      const inn = state[key];

      // Build ballEvent from action payload
      const { extra, extraRuns, runs, wicket, wicketType } = action;
      let ballEvent = {
        runs: 0,
        extra: 0,
        wicket: false,
        wicketType: null,
        legalBall: true,
        label: '',
      };

      if (extra === 'wide') {
        const wideRuns = 1 + (extraRuns || 0);
        ballEvent = {
          runs: wideRuns,
          extra: wideRuns,
          wicket: wicket && wicketType === 'Run-out',
          wicketType: wicket ? wicketType : null,
          legalBall: wicket && wicketType === 'Run-out',  // run-out on wide = legal
          label: wicket ? `Wd+Ro+${extraRuns || 0}` : `Wd${extraRuns ? '+' + extraRuns : ''}`,
        };
      } else if (extra === 'noball') {
        const nbRuns = 1 + (runs || 0) + (extraRuns || 0);
        let wicketCounts = false;
        let ballCounts = true;

        if (wicket) {
          if (wicketType === 'Run-out') {
            wicketCounts = true;
            ballCounts = true;
          } else if (wicketType === 'Caught' || wicketType === 'Stumped') {
            wicketCounts = false;
            ballCounts = true;
          } else if (wicketType === 'Bowled' || wicketType === 'LBW') {
            wicketCounts = false;
            ballCounts = false;
          } else {
            wicketCounts = false;
            ballCounts = true;
          }
        } else {
          ballCounts = false; // no wicket on no-ball → not a legal delivery
        }

        ballEvent = {
          runs: nbRuns,
          extra: 1, // only 1 extra (the no-ball penalty)
          wicket: wicketCounts,
          wicketType: wicket ? wicketType : null,
          legalBall: ballCounts && wicketCounts ? true : (wicketCounts ? true : false),
          label: `NB+${runs || 0}${wicket ? '+' + wicketType[0] : ''}`,
        };

        // Simplified: no-ball without wicket = not legal
        if (!wicket) {
          ballEvent.legalBall = false;
        } else if (wicketType === 'Run-out') {
          ballEvent.legalBall = true;
        } else {
          ballEvent.legalBall = false;
        }

      } else if (wicket) {
        ballEvent = {
          runs: runs || 0,
          extra: 0,
          wicket: true,
          wicketType,
          legalBall: true,
          label: `W(${wicketType[0]})${runs ? '+' + runs : ''}`,
        };
      } else {
        // Normal delivery
        const r = runs || 0;
        ballEvent = {
          runs: r,
          extra: 0,
          wicket: false,
          wicketType: null,
          legalBall: true,
          label: r === 0 ? '•' : r === 4 ? '4' : r === 6 ? '6' : String(r),
        };
      }

      const updatedInn = applyBall(inn, ballEvent);

      let newState = { ...state, [key]: updatedInn };

      // Check innings end
      if (isInningsOver(updatedInn, state.totalOvers, state.target)) {
        newState = handleInningsEnd(newState, key);
      }

      return newState;
    }

    // ── Undo ─────────────────────────────────────────────────────────────────
    case 'UNDO': {
      const key = activeKey(state);
      const inn = state[key];
      if (!inn.history.length) return state;

      const prev = inn.history[inn.history.length - 1];
      const restoredInn = {
        ...inn,
        ...prev,
        history: inn.history.slice(0, -1),
      };
      return { ...state, [key]: restoredInn };
    }

    // ── Start Next Over ──────────────────────────────────────────────────────
    case 'START_NEXT_OVER': {
      const key = activeKey(state);
      const inn = state[key];
      return {
        ...state,
        [key]: { ...inn, needsNextOverAck: false }
      };
    }

    // ── Start 2nd Innings ────────────────────────────────────────────────────
    case 'START_2ND_INNINGS': {
      return {
        ...state,
        needsInningsBreakAck: false
      };
    }

    // ── End Innings Manually ─────────────────────────────────────────────────
    case 'END_INNINGS': {
      const key = activeKey(state);
      return handleInningsEnd(state, key);
    }

    // ── Reset ────────────────────────────────────────────────────────────────
    case 'RESET': {
      return { ...initialState };
    }

    default:
      return state;
  }
}

function handleInningsEnd(state, key) {
  if (key === 'innings1') {
    const target = state.innings1.runs + 1;
    return { ...state, phase: 'innings2', target, needsInningsBreakAck: true };
  } else {
    // Determine match result
    const result = determineResult(state);
    return { ...state, phase: 'result', matchResult: result };
  }
}

function determineResult(state) {
  const { teamA, teamB, innings1, innings2, target } = state;
  const battingTeam = teamB; // team B bats in innings 2
  const bowlingTeam = teamA;

  if (innings2.runs >= target) {
    const wicketsLeft = 10 - innings2.wickets;
    return `${battingTeam} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`;
  } else {
    const runsWon = innings1.runs - innings2.runs;
    return `${bowlingTeam} won by ${runsWon} run${runsWon !== 1 ? 's' : ''}`;
  }
}

// ─── Stat Helpers ─────────────────────────────────────────────────────────────
export function calcRunRate(runs, balls) {
  if (balls === 0) return 0;
  return ((runs / balls) * 6).toFixed(2);
}

export function calcRequiredRate(runsNeeded, ballsRemaining) {
  if (ballsRemaining === 0) return '∞';
  return ((runsNeeded / ballsRemaining) * 6).toFixed(2);
}

export function calcNRR(inn1, inn2, totalOvers) {
  const r1 = inn1.runs / (inn1.ballsBowled / 6 || totalOvers);
  const r2 = inn2.runs / (inn2.ballsBowled / 6 || totalOvers);
  return (r1 - r2).toFixed(3);
}
