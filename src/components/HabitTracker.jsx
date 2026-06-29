import React, { useState, useEffect } from 'react';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import './SharedStyles.css';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: true });
    if (!error && data) setHabits(data);
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name: newHabit, completed: false }])
      .select();
      
    if (!error && data) {
      setHabits([...habits, data[0]]);
      setNewHabit('');
    }
  };

  const toggleHabit = async (habit) => {
    const { data, error } = await supabase
      .from('habits')
      .update({ completed: !habit.completed })
      .eq('id', habit.id)
      .select();
      
    if (!error && data) {
      setHabits(habits.map(h => h.id === habit.id ? data[0] : h));
    }
  };

  const deleteHabit = async (id) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (!error) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  return (
    <div className="component-container">
      <h2>Daily Habits</h2>
      <form onSubmit={addHabit} className="add-form">
        <input 
          type="text" 
          value={newHabit} 
          onChange={(e) => setNewHabit(e.target.value)} 
          placeholder="New habit..."
        />
        <button type="submit"><FaPlus /> Add</button>
      </form>
      
      <ul className="item-list">
        {habits.map(habit => (
          <li key={habit.id} className={`list-item ${habit.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleHabit(habit)} className="item-text">
              {habit.completed && <FaCheck className="check-icon" />}
              {habit.name}
            </span>
            <button onClick={() => deleteHabit(habit.id)} className="delete-btn"><FaTrash /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitTracker;
