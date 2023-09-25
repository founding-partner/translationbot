import { useEffect, useState } from 'react'
// import DashBoard from './components/DashBoard'
// import { LoginWithGithub } from './components/LoginWithGithub'
// import Languages from './components/Languages/component'
// import { Button } from './components/ui/button'
import WelcomePage from './page/Welcome/page'
import IntlProvider from './lib/contexts/IntlContext'
import Background from './components/Background'
import './App.scss'
import RouteGroup from './route/Group'
import Route from './route/Route'
import RouteProvider from './route/Provider'
import ChooseFrameworkPage from './page/Framework/Choose/page'

function App(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    // @ts-ignore (define in dts)
    window?.api?.handleAuth((event: string, value: string) => {
      setToken(value)
    })
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = (): void => {
    window.api.publishCommands('login')
  }

  return (
    <IntlProvider>
      <Background></Background>
      <RouteProvider>
        <RouteGroup className="w-[100vw] h-[100vh] absolute left-0 top-0">
          <Route path="/">
            <WelcomePage />
          </Route>
          <Route path="/choose/framework">
            <ChooseFrameworkPage />
          </Route>
        </RouteGroup>
      </RouteProvider>
      {/* <Button size='lg'>Login</Button>
      <Languages />
      {token === null && <LoginWithGithub handleLogin={handleLogin} />}
      {token !== null && <DashBoard token={token} />} */}
    </IntlProvider>
  )
}

export default App
