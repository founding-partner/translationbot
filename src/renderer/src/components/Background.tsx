const Background = ({ children }: React.PropsWithChildren): JSX.Element => {
  return (
    <div className="welcome-bg w-[100vw] h-[100vh] flex absolute left-0 top-0">
      <div className="w-2/5 m-[auto]">{children}</div>
    </div>
  )
}

export default Background
