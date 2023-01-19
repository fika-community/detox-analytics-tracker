import fs from 'fs'

const readFile = (location, { encoding = 'utf8' } = {}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(location, encoding, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

const writeFile = (location, content, { encoding = 'utf8' } = {}) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(location, content, encoding, (err, data) => {
      if (err) {
        console.log(`failed to write file ${location}. Error: ${err}`)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const convertPackageJson = async () => {
  const file = await readFile('package.json')
  const parsedFile = JSON.parse(file)
  delete parsedFile.type
  parsedFile.main = 'index.js'
  await writeFile('./dist/package.json', JSON.stringify(parsedFile, null, 2) + '\n')
}

convertPackageJson()
  .then(() => {
    console.info('package.json moved to dist')
    process.exit(0)
  })
  .catch(error => {
    console.info(`Error: ${error.message}`)
    process.exit(1)
  })
