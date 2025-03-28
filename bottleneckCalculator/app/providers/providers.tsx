'use client'

import { ThemeProvider } from './theme-provider'
import { useRouter } from 'next/navigation'
import { RouterProvider } from 'react-aria-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  
  // Create a client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider navigate={router.push}>
          <ThemeProvider 
          enableSystem 
          attribute="class"
          defaultTheme="system">
            {children}
          </ThemeProvider>
        </RouterProvider>
      </QueryClientProvider>
    </Provider>
  )
}
