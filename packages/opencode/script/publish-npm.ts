#!/usr/bin/env bun
// Publishes the @0codeai/zerocode npm wrapper package and its per-platform
// optionalDependency binary packages. Only needs a registry auth token -
// no AUR key, docker login, or homebrew tap access required.
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@0codeai/zerocode-script"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

async function published(name: string, version: string) {
  return (await $`npm view ${name}@${version} version`.nothrow()).exitCode === 0
}

async function publish(dir: string, name: string, version: string) {
  // GitHub artifact downloads can drop the executable bit, and Docker uses the
  // unpacked dist binaries directly rather than the published tarball.
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(dir)
  if (await published(name, version)) {
    console.log(`already published ${name}@${version}`)
    return
  }
  await $`bun pm pack`.cwd(dir)
  await $`npm publish *.tgz --access public --tag ${Script.channel}`.cwd(dir)
}

const wrapperName = "@0codeai/zerocode"
const wrapperDirName = "zerocode"
const binCommand = "zerocode"

const binaries: Record<string, string> = {}
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const pkg = await Bun.file(`./dist/${filepath}`).json()
  binaries[pkg.name] = pkg.version
}
console.log("binaries", binaries)
const version = Object.values(binaries)[0]

// Build the directory mapping: dirName -> pkgName
// Binary packages are in flat dirs like zerocode-darwin-arm64 with scoped names
const binaryDirs: Record<string, string> = {}
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const dirName = filepath.replace("/package.json", "")
  const pkg = await Bun.file(`./dist/${filepath}`).json()
  binaryDirs[dirName] = pkg.name
}

await $`mkdir -p ./dist/${wrapperDirName}`
await $`mkdir -p ./dist/${wrapperDirName}/bin`
await $`cp ./script/postinstall.mjs ./dist/${wrapperDirName}/postinstall.mjs`
await Bun.file(`./dist/${wrapperDirName}/LICENSE`).write(await Bun.file("../../LICENSE").text())
await Bun.file(`./dist/${wrapperDirName}/bin/${binCommand}.exe`).write(
  [
    `echo "Error: ${wrapperName}'s postinstall script was not run." >&2`,
    'echo "" >&2',
    'echo "This occurs when using --ignore-scripts during installation, or when using a" >&2',
    'echo "package manager like pnpm that does not run postinstall scripts by default." >&2',
    'echo "" >&2',
    'echo "To fix this, run the postinstall script manually:" >&2',
    `echo "  cd node_modules/${wrapperName} && node postinstall.mjs" >&2`,
    'echo "" >&2',
    `echo "Or reinstall ${wrapperName} without the --ignore-scripts flag." >&2`,
    "exit 1",
    "",
  ].join("\n"),
)

await Bun.file(`./dist/${wrapperDirName}/package.json`).write(
  JSON.stringify(
    {
      name: wrapperName,
      bin: {
        [binCommand]: `./bin/${binCommand}.exe`,
      },
      scripts: {
        postinstall: "node ./postinstall.mjs",
      },
      version: version,
      license: pkg.license,
      os: ["darwin", "linux", "win32"],
      cpu: ["arm64", "x64"],
      optionalDependencies: binaries,
    },
    null,
    2,
  ),
)

// Binaries are ~50-70MB each; publishing all of them at once can outrun a
// constrained uplink. ZEROCODE_PUBLISH_CONCURRENCY throttles this (defaults
// to full concurrency, matching prior behavior on well-connected runners).
const entries = Object.entries(binaryDirs)
const concurrency = Number(process.env.ZEROCODE_PUBLISH_CONCURRENCY) || entries.length || 1
let next = 0
async function worker() {
  while (next < entries.length) {
    const [dirName, pkgName] = entries[next++]
    await publish(`./dist/${dirName}`, pkgName, binaries[pkgName])
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker))
await publish(`./dist/${wrapperDirName}`, wrapperName, version)
