'use client'

import { LayoutContent } from '@/ui'

type LayoutDocsProps = {
  children?: React.ReactNode
  /** Sidebar built from the CMS documentation. */
  nav?: React.ReactNode
}

const LayoutDocs = (props: LayoutDocsProps): JSX.Element => {
  const { children, nav } = props
  return (
    <LayoutContent left={nav}>
      <article className="flex flex-col min-w-0 min-h-0 prose prose-sm lg:prose-base">
        {children}
      </article>
    </LayoutContent>
  )
}

export { LayoutDocs }
