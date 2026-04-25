import { memo } from 'react'
import { useInfiniteMovies } from '../hooks/useInfiniteMovies'
import { useInfiniteShows } from '../hooks/useInfiniteShows'
import { MovieCarousel } from './MovieCarousel'
import { ShowCarousel } from './ShowCarousel'
import type { MovieCarouselConfig, ShowCarouselConfig } from '../config/carouselPool'

const MovieWrapper = memo(({ config }: { config: MovieCarouselConfig }) => {
  const { movies, loading, error, refetch, hasMore, fetchMore } = useInfiniteMovies(
    config.fetch,
    { cacheKeyPrefix: config.id }
  )
  return (
    <MovieCarousel
      title={config.title}
      movies={movies}
      loading={loading}
      error={error}
      onRetry={refetch}
      singleRow
      rankDisplay={config.rankDisplay}
      maxItems={config.maxItems}
      hasMore={config.rankDisplay ? false : hasMore}
      onLoadMore={config.rankDisplay ? undefined : fetchMore}
    />
  )
})

const ShowWrapper = memo(({ config }: { config: ShowCarouselConfig }) => {
  const { shows, loading, error, refetch, hasMore, loadMore } = useInfiniteShows(
    config.fetch,
    { cacheKeyPrefix: config.id }
  )
  return (
    <ShowCarousel
      title={config.title}
      shows={shows}
      loading={loading}
      error={error}
      onRetry={refetch}
      rankDisplay={config.rankDisplay}
      maxItems={config.maxItems}
      hasMore={config.rankDisplay ? false : hasMore}
      onLoadMore={config.rankDisplay ? undefined : loadMore}
    />
  )
})

export const DynamicCarousel = memo(({ config }: { config: MovieCarouselConfig | ShowCarouselConfig }) => {
  if (config.type === 'movies') return <MovieWrapper config={config} />
  return <ShowWrapper config={config} />
})
