const path = require('path')

const dotNextPath = path.resolve(__dirname, '..', '.next')

const inDotNextDir = pathToFile => path.join(dotNextPath, pathToFile)

module.exports = {
  dotNextPath,
  inDotNextDir
}
