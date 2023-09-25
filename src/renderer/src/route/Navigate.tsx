import { PropsWithChildren } from 'react'
import { useHistoryContext } from './Provider'
import { Button } from '@renderer/components/ui/button'

function Navigate({
  direction,
  children
}: PropsWithChildren<{ direction: 'back' | 'forward' | number }>): JSX.Element {
  const history = useHistoryContext()
  const onRouteNavigation = (): void => {
    switch (direction) {
      case 'back':
        history.back()
        break
      case 'forward':
        history.forward()
        break

      default:
        history.go(direction)
    }
  }

  return <Button onClick={onRouteNavigation}>{children}</Button>
}

export default Navigate
