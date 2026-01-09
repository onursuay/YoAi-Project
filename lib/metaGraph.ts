const META_BASE_URL = "https://graph.facebook.com/v20.0"

interface MetaGraphFetchOptions extends RequestInit {
  params?: Record<string, string>
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function jitter(base: number): number {
  return base + Math.random() * base * 0.1
}

export async function metaGraphFetch(
  path: string,
  accessToken: string,
  options: MetaGraphFetchOptions = {}
): Promise<Response> {
  const { params, ...fetchOptions } = options

  let url = `${META_BASE_URL}${path}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const headers = new Headers(fetchOptions.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)
  headers.set("Content-Type", "application/json")

  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      // Retry on 429 (rate limit) or 5xx (server errors)
      if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
        if (attempt < maxRetries - 1) {
          const retryAfter = response.headers.get("Retry-After")
          const waitTime = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : jitter(Math.pow(2, attempt) * 1000)
          await sleep(waitTime)
          continue
        }
      }

      return response
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries - 1) {
        await sleep(jitter(Math.pow(2, attempt) * 1000))
        continue
      }
    }
  }

  throw lastError || new Error("Request failed after retries")
}

export interface MetaGraphError {
  error: string
  details?: any
}

export async function metaGraphFetchJSON<T = any>(
  path: string,
  accessToken: string,
  options: MetaGraphFetchOptions = {}
): Promise<{ data: T; error?: MetaGraphError }> {
  try {
    const response = await metaGraphFetch(path, accessToken, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null as any,
        error: {
          error: "meta_api_error",
          details: errorData.error || { message: `HTTP ${response.status}` },
        },
      }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    return {
      data: null as any,
      error: {
        error: "request_failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}
