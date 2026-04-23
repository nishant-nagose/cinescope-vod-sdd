import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { ContentFilterProvider } from './context/ContentFilterContext'
import { LaunchScreen } from './components/LaunchScreen'

function App() {
  const [launched, setLaunched] = useState(
    () => sessionStorage.getItem('cinescope_launched') !== null
  )

  if (!launched) {
    return (
      <LaunchScreen
        onComplete={() => {
          sessionStorage.setItem('cinescope_launched', '1')
          setLaunched(true)
        }}
      />
    )
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
