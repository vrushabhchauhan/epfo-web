import './PlaceholderPage.css'

function PlaceholderPage({ title, publicPage = false }) {
  return (
    <main className={publicPage ? 'placeholder-page placeholder-page--public' : 'placeholder-page'}>
      <h1>{title}</h1>
    </main>
  )
}

export default PlaceholderPage
