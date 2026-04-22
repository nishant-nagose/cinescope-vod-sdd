import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { ContentFilterProvider } from './context/ContentFilterContext'

function App() {
  return (
    <ContentFilterProvider>
      <BrowserRouter basename="/cinescope-vod-sdd/">
        <AppRoutes />
      </BrowserRouter>
    </ContentFilterProvider>
  )
}

export default App