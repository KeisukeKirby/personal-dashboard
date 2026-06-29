import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt, FaCheck, FaTrash } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import './SharedStyles.css';

const TravelList = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const { data, error } = await supabase.from('countries').select('*').order('created_at', { ascending: true });
    if (!error && data) setCountries(data);
  };

  const addCountry = async (e) => {
    e.preventDefault();
    if (!newCountry.trim()) return;

    const { data, error } = await supabase
      .from('countries')
      .insert([{ name: newCountry, visited: false }])
      .select();

    if (!error && data) {
      setCountries([...countries, data[0]]);
      setNewCountry('');
    }
  };

  const toggleVisited = async (country) => {
    const { data, error } = await supabase
      .from('countries')
      .update({ visited: !country.visited })
      .eq('id', country.id)
      .select();

    if (!error && data) {
      setCountries(countries.map(c => c.id === country.id ? data[0] : c));
    }
  };

  const deleteCountry = async (id) => {
    const { error } = await supabase.from('countries').delete().eq('id', id);
    if (!error) {
      setCountries(countries.filter(c => c.id !== id));
    }
  };

  return (
    <div className="component-container">
      <h2>Countries to Visit</h2>
      <form onSubmit={addCountry} className="add-form">
        <input 
          type="text" 
          value={newCountry} 
          onChange={(e) => setNewCountry(e.target.value)} 
          placeholder="Add a country..."
        />
        <button type="submit"><FaPlus /> Add</button>
      </form>

      <ul className="item-list">
        {countries.map(country => (
          <li key={country.id} className={`list-item ${country.visited ? 'completed' : ''}`}>
            <span onClick={() => toggleVisited(country)} className="item-text">
              <FaMapMarkerAlt className="marker-icon" />
              {country.name}
              {country.visited && <span className="badge">Visited <FaCheck /></span>}
            </span>
            <button onClick={() => deleteCountry(country.id)} className="delete-btn"><FaTrash /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TravelList;
