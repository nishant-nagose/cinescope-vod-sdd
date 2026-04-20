import { useState, useEffect, useCallback } from 'react'
import { apiCache } from '../services/cache'
import { handleApiError, withTimeout, retryWithBackoff } from '../services/errorHandling'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  cacheKey?: string
  timeout?: number
  retries?: number
  enabled?: boolean
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => void } {
  const {
    cacheKey,
    timeout = 10000,
    retries = 2,
    enabled = true
  } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const executeApiCall = useCallback(async () => {
    if (!enabled) return

    // Check cache first
    if (cacheKey) {
      const cachedData = apiCache.get(cacheKey) as T | null
      if (cachedData !== null) {
        setState({ data: cachedData, loading: false, error: null })
        return
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await retryWithBackoff(
        () => withTimeout(apiCall(), timeout),
        retries
      )

      // Cache the result
      if (cacheKey) {
        apiCache.set(cacheKey, result)
      }

      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const apiError = handleApiError(error)
      setState({ data: null, loading: false, error: apiError.message })
    }
  }, [apiCall, cacheKey, timeout, retries, enabled])

  useEffect(() => {
    executeApiCall()
  }, [executeApiCall])

  return {
    ...state,
    refetch: executeApiCall
  }
}