import { registryUrl, fetchFromRegistry, parseRegistryLanguages } from './index.js'

describe('registryUrl', () => {
  const url = new URL('https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry')

  it('returns the registry url', () => {
    expect(registryUrl).toBeInstanceOf(URL)
    expect(registryUrl).toStrictEqual(url)
  })
})

describe('fetchFromRegistry', () => {
  it('should return a promise', () => {
    process.env.npm_config_user_agent = 'jest'
    expect(fetchFromRegistry(registryUrl)).toBeInstanceOf(Promise)
  })

  it('should return a promise that resolves to a string', async () => {
    const result = await fetchFromRegistry(registryUrl)
    expect(typeof result).toBe('string')
  })
})

describe('parseRegistryLanguages', () => {
  const mock = `File-Date: 2021-08-06
%%
Type: language
Subtag: aa
Description: Afar
Added: 2005-10-16
%%
Type: language
Subtag: ab
Description: Abkhazian
Added: 2005-10-16
Suppress-Script: Cyrl
%%
Type: language
Subtag: jw
Description: Javanese
Added: 2005-10-16
Deprecated: 2001-08-13
Preferred-Value: jv
Comments: published by error in Table 1 of ISO 639:1988
%%
Type: language
Subtag: li
Description: Limburgan
Description: Limburger
Description: Limburgish
Added: 2005-10-16`

  it('should return an array', () => {
    expect(parseRegistryLanguages(mock)).toBeInstanceOf(Array)
  })

  it('should return an array of objects', () => {
    const results = parseRegistryLanguages(mock)
    results.forEach((result) => expect(result).toBeInstanceOf(Object))
  })

  it('should return an array of objects with the correct keys', () => {
    const keys = ['fileDate', 'type', 'subtag', 'description', 'added']

    const results = parseRegistryLanguages(mock)
    expect(results.shift()).toHaveProperty(keys.shift())

    results.forEach((result) => {
      keys.forEach(key => expect(result).toHaveProperty(key))
    })
  })

  it('should return an array of objects with the correct values', () => {
    const languageMock = `Type: language
Subtag: li
Duplicate: Yes
Duplicate: Yes
Duplicate: Yes
Description: Limburgan
Description: Limburgan
Description: Limburger
Description: Limburger
Description: Limburgish
Added: 2005-10-16`

    const results = parseRegistryLanguages(languageMock)
    const result = results.pop()
    const description = Array.from(['Limburgan', 'Limburger', 'Limburgish'])

    console.log(result)

    expect(result.description).toBeInstanceOf(Array)
    expect(result.description).toStrictEqual(description)
    expect(result.duplicate).toStrictEqual('Yes')

    description.forEach((value) => {
      expect(result.description).toContain(value)
    })
  })
})
