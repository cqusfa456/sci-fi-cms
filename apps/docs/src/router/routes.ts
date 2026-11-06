import { settings } from '@/config/settings'

// All the routes of the app. Used by the Astro static generation and by
// the client-side router to know which paths are internal.
const routes = ['/', '/demos'] as const

type Route = (typeof routes)[number]

const isRoute = (pathname: string): pathname is Route =>
  (routes as readonly string[]).includes(pathname)

// Page titles per route. Used by the Astro pages for the HTML `<title>`
// and by the client-side router to update it on navigation.
const titles: Record<Route, string> = {
  '/': settings.title,
  '/demos': `Demos | ${settings.title}`
}

const getTitle = (pathname: string): string =>
  isRoute(pathname) ? titles[pathname] : `Not Found | ${settings.title}`

export { routes, isRoute, getTitle }
export type { Route }
