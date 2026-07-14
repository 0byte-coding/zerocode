#!/usr/bin/env bun
// Orchestrates a full opencode CLI release: npm packages, then the
// docker/AUR/homebrew extras (extras script no-ops on preview builds).
// Split into publish-npm.ts / publish-extras.ts so the npm-only path
// (see .github/workflows/publish-npm.yml) doesn't need docker, AUR, or
// homebrew credentials.
import { $ } from "bun"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

await $`bun ./script/publish-npm.ts`
await $`bun ./script/publish-extras.ts`
