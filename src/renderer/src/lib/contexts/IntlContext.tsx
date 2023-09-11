import { PropsWithChildren, createContext, useReducer } from 'react'
import langData from '../../assets/languages.json'
import { loadContent } from '../lazy/content'

const { count: languagesCount, languages } = langData

export const langKeyValuePair = languages.reduce((a, c) => {
  a = { ...a, [c.code]: c.lang_name }
  return a
}, {})

export type IntlLangCodes = keyof typeof langKeyValuePair

export type IntlLangListType = Array<{ code: string; lang_name: string }>

export type IntlContentType = {
  langList: IntlLangListType
  langCount: number
  langSelected: string
  content: {
    welcome: Promise<unknown> | null
  }
}

const InitialContentValue = {
  langList: languages,
  langCount: +languagesCount,
  langSelected: 'en',
  content: {
    welcome: null
  }
}

export const IntlContentContext = createContext<IntlContentType>(InitialContentValue)

export const IntlDispatchContext = createContext<React.Dispatch<unknown> | null>(null)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const IntlReducer = (data, action) => {
  const { type, payload } = action
  let retData

  switch (type) {
    case 'change-language':
      retData = { ...data, langSelected: payload.language }
      break

    case 'load-page-content':
      retData = {
        ...data,
        content: {
          ...data.content,
          [payload.pageName]: async (): Promise<unknown> =>
            await loadContent(payload.pageName, data.langSelected)
        }
      }
      break

    default:
      retData = data
      break
  }

  return retData
}

export const IntlProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [intlContent, intlDispatch] = useReducer(IntlReducer, InitialContentValue)

  return (
    <IntlDispatchContext.Provider value={intlDispatch}>
      <IntlContentContext.Provider value={intlContent}>{children}</IntlContentContext.Provider>
    </IntlDispatchContext.Provider>
  )
}

export default IntlProvider
