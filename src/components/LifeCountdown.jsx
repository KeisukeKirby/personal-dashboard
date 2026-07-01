import React, { useState, useEffect } from 'react';
import './SharedStyles.css';

const LifeCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0
  });
  const [lifeStats, setLifeStats] = useState({ percentage: '0.000000' });

  useEffect(() => {
    // 1992年7月26日生まれ、82歳になるのは2074年7月26日
    const birthDate = new Date('1992-07-26T00:00:00').getTime();
    const targetDate = new Date('2074-07-26T00:00:00').getTime();
    const totalLifeSpan = targetDate - birthDate;

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      const elapsed = now - birthDate;

      if (difference > 0) {
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ 
          years, 
          days, 
          hours, 
          minutes, 
          seconds, 
          totalSeconds: Math.floor(difference / 1000) 
        });

        // パーセンテージ計算 (小数点第6位まで表示して、滑らかに動くようにする)
        const percent = ((elapsed / totalLifeSpan) * 100).toFixed(6);
        setLifeStats({ percentage: percent });
      } else {
        setTimeLeft({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        setLifeStats({ percentage: '100.000000' });
      }
    };

    updateTimer(); // 初回実行
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="component-container">
      <h2>Life Countdown (82歳まで)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', marginTop: '40px' }}>
        
        {/* 人生の進捗プログレスバー */}
        <div style={{ width: '100%', maxWidth: '700px', background: 'var(--secondary-bg)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>人生の進捗 (0歳 → 82歳)</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)', fontVariantNumeric: 'tabular-nums' }}>
              {lifeStats.percentage} %
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '24px', 
            backgroundColor: 'var(--bg-color)', 
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: `${lifeStats.percentage}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              transition: 'width 1s linear'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <TimeUnit value={timeLeft.years} label="年" />
          <TimeUnit value={timeLeft.days} label="日" />
          <TimeUnit value={timeLeft.hours} label="時間" />
          <TimeUnit value={timeLeft.minutes} label="分" />
          <TimeUnit value={timeLeft.seconds} label="秒" />
        </div>

        <div style={{ 
          marginTop: '20px', 
          fontSize: '24px', 
          fontWeight: '600',
          background: 'var(--secondary-bg)',
          padding: '20px 40px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow)'
        }}>
          残り総秒数: <span style={{ color: 'var(--primary-color)', fontFamily: 'monospace', fontSize: '28px' }}>{timeLeft.totalSeconds.toLocaleString()}</span> 秒
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }) => (
  <div style={{ 
    background: 'var(--secondary-bg)', 
    border: '1px solid var(--border-color)', 
    borderRadius: '12px', 
    padding: '20px', 
    minWidth: '100px', 
    textAlign: 'center', 
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-color)', fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
    <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>{label}</div>
  </div>
);

export default LifeCountdown;
