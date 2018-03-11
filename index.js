#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const url = require('url')
const {promisify} = require('util')

const template = require('./template')

const readdir = promisify(fs.readdir)
const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const arguments = (names, argv) => {
  const args = argv.slice(2)
  return names.reduce((acc, cur, index) => {
    acc[cur] = args[index]
    return acc
  }, {})
}

const error = (err) => {
  console.error(err)
    process.exit(2) 
  }

const absolutePath = (directory) => 
  path.isAbsolute(directory) ?
    directory :
    path.join(path.resolve(`.${path.sep}`), directory)

const listFiles = async (directory) => {
  const list = await readdir(directory)
    .catch(error)
  return list
    .filter(file => !file.startsWith('.'))
    .filter(file => file != 'index.html')
}

const URLize = (startURL, filename) => 
  startURL.startsWith('.') ?
    `${startURL}${filename}` :
    startURL.startsWith('http') ?
      url.resolve(startURL, filename) :
      path.join(startURL, filename)

const getStartURL = async (dir) => {
  const URLFilePath = path.join(dir, '.URL')
  const isURLFileExist = await exists(URLFilePath)
  return isURLFileExist ? 
    await readFile(URLFilePath)
      .then(data => data.toString())
      .catch(err => console.error(err)) :
    `.${path.sep}`
}

const getDescriptions = async (dir) => {
  const descriptionPath = path.join(dir, '.description.json')
  const isExist = await exists(descriptionPath)
  return isExist ? 
    await readFile(descriptionPath)
      .then(data => data.toString())
      .then(data => JSON.parse(data))
      .then(data => {
        const metaKeys = Object.keys(data)
          .filter(key => key.startsWith('.'))
        if (metaKeys.length)
          return Object.keys(data).reduce((acc, cur) => {
            if (metaKeys.includes(cur)){
              let noDots = cur.substr(1)
              acc[0][noDots] = data[cur]
            } else {
              acc[1][cur] = data[cur]
            }
            return acc
          }, [{}, {}])
        return [{}, data]
      })
      .catch(err => console.error(err)) :
    [{}, {}]
}

const makeLinks = (files, startURL, descriptions) => 
  files.map(filename => descriptions[filename] ? 
      ({ url: URLize(startURL, filename), name: filename, description: descriptions[filename]}) :
      ({ url: URLize(startURL, filename), name: filename})
    )

const help = () => {
  console.log(`
    Usage: genindex <directory> <startURL?>

        <directory> - path to directory
        <startURL>  - start url for files
                      add dot with slash by default,
                      or get it from .URL file
    
      .description.json file
        {
          ".title": "index.html title",
          ".desc": "page subtitle",
          "<filename>": "description for file"
        }

    Example

        genindex . 'example.com'
  `)
  process.exit(0) 
}

const main = async () => {
  const args = arguments(['directory', 'startURL'], process.argv)

  if (!args.directory || args.directory == '--help')
    help()
  
  const realPath = absolutePath(args.directory)
  if (!await exists(realPath))
    error('Directory not exist!')

  const directory_name = path.basename(realPath)
  const files = await listFiles(realPath)

  const startURL = !args.startURL ? 
    await getStartURL(realPath) :
    args.startURL

  const [meta, descriptions] = await getDescriptions(realPath)
  const links = makeLinks(files, startURL, descriptions)
  const html = template.index(directory_name, meta, links)

  const indexPath = path.join(realPath, 'index.html')
  await writeFile(indexPath, html)
    .then(console.info(`Generated: ${indexPath}`))
    .catch(error)
}

main().then(null)
