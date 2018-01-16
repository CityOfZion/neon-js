# Docs

This is the documentation folder. We rely on Python's `Sphinx` coupled with `sphinx-js` to generate our documentation. The files are written in [reStructedText](http://docutils.sourceforge.net/rst.html)

## Install

Requires

- Node v4.2.0 or higher
- Python (both v2 and v3 are supported)

```sh
$ npm i -g jsdoc
```

```sh
$ pip install -r requirements.txt
```

## Build

This command builds the documentation locally and places it in `docs` folder.

```sh
$ cd source
$ sphinx-versioning -g ../ -l ./conf.py build docs ../docs/_build
```

## Deploy

This command immediately deploys to `gh-pages`.

```sh
$ cd source
$ sphinx-versioning -g ../ -l ./conf.py push docs gh-pages .
```
## References

[Sphinx-JS](https://github.com/erikrose/sphinx-js)

[sphinx-versioning](https://robpol86.github.io/sphinxcontrib-versioning/index.html)
