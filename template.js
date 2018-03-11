const {EOL} = require('os')

const css = `:root{--primary-back:#f4f5f6;--second-back:#e1e1e1;--primary:#606c76;--link:#547794;--visited:#294f6e;--hover:#769bb9}*{padding:0;margin:0;box-sizing:border-box}body{width:100vw;min-height:100vh;font-family:Cambria,Cochin,Georgia,Times,'Times New Roman',serif;background-color:var(--primary-back);color:var(--primary);padding:5vh 7vw}h1{line-height:1.8em}h2{line-height:1.6em}h3{line-height:1.4em}ul{list-style-type: circle;margin:2vh 0;padding:1vh 2vw;background-color:var(--second-back)}li{font-size:1.1em;line-height:1.2em;margin:1vh 0}a{color:var(--link)}a:visited{color:var(--visited)}a:hover{color:var(--hover)}`

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
    ${css}
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
