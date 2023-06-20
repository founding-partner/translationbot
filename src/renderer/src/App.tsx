import { useEffect, useState } from 'react'
import { DashBoard } from './components/DashBoard'
import { LoginWithGithub } from './components/LoginWithGithub'

function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    // @ts-ignore (define in dts)
    window?.api?.handleAuth((event: string, value: string) => {
      setToken(value)
    })
  }, [])

  const handleLogin = (): void => {
    window.api.publishCommands('login')
  }

  return (
    <div className="p-2">
      {token === null && <LoginWithGithub handleLogin={handleLogin} />}
      {token !== null && <DashBoard token={token} />}
    </div>
  )
}

export default App
