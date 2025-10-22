import React from 'react'
import packageJson from '../package.json'

const Layout = ({ children, title = 'ProdyJEE', showBackButton = true, backHref = '/dashboard' }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '16px 32px'
      }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {showBackButton && (
              <>
                <a href={backHref} style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.2s'
                }}>
                  ← Back
                </a>
                <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.3)', height: '24px' }}></div>
              </>
            )}
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {title}
            </h1>
          </div>
          <span style={{ fontSize: '13px', color: 'white', opacity: 0.7 }}>
            v{packageJson.version}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout