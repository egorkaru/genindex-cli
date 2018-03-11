const {EOL} = require('os')

const header = (directory_name, {title, desc}) => 
  (
    [title, desc, `Index of ${directory_name}:`]
      .filter(v => !!v)
      .map((text, i) => ((i, text, lvl=++i) => `<h${lvl}>${text}</h${lvl}>`)(i, text))
      .join(EOL)
  )

const index = (directory_name, meta, links) => 
(`<!doctype html>
<head>
  <meta charset="utf-8">
  <title>${meta.title ? meta.title : directory_name}</title>
  <style>
  </style>
</head>
${
  header(directory_name, meta)
}
<ul>
${
  links.map(link => 
    link['description'] ?
      `  <li><a href="${link.url}">${link.name}</a> — <span>${link.description}</span></li>` :
      `  <li><a href="${link.url}">${link.name}</a></li>`)
    .join(EOL)
}
</ul>`)

module.exports = {
  index
}
