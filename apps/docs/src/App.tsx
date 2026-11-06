'use client'

import { useEffect } from 'react'

import { usePathname } from '@/router'
import { getTitle } from '@/router/routes'

import { PageHome } from '@/app/PageHome'
import { PageDemos } from '@/app/demos/PageDemos'
import NotFound from '@/app/NotFound'

// The app root component. It renders the page component matching the
// current pathname. It is rendered inside the LayoutRoot which provides
// the ARWES animators, bleeps, and the global UI (header, background).
const App = (): JSX.Element => {
  const pathname = usePathname()

  // Update the document title on navigation.
  useEffect(() => {
    document.title = getTitle(pathname)
  }, [pathname])

  let content: JSX.Element

  if (pathname === '/') {
    content = <PageHome />
  } else if (pathname === '/demos') {
    content = <PageDemos />
  } else {
    content = <NotFound />
  }

  return content
}

export { App }
