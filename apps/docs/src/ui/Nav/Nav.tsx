import { Children, type ReactNode } from 'react'
import { memo, Animator, Animated, flicker, cx, styleFrameClipOctagon } from '@arwes/react'
import { Link, usePathname } from '@/router'
import {
  Dashboard as IconRoot,
  Page as IconDocs,
  CollageFrame as IconDemos,
  Codepen as IconPlay,
  DashboardSpeed as IconPerf
} from 'iconoir-react'

import { settings, theme } from '@/config'

type ListProps = {
  className?: string
  children: ReactNode
}

const List = (props: ListProps): JSX.Element => {
  const { className, children } = props
  return (
    <Animated as="ul" className={cx('flex flex-col w-full', className)}>
      {children}
    </Animated>
  )
}

type ItemProps = {
  /**
   * Destination. Omitted for a row that groups other rows without being a link
   * itself (a CMS documentation section), which then renders as themed text
   * instead of an anchor.
   */
  href?: string
  icon?: ReactNode
  text: ReactNode
  children?: ReactNode
  onLink?: () => void
  /**
   * Pathname to compare against, when the caller is rendered in a different
   * React root than the app shell and therefore cannot read the router state
   * (the CMS navigation island is passed the pathname by Astro).
   */
  pathname?: string
}

const Item = (props: ItemProps): JSX.Element => {
  const { href, icon, text, children, onLink, pathname: pathnameProp } = props

  const routerPathname = usePathname()
  const pathname = pathnameProp ?? routerPathname

  // Trailing slashes are ignored on both sides: the app's pathname never has one,
  // while a CMS entry's canonical URL does (`build.format: 'directory'`).
  const normalize = (value: string): string =>
    value.length > 1 ? value.replace(/\/+$/, '') : value
  const current = normalize(pathname)
  const target = href ? normalize(href) : ''
  const matches =
    !!href && (current === target || (target !== '/' && current.startsWith(`${target}/`)))
  const active = !!href && current === target

  const content = (
    <div
      className={cx(
        'flex-1 flex flex-row items-center gap-2 px-4 py-2',
        active && 'bg-secondary-main-3/[0.05]'
      )}
      style={{
        clipPath: styleFrameClipOctagon({
          leftTop: false,
          leftBottom: false,
          squareSize: theme.space(2)
        })
      }}
    >
      {icon}
      {text}
    </div>
  )

  const linkClassName = cx(
    'flex font-cta text-size-9',
    'transition-all ease-out duration-200',
    !href && 'text-primary-main-3',
    matches && 'text-secondary-main-4 hover:text-secondary-high-2',
    !!href && !matches && 'text-primary-main-4 hover:text-primary-high-2'
  )

  return (
    <li className="flex flex-col">
      <Animator>
        <Animated
          animated={flicker()}
          onTransition={(element, node) => {
            if (active && node.state === 'entered') {
              requestAnimationFrame(() => {
                element.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth'
                })
              })
            }
          }}
        >
          {href ? (
            <Link className={linkClassName} href={href} onClick={onLink}>
              {content}
            </Link>
          ) : (
            <div className={linkClassName}>{content}</div>
          )}
        </Animated>
      </Animator>

      {!!Children.count(children) && (
        <div className="flex pl-4">
          <List className="flex border-l border-dashed border-primary-main-9/50">{children}</List>
        </div>
      )}
    </li>
  )
}

type NavSectionProps = {
  onLink?: () => void
}

const NavRoot = (props: NavSectionProps): JSX.Element => {
  const { onLink } = props
  return (
    <Item href="/" icon={<IconRoot />} text="Root" onLink={onLink}>
      <Item href="/docs" icon={<IconDocs />} text="Docs" onLink={onLink} />
      <Item href="/demos" icon={<IconDemos />} text="Demos" onLink={onLink} />
      {/* The Playground and Performance apps are separate deployments. Without a
          URL there is nothing to link to, so the row is omitted instead of
          pointing at a path this site does not serve. */}
      {settings.apps.play.url && (
        <Item href={settings.apps.play.url} icon={<IconPlay />} text="Play" onLink={onLink} />
      )}
      {settings.apps.perf.url && (
        <Item href={settings.apps.perf.url} icon={<IconPerf />} text="Perf" onLink={onLink} />
      )}
    </Item>
  )
}

type NavProps = {
  className?: string
  onLink?: () => void
}

const Nav = memo((props: NavProps): JSX.Element => {
  const { className, onLink } = props

  return (
    <Animator combine manager="stagger" duration={{ stagger: 0.015 }}>
      <List className={className}>
        <NavRoot onLink={onLink} />
      </List>
    </Animator>
  )
})

export { Nav }
// The row and list are exported so CMS-managed navigation (see CmsDocsNav) is
// rendered with exactly the same theme colours, octagon clip and nesting as the
// static app navigation, instead of a second, plainer style.
export { Item as NavItem, List as NavList }
