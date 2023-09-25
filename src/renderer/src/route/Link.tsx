import { MouseEventHandler, PropsWithChildren } from 'react'
import { useHistoryContext } from './Provider'
import { Button } from '@renderer/components/ui/button'

function Link({ to, children }: PropsWithChildren<{ to: string }>): JSX.Element {
  const history = useHistoryContext()
  const href = history.createHref(to)

  const handleOnClick = (event): void => {
    event.preventDefault()
    console.log(href)
    history.push(href, {})
  }

  return (
    <Button variant={'outline'} size={'lg'} asChild>
      <a href={href} onClick={handleOnClick as MouseEventHandler}>
        {children}
      </a>
    </Button>
  )
}

export default Link
