import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'

// Read the pnpm-workspace.yaml catalog
function getCatalogVersions() {
  const workspaceContent = readFileSync('../../pnpm-workspace.yaml', 'utf8')
  const catalog = {}

  // Simple parser for catalog entries
  const lines = workspaceContent.split('\n')
  let inCatalog = false

  for (const line of lines) {
    if (line.startsWith('catalog:')) {
      inCatalog = true
      continue
    }
    if (inCatalog && line.trim() && !line.startsWith(' ')) {
      break
    }
    if (inCatalog && line.includes(':')) {
      const match = line.match(/^\s+['"]?([^'":\s]+)['"]?\s*:\s*(.+)$/)
      if (match) {
        catalog[match[1]] = match[2].trim()
      }
    }
  }

  return catalog
}

// Resolve a version string — use catalog lookup for "catalog:" entries, otherwise keep as-is
function resolveVersion(version, packageName, catalog) {
  if (version === 'catalog:') {
    const resolved = catalog[packageName]
    if (!resolved) {
      throw new Error(`Package "${packageName}" uses catalog: but was not found in pnpm-workspace.yaml catalog`)
    }
    return resolved
  }
  return version
}

// Collect all dependencies from workspace packages (transitive deps needed at runtime)
function collectWorkspaceDependencies(catalog) {
  const workspacePackages = [
    '../../packages/api/package.json',
    '../../packages/auth/package.json',
    '../../packages/db/package.json',
    '../../packages/validators/package.json',
  ]

  const allDeps = {}

  for (const pkgPath of workspacePackages) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const deps = pkg.dependencies || {}

      for (const [name, version] of Object.entries(deps)) {
        if (!name.startsWith('@workspace/')) {
          allDeps[name] = resolveVersion(version, name, catalog)
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${pkgPath}`)
    }
  }

  return allDeps
}

// Get catalog versions
const catalog = getCatalogVersions()

// Read this package's dependencies
const localPkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const deps = localPkg.dependencies || {}

// Resolve all local dependency versions
const resolvedDeps = {}
for (const [name, version] of Object.entries(deps)) {
  // Skip workspace: references — those are bundled by tsup, but we need their transitive deps
  if (typeof version === 'string' && version.startsWith('workspace:')) continue
  resolvedDeps[name] = resolveVersion(version, name, catalog)
}

// Collect workspace packages' transitive dependencies
const workspaceDeps = collectWorkspaceDependencies(catalog)

// Create production package.json with resolved versions
const prodPackageJson = {
  name: 'fastify',
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: {
    start: 'node index.js',
  },
  dependencies: {
    ...resolvedDeps,
    // Auto-discovered workspace transitive dependencies
    ...workspaceDeps,
  },
}

try {
  writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2))
  console.log('✅ Production package.json created!')
  console.log('📋 All dependencies resolved from catalog')

  // Copy env file
  copyFileSync('../../.env', 'dist/.env')
  console.log('✅ Env file copied!')

  console.log('\n🚀 Production build complete!')
  console.log('📦 Deploy the entire dist/ folder to your server')
  console.log('🔧 On server: npm install --production')
} catch (error) {
  console.error('❌ Failed to create production files:', error)
  process.exit(1)
}
