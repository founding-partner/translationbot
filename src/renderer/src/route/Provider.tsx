import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { MemoryHistory, createMemoryHistory } from 'history'

const initialRoute = '/'
const history = createMemoryHistory({
  initialEntries: [initialRoute]
})
const HistoryContext = createContext(history)
const RouteContext = createContext([initialRoute])

export function useHistoryContext(): MemoryHistory {
  return useContext(HistoryContext)
}

export function useRouteContext(): string[] {
  return useContext(RouteContext)
}

export function RouteProvider({ children }: PropsWithChildren): JSX.Element {
  const [currentRoute, setCurrentRoute] = useState(initialRoute)
  useEffect(() => {
    history.listen((update) => {
      console.log('route update', update)
      setCurrentRoute(update.location.pathname)
    })
  }, [])

  return (
    <HistoryContext.Provider value={history}>
      <RouteContext.Provider value={[currentRoute]}>{children}</RouteContext.Provider>
    </HistoryContext.Provider>
  )
}

export default RouteProvider
