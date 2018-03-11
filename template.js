const {EOL} = require('os')

const minify = (css) => 
  css.split(EOL)
    .join('')
    .replace(/  /g, '')
    .replace(/ {/g, '{')
    .replace(/: /g, ':')

const humanize = {
  size (sizeinbytes) {
    const sufix = 'KMGTP'
    const i = Math.floor(Math.log(sizeinbytes) / Math.log(1024))
    return `${Math.round(sizeinbytes/Math.pow(1024, i)*100)/100}${['', ...sufix][i]}b`
  },
  date (timestr) {
    const updated = new Date(timestr)
    const chain = ['getDate', 'getMonth', 'getFullYear', 'getHours', 'getMinutes'].map(fun => updated[fun]())
    const [dd, mm, yyyy, hours, minutes] = chain.map((int, ind) => ind == 1 ? (++int).toString() : int.toString()).map(str => str.padStart(2, 0))
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}`
  }
}

const header = (directory_name, {title, desc}) => 
  [title, desc, `Index of ${directory_name}:`]
      .filter(v => !!v)
      .map((text, i) => ((i, text, lvl=++i) => `<h${lvl}>${text}</h${lvl}>`)(i, text))
      .join(EOL)

const row = (item) => {
  const {name, size, mtime, isFile, url, description} = item
  const link = `<a href="${url}">${name}</a>`
  const stats = isFile ?
    `${humanize.size(size)}, ${humanize.date(mtime)}` :
    `${humanize.date(mtime)}`
  return description ?
  `  <li>${link} — <span class='description'>${description}</span> <span class='stats'>${stats}</span></li>` :
  `  <li>${link} <span class='stats'>${stats}</span></li>`
}

const listing = (list) => 
`<ul>
${
  list.map(item => row(item)).join(EOL)
}
</ul>`

const links = (directory_name, {links}) => 
`<h3>Addition links for ${directory_name}:</h3>
<ul>
${
  links.map(({href, title}) => `  <li><a href="${href}">${title}</a></li>`).join(EOL)
}
</ul>`


const html = (css) => (directory_name, meta, list) => 
`<!doctype html>
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
${
  listing(list)
}
${
  meta.links ? links(directory_name, meta) : ''
}`

module.exports = {
  minify,
  humanize,
  html
}
