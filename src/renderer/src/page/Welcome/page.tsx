import { Separator } from '@renderer/components/ui/separator'
import './page.scss'
import { useChangeLanguage, useLanguageList, usePageIntlContent } from '@renderer/lib/hooks/intl'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { langKeyValuePair } from '@renderer/lib/contexts/IntlContext'
import LogoImage from '@renderer/components/LogoImage'
import Link from '@renderer/route/Link'

export const WelcomeHeader = (): JSX.Element => {
  const langList = useLanguageList()
  const [language, changeLanguage] = useChangeLanguage()

  useEffect(() => {
    console.log(`selected language: ${language}`)
  }, [language])

  const handleLanguageChange = (value: unknown): void => {
    console.log(`language to change to: ${value}`)
    changeLanguage(value)
  }

  return (
    <>
      <header className="p-4 flex justify-center content-center items-center">
        <div className="flex-1"></div>
        <div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" aria-label={language}>
                {langKeyValuePair[language]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {langList
                .filter((value) => ['en', 'ta'].includes(value.code))
                .map((value) => (
                  <SelectItem key={value.code} value={value.code}>
                    {value.lang_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <Separator />
    </>
  )
}

const highLightRCMTitle = (title = '', rcmLabel = ''): JSX.Element[] => {
  const spliter = '@!!@'
  return title
    .replace(rcmLabel, `${spliter}${rcmLabel}${spliter}`)
    .split(spliter)
    .map((v, i) => {
      return v === rcmLabel ? (
        <span key={`v-${v}-${i}`} className="text-white shadow-md">
          {v}
        </span>
      ) : (
        <span key={`v-${v}-${i}`}>{v}</span>
      )
    })
}

const WelcomePage = (): JSX.Element => {
  const [content, loadcontent] = usePageIntlContent('welcome')

  useEffect(() => {
    loadcontent()
  }, [loadcontent])

  return (
    <>
      <WelcomeHeader />
      <div className="w-2/5 mt-16 mx-[auto]">
        <LogoImage />
      </div>
      <div className="font-bold text-2xl text-center mb-4 mt-16">
        {highLightRCMTitle(content?.welcomeToTranslationTeam, content?.rcm)}
      </div>
      <div className="text-center mt-8">
        <Link to="/choose/framework">continue</Link>
      </div>
    </>
  )
}

export default WelcomePage
