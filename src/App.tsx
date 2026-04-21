import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter basename="/cinescope-vod-sdd/">
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App