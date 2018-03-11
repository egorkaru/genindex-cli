# genindex - index.html for files
---

## Instalation

```bash
npm install -g genindex-cli
```

## Usage 

```bash

Usage: genindex <directory> <url?>

    <directory> - path to directory
    <url>  - start url for files
             add dot with slash by default,
             or get it from .URL file


```

```bash
$ genindex . 'http://example.com/static'

```

### .URL file

You can also save your *url* to a ```.URL``` file so you don’t have to type it into the CLI either.

### .description.json file

Better watch the [example](https://github.com/egorkaru/genindex-cli/blob/master/example/.description.json)

And then 

```bash
$ genindex .
```

