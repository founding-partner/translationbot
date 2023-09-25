import {
  Children,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  memo,
  useEffect,
  useState
} from 'react'
import { useRouteContext } from './Provider'

let i = 0

function RouteGroup({
  className = 'w-[100vw] h-[100vh] absolute left-0 top-0',
  children
}: PropsWithChildren<{ className: string }>): JSX.Element {
  const [currentRoute] = useRouteContext()
  const filterMatchingRoute = (): Array<ReactNode> => {
    return Children.toArray(children).filter((child) => {
      console.log({ i: ++i })
      return (child as ReactElement).props.path === currentRoute
    })
  }
  const [matchedRoute, setMatchedRoute] = useState([] as Array<ReactNode>)

  useEffect(() => {
    console.log({ currentRoute })
    setMatchedRoute(filterMatchingRoute())
  }, [currentRoute])

  return <main className={className}>{matchedRoute}</main>
}

export default memo(RouteGroup)
