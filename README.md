# Cricket Scorer

A fast, interactive, and easy-to-use web application to score cricket matches. Built with modern web technologies, this app allows you to set up matches, track scores ball-by-ball, manage extras, and view detailed match statistics in real-time.

## 🚀 Features

- **Match Setup**: Easily configure team names and the total number of overs for the match.
- **Ball-by-Ball Tracking**: Record runs, wickets, and extras (wides, no-balls) with granular controls.
- **Comprehensive Wicket Types**: Support for multiple dismissal types including Bowled, Caught, Run-out, Stumped, LBW, and Hit Wicket.
- **Innings Management**: Automatically handles innings transitions, target setting, and match results.
- **Real-Time Statistics**: Instantly calculates and displays:
  - Current Run Rate (CRR)
  - Required Run Rate (RRR)
  - Target score tracking
- **Over Summary**: Visual breakdown of the current and past overs.
- **Undo Functionality**: Made a mistake? Easily undo the last ball.
- **End Match Result**: Automatically computes the match result (e.g., "Team A won by 20 runs" or "Team B won by 5 wickets").

## 🛠️ Tech Stack

This project is built using:

- **Frontend Framework**: [React 19](https://react.dev/) using Hooks and the `useReducer` pattern for complex state management.
- **Build Tool**: [Vite](https://vitejs.dev/) for extremely fast development server and optimized production builds.
- **Styling**: Vanilla CSS for styling components.
- **Language**: JavaScript (ES6+).

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd "Cricket Scorer"
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Your terminal will output a local URL (usually `http://localhost:5173/`). Open this URL in your web browser to start using the Cricket Scorer!

## 📦 Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will compile and optimize the files into the `dist` directory, which can then be deployed to your favorite hosting platform.