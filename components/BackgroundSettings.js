// Background Settings Component with Neumorphism Design
import { useState, useEffect } from 'react'

const backgroundOptions = [
  { 
    id: 'nature', 
    name: 'Forest Nature', 
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80'
  },
  { 
    id: 'mountains', 
    name: 'Mountain Vista', 
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'
  },
  { 
    id: 'ocean', 
    name: 'Ocean Waves', 
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80'
  },
  { 
    id: 'flower', 
    name: 'Cherry Blossom', 
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80'
  },
  { 
    id: 'sunset', 
    name: 'Golden Sunset', 
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80'
  },
  { 
    id: 'lavender', 
    name: 'Lavender Fields', 
    url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=80'
  },
  { 
    id: 'autumn', 
    name: 'Autumn Forest', 
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  },
  { 
    id: 'tropical', 
    name: 'Tropical Beach', 
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'
  },
  { 
    id: 'bamboo', 
    name: 'Bamboo Garden', 
    url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&q=80'
  },
  { 
    id: 'sakura', 
    name: 'Japanese Sakura', 
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80'
  },
  { 
    id: 'waterfall', 
    name: 'Waterfall Oasis', 
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&q=80'
  },
  { 
    id: 'starry', 
    name: 'Starry Night Sky', 
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80'
  }
]

export default function BackgroundSettings({ show, onClose }) {
  const [selectedBg, setSelectedBg] = useState('nature')
  const [blurIntensity, setBlurIntensity] = useState(0)
  const [brightness, setBrightness] = useState(100)

  useEffect(() => {
    const saved = localStorage.getItem('app-background')
    if (saved) {
      const config = JSON.parse(saved)
      setSelectedBg(config.id || 'nature')
      setBlurIntensity(config.blur || 0)
      setBrightness(config.brightness || 100)
    }
  }, [])

  const applyBackground = (bgId) => {
    const bg = backgroundOptions.find(b => b.id === bgId)
    if (bg) {
      const config = {
        id: bgId,
        url: bg.url,
        blur: blurIntensity,
        brightness: brightness
      }
      localStorage.setItem('app-background', JSON.stringify(config))
      setSelectedBg(bgId)
      
      // Apply immediately to body
      document.body.style.backgroundImage = `url(${bg.url})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.filter = `blur(${blurIntensity}px) brightness(${brightness}%)`
    }
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff', // Neumorphism
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            🎨 Background Settings
          </h2>
          <button 
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
              boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff', // Neumorphism
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.boxShadow = 'inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff'
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
            }}
          >
            ✕
          </button>
        </div>

        {/* Background Options Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {backgroundOptions.map(bg => (
            <div
              key={bg.id}
              onClick={() => applyBackground(bg.id)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: selectedBg === bg.id 
                  ? 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff' // Neumorphism pressed
                  : '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff', // Neumorphism raised
                border: selectedBg === bg.id ? '3px solid #667eea' : '1px solid rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                if (selectedBg !== bg.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '12px 12px 24px #d1d1d1, -12px -12px 24px #ffffff'
                }
              }}
              onMouseOut={(e) => {
                if (selectedBg !== bg.id) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff'
                }
              }}
            >
              <div style={{ 
                height: '180px', 
                backgroundImage: `url(${bg.preview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontWeight: '600', fontSize: '16px', color: '#1a1a1a' }}>
                  {bg.name}
                </div>
                {selectedBg === bg.id && (
                  <div style={{ 
                    marginTop: '8px', 
                    color: '#667eea', 
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ✓ Active
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Adjustment Controls with Neumorphism */}
        <div style={{ 
          background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff' // Neumorphism inset
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
            Fine-tune Appearance
          </h3>
          
          {/* Blur Control */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
              Background Blur: {blurIntensity}px
            </label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              value={blurIntensity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setBlurIntensity(val)
                const config = JSON.parse(localStorage.getItem('app-background') || '{}')
                config.blur = val
                localStorage.setItem('app-background', JSON.stringify(config))
              }}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                outline: 'none',
                background: 'linear-gradient(to right, #667eea, #764ba2)'
              }}
            />
          </div>

          {/* Brightness Control */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
              Brightness: {brightness}%
            </label>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={brightness}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setBrightness(val)
                const config = JSON.parse(localStorage.getItem('app-background') || '{}')
                config.brightness = val
                localStorage.setItem('app-background', JSON.stringify(config))
              }}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                outline: 'none',
                background: 'linear-gradient(to right, #333, #fff)'
              }}
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => {
            applyBackground(selectedBg)
            setTimeout(() => window.location.reload(), 300)
          }}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.5)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.4)'
          }}
        >
          Apply & Reload
        </button>
      </div>
    </div>
  )
}
