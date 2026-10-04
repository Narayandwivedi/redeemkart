import { useEffect } from 'react'

// Bare server-style 404 page (no navbar/footer).
// Rendered when the admin switches the 404 view on for the logged-in user.
const PageNotFound = () => {
  useEffect(() => {
    const previousTitle = document.title
    const previousBackground = document.body.style.background
    document.title = '404 Not Found'
    document.body.style.background = '#fff'
    window.scrollTo(0, 0)
    return () => {
      document.title = previousTitle
      document.body.style.background = previousBackground
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
        boxSizing: 'border-box',
        padding: '8px',
        background: '#fff',
        color: '#000',
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: '16px',
        textAlign: 'center'
      }}
    >
      <h1 style={{ margin: '21px 0', fontSize: '32px', fontWeight: 'bold' }}>404 Not Found</h1>
      <hr style={{ border: 0, borderTop: '1px solid #808080', margin: '8px 0' }} />
      <div>nginx</div>
    </div>
  )
}

export default PageNotFound
