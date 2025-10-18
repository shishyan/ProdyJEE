// Background Settings Component with Neumorphism Design
import { useState, useEffect } from 'react'

const backgroundOptions = [
  // Nature & Forests (6 options)
  { 
    id: 'nature', 
    name: 'Forest Nature', 
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    category: 'Nature'
  },
  { 
    id: 'green-forest', 
    name: 'Green Forest Path', 
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80',
    category: 'Nature'
  },
  { 
    id: 'misty-forest', 
    name: 'Misty Forest', 
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
    category: 'Nature'
  },
  { 
    id: 'bamboo', 
    name: 'Bamboo Garden', 
    url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&q=80',
    category: 'Nature'
  },
  { 
    id: 'jungle', 
    name: 'Tropical Jungle', 
    url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
    category: 'Nature'
  },
  { 
    id: 'autumn', 
    name: 'Autumn Forest', 
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    category: 'Nature'
  },
  
  // Mountains & Hills (4 options)
  { 
    id: 'mountains', 
    name: 'Mountain Vista', 
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    category: 'Mountains'
  },
  { 
    id: 'snow-mountains', 
    name: 'Snow Mountains', 
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    category: 'Mountains'
  },
  { 
    id: 'alpine', 
    name: 'Alpine Meadow', 
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    category: 'Mountains'
  },
  { 
    id: 'himalaya', 
    name: 'Himalayan Peak', 
    url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80',
    category: 'Mountains'
  },
  
  // Ocean & Water (5 options)
  { 
    id: 'ocean', 
    name: 'Ocean Waves', 
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80',
    category: 'Water'
  },
  { 
    id: 'tropical', 
    name: 'Tropical Beach', 
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    category: 'Water'
  },
  { 
    id: 'waterfall', 
    name: 'Waterfall Oasis', 
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&q=80',
    category: 'Water'
  },
  { 
    id: 'lake', 
    name: 'Calm Lake', 
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80',
    category: 'Water'
  },
  { 
    id: 'river', 
    name: 'Mountain River', 
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80',
    category: 'Water'
  },
  
  // Flowers & Gardens (5 options)
  { 
    id: 'flower', 
    name: 'Cherry Blossom', 
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80',
    category: 'Flowers'
  },
  { 
    id: 'sakura', 
    name: 'Japanese Sakura', 
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    category: 'Flowers'
  },
  { 
    id: 'lavender', 
    name: 'Lavender Fields', 
    url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=80',
    category: 'Flowers'
  },
  { 
    id: 'tulips', 
    name: 'Tulip Garden', 
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    category: 'Flowers'
  },
  { 
    id: 'wildflowers', 
    name: 'Wild Flowers', 
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    category: 'Flowers'
  },
  
  // Sky & Space (4 options)
  { 
    id: 'starry', 
    name: 'Starry Night Sky', 
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    category: 'Sky'
  },
  { 
    id: 'sunset', 
    name: 'Golden Sunset', 
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80',
    category: 'Sky'
  },
  { 
    id: 'aurora', 
    name: 'Northern Lights', 
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
    category: 'Sky'
  },
  { 
    id: 'clouds', 
    name: 'Dreamy Clouds', 
    url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400&q=80',
    category: 'Sky'
  },
  
  // Abstract & Minimal (3 options)
  { 
    id: 'gradient', 
    name: 'Pastel Gradient', 
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'Abstract',
    isGradient: true
  },
  { 
    id: 'zen', 
    name: 'Zen Stones', 
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80',
    preview: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    category: 'Abstract'
  },
  { 
    id: 'minimalist', 
    name: 'Minimal White', 
    url: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    preview: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    category: 'Abstract',
    isGradient: true
  },
  
  // Custom option
  { 
    id: 'custom', 
    name: '✨ Upload Custom', 
    url: '',
    preview: '',
    category: 'Custom',
    isCustom: true
  }
]

export default function BackgroundSettings({ show, onClose }) {
  const [selectedBg, setSelectedBg] = useState('nature')
  const [blurIntensity, setBlurIntensity] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [customImageUrl, setCustomImageUrl] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('app-background')
    if (saved) {
      const config = JSON.parse(saved)
      setSelectedBg(config.id || 'nature')
      setBlurIntensity(config.blur || 0)
      setBrightness(config.brightness || 100)
    }
  }, [])

  const handleCustomUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        setCustomImageUrl(imageUrl)
        applyBackground('custom', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyBackground = (bgId, customUrl = null) => {
    const bg = backgroundOptions.find(b => b.id === bgId)
    if (bg) {
      const imageUrl = bgId === 'custom' && customUrl ? customUrl : bg.url
      const config = {
        id: bgId,
        url: imageUrl,
        blur: blurIntensity,
        brightness: brightness
      }
      localStorage.setItem('app-background', JSON.stringify(config))
      setSelectedBg(bgId)
      
      // Apply immediately to body
      if (bg.isGradient || imageUrl.startsWith('linear-gradient')) {
        document.body.style.backgroundImage = imageUrl
      } else {
        document.body.style.backgroundImage = `url(${imageUrl})`
      }
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.filter = `blur(${blurIntensity}px) brightness(${brightness}%)`
    }
  }

  const categories = ['All', 'Nature', 'Mountains', 'Water', 'Flowers', 'Sky', 'Abstract', 'Custom']
  
  const filteredBackgrounds = selectedCategory === 'All' 
    ? backgroundOptions 
    : backgroundOptions.filter(bg => bg.category === selectedCategory)

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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

        {/* Category Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px', 
          flexWrap: 'wrap',
          padding: '12px',
          background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
          borderRadius: '16px',
          boxShadow: 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                color: selectedCategory === cat ? 'white' : '#4a5568',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === cat 
                  ? 'inset 4px 4px 8px rgba(0,0,0,0.2)'
                  : '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.boxShadow = 'inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff'
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.boxShadow = '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Custom Upload Section */}
        {selectedCategory === 'Custom' && (
          <div style={{
            marginBottom: '24px',
            padding: '24px',
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            borderRadius: '16px',
            boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
            border: '2px dashed #667eea'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '16px' }}>
              ✨ Upload Your Custom Background
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomUpload}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
              Supported formats: JPG, PNG, WEBP (Max 5MB recommended)
            </p>
          </div>
        )}

        {/* Background Options Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {filteredBackgrounds.map(bg => (
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
              {bg.isCustom ? (
                // Custom upload button
                <div style={{
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '48px'
                }}>
                  📤
                </div>
              ) : (
                // Regular background preview
                <div style={{ 
                  height: '180px', 
                  background: bg.isGradient ? bg.preview : `url(${bg.preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              )}
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
