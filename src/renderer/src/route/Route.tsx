import { PropsWithChildren } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Route({ path, children }: PropsWithChildren<{ path: string }>): JSX.Element {
  return <article>{children}</article>
}

export default Route
