import { usePathname } from '@/router'

import { Breadcrumbs, type BreadcrumbsProps } from '../Breadcrumbs'
import { memo } from '@arwes/react'

type NavPathProps = Omit<BreadcrumbsProps, 'items'>

const paths: Record<string, string> = {
  '/': 'Root',
  '/docs': 'Docs',
  '/demos': 'Demos'
}

const NavPath = memo((props: NavPathProps): JSX.Element => {
  const pathname = usePathname()

  const fragments = pathname.split('/').filter(Boolean)

  let pathKey = ''

  const items = fragments
    .map((fragment, index) => {
      if (index === fragments.length - 1) {
        return null
      }

      pathKey = `${pathKey}/${fragment}`
      const pathValue = paths[pathKey]

      if (pathValue) {
        return { href: pathKey, text: pathValue }
      }

      return null
    })
    .filter(Boolean) as BreadcrumbsProps['items']

  return <Breadcrumbs {...props} items={items} />
})

export { NavPath }
