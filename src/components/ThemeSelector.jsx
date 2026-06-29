import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaTint } from 'react-icons/fa';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themes = [
    { id: 'light', icon: <FaSun />, label: 'Light' },
    { id: 'dark', icon: <FaMoon />, label: 'Dark' },
    { id: 'ocean', icon: <FaTint />, label: 'Ocean' },
  ];

  return (
    <div className="theme-selector">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => toggleTheme(t.id)}
          className={`theme-btn ${theme === t.id ? 'active' : ''}`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
