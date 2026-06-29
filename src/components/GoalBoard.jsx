import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import './SharedStyles.css';

const GoalBoard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [status, setStatus] = useState('To Do');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: true });
    if (!error && data) setGoals(data);
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const { data, error } = await supabase
      .from('goals')
      .insert([{ title: newGoal, status }])
      .select();

    if (!error && data) {
      setGoals([...goals, data[0]]);
      setNewGoal('');
    }
  };

  const deleteGoal = async (id) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const updateStatus = async (id, newStatus) => {
    const { data, error } = await supabase
      .from('goals')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (!error && data) {
      setGoals(goals.map(g => g.id === id ? data[0] : g));
    }
  };

  return (
    <div className="component-container">
      <h2>Goals</h2>
      <form onSubmit={addGoal} className="add-form">
        <input 
          type="text" 
          value={newGoal} 
          onChange={(e) => setNewGoal(e.target.value)} 
          placeholder="New goal..."
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button type="submit"><FaPlus /> Add</button>
      </form>

      <div className="goal-board">
        {['To Do', 'In Progress', 'Done'].map(col => (
          <div key={col} className="goal-column">
            <h3>{col}</h3>
            {goals.filter(g => g.status === col).map(goal => (
              <div key={goal.id} className="goal-card">
                <span>{goal.title}</span>
                <div className="goal-actions">
                  <select 
                    value={goal.status} 
                    onChange={(e) => updateStatus(goal.id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                  <button onClick={() => deleteGoal(goal.id)} className="delete-btn"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalBoard;
