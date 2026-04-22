import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TrendingPage } from './pages/TrendingPage'
import { TopRatedPage } from './pages/TopRatedPage'
import { SearchPage } from './pages/SearchPage'
import { MovieDetailPage } from './pages/MovieDetailPage'

const NotFoundPage = () => <div className="text-center py-20 text-white text-xl">404 - Page Not Found</div>

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TrendingPage />} />
        <Route path="/top-rated" element={<TopRatedPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
