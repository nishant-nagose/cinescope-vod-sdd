import { ReactNode } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TrendingPage } from './pages/TrendingPage'
import { TopRatedPage } from './pages/TopRatedPage'
import { SearchPage } from './pages/SearchPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { ShowDetailPage } from './pages/ShowDetailPage'
import { ScrollToTop } from './components/ScrollToTop'

const NotFoundPage = () => (
  <div className="text-center py-20 text-white text-xl">404 - Page Not Found</div>
)

const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const navType = useNavigationType()

  const isDetail = /^\/(movie|show)\/\d+/.test(location.pathname)
  let cls = 'page-enter-fade'
  if (isDetail) cls = 'page-enter-right'
  else if (navType === 'POP') cls = 'page-enter-left'

  // key change forces React to unmount/remount the div → CSS animation re-fires
  return (
    <div key={location.key} className={cls}>
      {children}
    </div>
  )
}

export const AppRoutes = () => (
  <Layout>
    <ScrollToTop />
    <PageTransition>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/top-rated" element={<TopRatedPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/show/:id" element={<ShowDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageTransition>
  </Layout>
)
