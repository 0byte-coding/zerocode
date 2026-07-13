#!/usr/bin/env bun
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
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(dir)
  if (await published(name, version)) return console.log(`already published ${name}@${version}`)
  await $`bun pm pack`.cwd(dir)
  await $`npm publish *.tgz --access public --tag ${Script.channel}`.cwd(dir)
}

const wrapperDirName = "cli-lildax"
const binaries: Record<string, string> = {}
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const item = await Bun.file(`./dist/${filepath}`).json()
  binaries[item.name] = item.version
}
console.log("binaries", binaries)
const version = Object.values(binaries)[0]

// Build directory mapping: the build script creates flat dirs with scoped npm names
const binaryDirs: Record<string, string> = {}
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const dirName = filepath.replace("/package.json", "")
  const item = await Bun.file(`./dist/${filepath}`).json()
  binaryDirs[dirName] = item.name
}

await $`mkdir -p ./dist/${wrapperDirName}/bin`
await $`cp ./bin/lildax.cjs ./dist/${wrapperDirName}/bin/lildax`
await Bun.file(`./dist/${wrapperDirName}/package.json`).write(
  JSON.stringify(
    {
      name: pkg.name,
      bin: { lildax: "./bin/lildax" },
      version,
      license: pkg.license,
      repository: { type: "git", url: "git+https://github.com/0byte-coding/zerocode.git" },
      os: ["darwin", "linux", "win32"],
      cpu: ["arm64", "x64"],
      optionalDependencies: binaries,
    },
    null,
    2,
  ),
)

await Promise.all(
  Object.entries(binaryDirs).map(([dirName, pkgName]) =>
    publish(`./dist/${dirName}`, pkgName, binaries[pkgName]),
  ),
)
await publish(`./dist/${wrapperDirName}`, pkg.name, version)
