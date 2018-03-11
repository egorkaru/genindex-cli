const {EOL} = require('os')

const minify = (css) => 
  css.split(EOL)
    .join('')
    .replace(/  /g, '')
    .replace(/ {/g, '{')
    .replace(/: /g, ':')

const header = (directory_name, {title, desc}) => 
  [title, desc, `Index of ${directory_name}:`]
      .filter(v => !!v)
      .map((text, i) => ((i, text, lvl=++i) => `<h${lvl}>${text}</h${lvl}>`)(i, text))
      .join(EOL)

const row = (item) => {
  const {name, size, mtime, isDir, isFile, url, description} = item
  const link = `<a href="${url}">${name}</a>`
  const humanizeSize = (size) => {
    const sufix = ' KMGTP'
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return `${Math.round(size/Math.pow(1024, i)*100)/100} ${sufix.charAt(i)}b`
  }
  const humanizeDate = (time) => {
    const updated = new Date(time)
    const chain = ['getDate', 'getMonth', 'getFullYear', 'getHours', 'getMinutes'].map(fun => updated[fun]())
    let [dd, mm, yyyy, hours, minutes] = chain.map((int, ind) => ind == 1 ? (++int).toString() : int.toString()).map(str => str.padStart(2, 0))
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}`
  }
  const stats = isFile ?
    `${humanizeSize(size)}, ${humanizeDate(mtime)}` :
    `${humanizeDate(mtime)}`
  return description ?
  `  <li>${link} — <span class='description'>${description}</span> <span class='stats'>${stats}</span></li>` :
  `  <li>${link} <span class='stats'>${stats}</span></li>`
}

const listing = (list) =>
  list
    .map(item => row(item))
    .join(EOL)

const index = (css) => (directory_name, meta, list) => 
(`<!doctype html>
<head>
  <meta charset="utf-8">
  <title>${meta.title ? meta.title : directory_name}</title>
  <style>
    ${css}
  </style>
</head>
${
  header(directory_name, meta)
}
<ul>
${
  listing(list)
}
</ul>`)

module.exports = {
  minify,
  index
}
