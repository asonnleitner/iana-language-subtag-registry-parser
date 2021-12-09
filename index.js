import https from 'https'

const registryUrl = new URL('https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry')

// console.log(process.argv)

const fetchFromRegistry = (url) => {
  return new Promise((resolve) => https.get(
    url,
    {
      headers: {
        'User-Agent': 'node'
      }
    },
    (res) => {
      const chunks = []
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        resolve(Buffer.concat(chunks).toString())
      })
    }
  )
  )
}

const parseRegistryLanguages = (body) => {
  return body
    .split(/^%%$/gm)
    .map((lines) => lines.split('\n')
      .filter((line) => line.match(/^([A-Za-z-]+): (.*)$/))
      .map((item) => {
        const [, key, value] = item.match(/^([A-Za-z-]+): (.*)$/)
        return {
          [key
            .toLowerCase()
            .replace(/-([a-z])/g, (str) => str[1].toUpperCase())]: value
        }
      })
    ).map((lines) => {
      const language = {}

      lines.forEach((item) => {
        for (const key in item) {
          if (language[key]) {
            if (Array.isArray(language[key])) {
              if (language[key].indexOf(item[key]) === -1) {
                language[key].push(item[key])
              }
            } else {
              if (language[key] !== item[key]) {
                language[key] = [language[key], item[key]]
              }
            }
          } else {
            language[key] = item[key]
          }
        }
      })

      return language
    })
}

fetchFromRegistry(registryUrl)
  .then((body) => {
    const languages = parseRegistryLanguages(body)

    if (process.argv.indexOf('--stdout') !== -1) {
      process.stdout.write(JSON.stringify(languages.slice(0, 10), null, 2))
    }

    process.exitCode = 0
  })
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })

export {
  registryUrl,
  fetchFromRegistry,
  parseRegistryLanguages
}
