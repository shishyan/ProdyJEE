import { useState, useEffect } from 'react';

export default function ViewportDebug() {
  const [vh, setVh] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const updateValues = () => {
      setVh(window.innerHeight * 0.01);
      setInnerHeight(window.innerHeight);
    };

    updateValues();
    window.addEventListener('resize', updateValues);
    window.addEventListener('orientationchange', updateValues);

    return () => {
      window.removeEventListener('resize', updateValues);
      window.removeEventListener('orientationchange', updateValues);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Inner Height: {innerHeight}px</div>
      <div>--vh: {vh.toFixed(2)}px</div>
      <div>Calc Height: {(vh * 100).toFixed(2)}px</div>
    </div>
  );
}