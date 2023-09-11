export const loadWelcomeContent = async (langCode: string): Promise<unknown> => {
  let content

  const enContent = await import('../../assets/intl/en/welcome.json')
  const taContent = await import('../../assets/intl/ta/welcome.json')

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

export const loadContent = async (pageName: string, langCode: string): Promise<unknown> => {
  let content

  switch (pageName) {
    case 'welcome':
      content = await loadWelcomeContent(langCode)
      break

    default:
      throw new Error('Selected Page is not available')
      break
  }

  return content
}
