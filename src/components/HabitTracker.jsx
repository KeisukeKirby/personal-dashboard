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
      <div className="habit-layout">
        <div className="habit-main">
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

        <div className="daily-flow">
          <h2>脳科学にもとづく最高の1日</h2>
          <ul className="timeline">
            <li><span className="time">23:00 - 07:00</span> <span className="desc">7時間以上の睡眠 (メラトニン)</span></li>
            <li><span className="time">07:00 - 09:00</span> <span className="desc">自己投資 (脳のゴールデンタイム)</span></li>
            <li><span className="time">09:00 - 12:00</span> <span className="desc">集中時間 (缶詰)</span></li>
            <li><span className="time">12:00 - 13:00</span> <span className="desc">ランチ (セロトニン)</span></li>
            <li><span className="time">13:00 - 16:00</span> <span className="desc">非集中仕事 (仮眠・こまめにリセット)</span></li>
            <li><span className="time">16:00 - 18:00</span> <span className="desc">ラストスパート (場所替え・ノルアドレナリン)</span></li>
            <li><span className="time">18:00 - 19:00</span> <span className="desc">運動 (脳をリセット)</span></li>
            <li><span className="time">19:00 - 21:00</span> <span className="desc">自己投資 (脳のゴールデンタイム2)</span></li>
            <li><span className="time">21:00 - 23:00</span> <span className="desc">リラックスタイム (オキシトシン)</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
