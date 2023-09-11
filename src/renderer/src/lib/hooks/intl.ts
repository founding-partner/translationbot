import { useCallback, useContext, useEffect, useState } from 'react'
import {
  IntlContentContext,
  IntlContentType,
  IntlDispatchContext,
  IntlLangListType
} from '../contexts/IntlContext'

export const useIntlDispatch = (): React.Dispatch<unknown> | null => {
  return useContext(IntlDispatchContext)
}

export const useIntlContent = (): IntlContentType => {
  return useContext(IntlContentContext)
}

export const useSelectedLanaguage = (): string => {
  const data = useIntlContent()
  return data.langSelected
}

export const useLanguageCount = (): number => {
  const data = useIntlContent()
  return data.langCount
}

export const useLanguageList = (): IntlLangListType => {
  const data = useIntlContent()
  return data.langList
}

export const useChangeLanguage = (): Array<string | ((selectedLanaguage: string) => void)> => {
  const data = useIntlContent()
  const dispatch = useIntlDispatch()
  const [language, setLanguage] = useState(data.langSelected)

  const changeLanguage = (selectedLanaguage: string): void => {
    dispatch !== null &&
      dispatch({
        type: 'change-language',
        payload: {
          language: selectedLanaguage
        }
      })
  }

  useEffect(() => {
    setLanguage(data.langSelected)
  }, [data])

  return [language, changeLanguage]
}

export const usePageIntlContent = (pageName: string): Array<unknown | Promise<void>> => {
  const [pageContent, setPageContent] = useState({})
  const dispatch = useIntlDispatch()
  const data = useIntlContent()
  const selectedLanguage = useSelectedLanaguage()

  useEffect(() => {
    dispatch !== null &&
      dispatch({
        type: 'load-page-content',
        payload: {
          pageName
        }
      })
  }, [pageName, selectedLanguage])

  const loadPageContent = useCallback(
    () =>
      (async (): Promise<void> => {
        if (Object.keys(data.content).includes(pageName)) {
          const loadUpdatedContent =
            data.content[pageName] !== null
              ? data.content[pageName]
              : async (): Promise<object> => ({})
          setPageContent(await loadUpdatedContent())
        }
      })(),
    [pageName, data]
  )

  return [pageContent, loadPageContent]
}
