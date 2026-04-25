import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { ContentFilterProvider } from './context/ContentFilterContext'
import { LaunchScreen } from './components/LaunchScreen'

function App() {
  // false = show launch screen on every hard page load / refresh
  const [launched, setLaunched] = useState(false)

  if (!launched) {
    return <LaunchScreen onComplete={() => setLaunched(true)} />
  }

  return (
    <ContentFilterProvider>
      <BrowserRouter basename="/cinescope-vod-sdd/">
        <AppRoutes />
      </BrowserRouter>
    </ContentFilterProvider>
  )
}

export default App
