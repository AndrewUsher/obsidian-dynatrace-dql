import { readFileSync, writeFileSync } from 'fs'

const version = process.argv[2]
if (!version) {
  console.error('Usage: node version-bump.mjs <new-version>')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'))
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const versions = JSON.parse(readFileSync('versions.json', 'utf8'))

manifest.version = version
pkg.version = version
versions[version] = version

writeFileSync('manifest.json', JSON.stringify(manifest, null, 2) + '\n')
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
writeFileSync('versions.json', JSON.stringify(versions, null, 2) + '\n')

console.log(`Bumped to v${version}`)
