import './page.scss'
import { usePageIntlContent } from '@renderer/lib/hooks/intl'
import { useEffect } from 'react'

const ChooseFramework = (): JSX.Element => {
  const [content, loadcontent] = usePageIntlContent('choose-framework')

  useEffect(() => {
    loadcontent()
  }, [loadcontent])

  return (
    <>
      <div className="font-bold text-2xl text-center mb-4 mt-16">{content?.chooseFramework}</div>
      <div className="text-center mt-8"></div>
    </>
  )
}

export default ChooseFramework
