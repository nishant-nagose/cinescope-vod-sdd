export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const handleApiError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new APIError('Network error. Please check your internet connection.', undefined, error as Error)
  }

  if (error instanceof Error) {
    return new APIError(error.message, undefined, error)
  }

  return new APIError('An unexpected error occurred', undefined, error as Error)
}

export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new APIError(`Request timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId))
  })
}

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}