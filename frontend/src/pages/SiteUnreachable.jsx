import { useEffect } from 'react'

// Full-screen copy of Chrome's "This site can't be reached" error page.
// Rendered on its own (no navbar/footer) when the admin switches it on for logged-in users.
const SiteUnreachable = () => {
  const host = window.location.hostname

  useEffect(() => {
    const previousTitle = document.title
    const previousBackground = document.body.style.background
    document.title = host
    document.body.style.background = '#fff'
    window.scrollTo(0, 0)

    // Drop the site favicons so the tab shows the browser's default icon, like a real error page.
    // The empty data: icon stops the browser falling back to /favicon.ico.
    // index.html does the same switch-off before React loads when the block is cached.
    document.querySelectorAll('link[rel~="icon"]:not(#rk-blank-icon), link[rel="apple-touch-icon"]').forEach((link) => {
      link.setAttribute('data-rk-rel', link.getAttribute('rel'))
      link.setAttribute('rel', 'rk-icon-off')
    })
    if (!document.getElementById('rk-blank-icon')) {
      const blankIcon = document.createElement('link')
      blankIcon.id = 'rk-blank-icon'
      blankIcon.rel = 'icon'
      blankIcon.href = 'data:,'
      document.head.appendChild(blankIcon)
    }

    return () => {
      document.title = previousTitle
      document.body.style.background = previousBackground
      document.getElementById('rk-blank-icon')?.remove()
      document.querySelectorAll('link[data-rk-rel]').forEach((link) => {
        link.setAttribute('rel', link.getAttribute('data-rk-rel'))
        link.removeAttribute('data-rk-rel')
      })
    }
  }, [host])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
        background: '#fff',
        color: '#5f6368',
        fontFamily: "'Segoe UI', Tahoma, system-ui, sans-serif",
        fontSize: '15px',
        lineHeight: 1.6
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          maxWidth: '600px',
          width: 'calc(100% - 48px)',
          margin: '14vh auto 0',
          paddingBottom: '40px'
        }}
      >
        {/* Sad page icon */}
        <svg width='48' height='56' viewBox='0 0 24 28' shapeRendering='crispEdges' aria-hidden='true' style={{ display: 'block', marginBottom: '40px' }}>
          <g fill='#5f6368'>
            <rect x='0' y='0' width='15' height='2' />
            <rect x='0' y='0' width='2' height='28' />
            <rect x='0' y='26' width='24' height='2' />
            <rect x='22' y='9' width='2' height='19' />
            <rect x='13' y='0' width='2' height='10' />
            <rect x='13' y='8' width='11' height='2' />
            <rect x='15' y='2' width='2' height='2' />
            <rect x='17' y='4' width='2' height='2' />
            <rect x='19' y='6' width='2' height='2' />
            <rect x='6' y='9' width='2' height='4' />
            <rect x='8' y='18' width='8' height='2' />
            <rect x='6' y='20' width='2' height='2' />
            <rect x='16' y='20' width='2' height='2' />
          </g>
        </svg>

        <h1 style={{ margin: '0 0 16px', color: '#202124', fontSize: '24px', fontWeight: 600, lineHeight: 1.25 }}>
          This site can&rsquo;t be reached
        </h1>
        <p style={{ margin: '0 0 16px' }}>Check if there is a typo in {host}.</p>
        <p style={{ margin: '0 0 16px' }}>
          If spelling is correct,{' '}
          <a href='#' onClick={(e) => e.preventDefault()} style={{ color: '#1a73e8', textDecoration: 'none' }}>
            try running Windows Network Diagnostics
          </a>
          .
        </p>
        <div style={{ color: '#5f6368', fontSize: '12px', textTransform: 'uppercase' }}>DNS_PROBE_FINISHED_NXDOMAIN</div>

        <button
          type='button'
          onClick={() => window.location.reload()}
          style={{
            marginTop: '51px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '20px',
            background: '#1a73e8',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Reload
        </button>
      </div>
    </div>
  )
}

export default SiteUnreachable
