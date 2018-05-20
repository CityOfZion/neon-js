export function bundleSemantic (semanticApis) {
  return semanticApis.reduce((bundle, mod) => {
    Object.keys(mod).map(key => {
      if (bundle[key]) Object.assign(bundle[key], mod[key])
      else bundle[key] = mod[key]
    })
    return bundle
  }, {})
}
