export const loadWelcomeContent = async (langCode: string): Promise<unknown> => {
  const enContent = await import('../../assets/intl/en/welcome.json')
  const taContent = await import('../../assets/intl/ta/welcome.json')

  return returnChoosenLanguageContent(langCode, taContent, enContent)
}

export const loadChooseFrameworkContent = async (langCode: string): Promise<unknown> => {
  const enContent = await import('../../assets/intl/en/choose-framework.json')
  const taContent = await import('../../assets/intl/ta/choose-framework.json')

  return returnChoosenLanguageContent(langCode, taContent, enContent)
}

export const loadContent = async (pageName: string, langCode: string): Promise<unknown> => {
  let content

  switch (pageName) {
    case 'welcome':
      content = await loadWelcomeContent(langCode)
      break

    case 'choose-framework':
      content = await loadChooseFrameworkContent(langCode)
      break

    default:
      throw new Error('Selected Page is not available')
      break
  }

  return content
}
function returnChoosenLanguageContent(
  langCode: string,
  taContent: unknown,
  enContent: unknown
): unknown {
  let content

  switch (langCode) {
    case 'ta':
      content = taContent
      break

    case 'en':
    default:
      content = enContent
      break
  }
  return content
}
