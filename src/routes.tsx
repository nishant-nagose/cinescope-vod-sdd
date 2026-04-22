import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TrendingPage } from './pages/TrendingPage'
import { TopRatedPage } from './pages/TopRatedPage'
import { SearchPage } from './pages/SearchPage'

// Placeholder components - will be implemented in user stories
const MovieDetailPage = ({ id }: { id: string }) => <div>Movie Detail Page for ID: {id}</div>
const NotFoundPage = () => <div>404 - Page Not Found</div>

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TrendingPage />} />
        <Route path="/top-rated" element={<TopRatedPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage id="" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}