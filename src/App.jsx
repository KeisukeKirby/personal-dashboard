import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import HabitTracker from './components/HabitTracker';
import GoalBoard from './components/GoalBoard';
import TravelList from './components/TravelList';
import { FaCheckSquare, FaBullseye, FaGlobeAmericas } from 'react-icons/fa';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('habits');

  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <h1>My Dashboard</h1>
          </div>
          <ThemeSelector />
        </header>

        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            <FaCheckSquare /> Habits
          </button>
          <button 
            className={`nav-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            <FaBullseye /> Goals
          </button>
          <button 
            className={`nav-btn ${activeTab === 'travel' ? 'active' : ''}`}
            onClick={() => setActiveTab('travel')}
          >
            <FaGlobeAmericas /> Travel
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'habits' && <HabitTracker />}
          {activeTab === 'goals' && <GoalBoard />}
          {activeTab === 'travel' && <TravelList />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
