// Tiny script to update the static browser.js for the website

const fs = require('fs')

const STATIC_NEON = './static/browser.js'
const LIB_NEON = '../lib/browser.js'

function removeOldFile (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) resolve()
      fs.unlink(path, (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  })
}

function moveFile (oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

removeOldFile(STATIC_NEON)
  .then(_ => moveFile(LIB_NEON, STATIC_NEON))
