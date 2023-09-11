import data from './data.json'

/**
 * List of Language widely supported in context with Translation
 * Ref - https://www.loc.gov/standards/iso639-2/php/code_list.php
 *
 * @returns JSX.Element
 */
const Languages = (): JSX.Element => {
  return (
    <div>
      Languages you have selected to contribute to: {data.count}
      <div>
        {data.languages.map(
          ({ code, lang_name }): JSX.Element => (
            <div key={code} className="text-center min-h-[6rem]">
              {lang_name}
            </div>
          )
        )}
      </div>
      No of Languages supported: {data.count}
      <div>
        {data.languages.map(
          ({ code, lang_name }): JSX.Element => (
            <div key={code} className="text-center min-h-[6rem]">
              {lang_name}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Languages
