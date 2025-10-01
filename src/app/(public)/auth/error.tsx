
'use client'

import { useSearchParams } from 'next/navigation'

const ErrorPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unknown error occurred'

  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
      <a href="/login">Go back to sign-in</a>
    </div>
  )
}

export default ErrorPage