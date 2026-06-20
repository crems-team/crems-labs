import React, { useState, useEffect } from 'react';

const DebugSessionTimer: React.FC = () => {
  const [sessionStatus, setSessionStatus] = useState<string>('');
  const [lastActivity, setLastActivity] = useState<string>('');

  useEffect(() => {
    const updateStatus = () => {
      const isExpired = sessionStorage.getItem('session_expired') === 'true';
      setSessionStatus(isExpired ? 'EXPIRED' : 'ACTIVE');
      setLastActivity(new Date().toLocaleTimeString());
    };

    const interval = setInterval(updateStatus, 1000);
    updateStatus(); // Initial call

    return () => clearInterval(interval);
  }, []);

  const forceExpire = () => {
    sessionStorage.setItem('session_expired', 'true');
    console.log('🧪 FORCE EXPIRE SESSION');
  };

  const resetSession = () => {
    sessionStorage.removeItem('session_expired');
    console.log('🧪 RESET SESSION');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      minWidth: '200px'
    }}>
      <h6>🧪 DEBUG SESSION TIMER</h6>
      <div>Status: <strong>{sessionStatus}</strong></div>
      <div>Updated: {lastActivity}</div>
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={forceExpire}
          style={{ 
            background: 'red', 
            color: 'white', 
            border: 'none', 
            padding: '5px 10px', 
            marginRight: '5px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Force Expire
        </button>
        <button 
          onClick={resetSession}
          style={{ 
            background: 'green', 
            color: 'white', 
            border: 'none', 
            padding: '5px 10px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DebugSessionTimer;