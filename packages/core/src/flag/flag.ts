import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["ZEROCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["ZEROCODE_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("ZEROCODE_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  ZEROCODE_AUTO_HEAP_SNAPSHOT: truthy("ZEROCODE_AUTO_HEAP_SNAPSHOT"),
  ZEROCODE_GIT_BASH_PATH: process.env["ZEROCODE_GIT_BASH_PATH"],
  ZEROCODE_CONFIG: process.env["ZEROCODE_CONFIG"],
  ZEROCODE_CONFIG_CONTENT: process.env["ZEROCODE_CONFIG_CONTENT"],
  ZEROCODE_DISABLE_AUTOUPDATE: truthy("ZEROCODE_DISABLE_AUTOUPDATE"),
  ZEROCODE_ALWAYS_NOTIFY_UPDATE: truthy("ZEROCODE_ALWAYS_NOTIFY_UPDATE"),
  ZEROCODE_DISABLE_PRUNE: truthy("ZEROCODE_DISABLE_PRUNE"),
  ZEROCODE_DISABLE_TERMINAL_TITLE: truthy("ZEROCODE_DISABLE_TERMINAL_TITLE"),
  ZEROCODE_SHOW_TTFD: truthy("ZEROCODE_SHOW_TTFD"),
  ZEROCODE_DISABLE_AUTOCOMPACT: truthy("ZEROCODE_DISABLE_AUTOCOMPACT"),
  ZEROCODE_DISABLE_MODELS_FETCH: truthy("ZEROCODE_DISABLE_MODELS_FETCH"),
  ZEROCODE_DISABLE_MOUSE: truthy("ZEROCODE_DISABLE_MOUSE"),
  ZEROCODE_FAKE_VCS: process.env["ZEROCODE_FAKE_VCS"],
  ZEROCODE_SERVER_PASSWORD: process.env["ZEROCODE_SERVER_PASSWORD"],
  ZEROCODE_SERVER_USERNAME: process.env["ZEROCODE_SERVER_USERNAME"],
  ZEROCODE_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("ZEROCODE_DISABLE_FFF"),

  // Experimental
  ZEROCODE_EXPERIMENTAL_FILEWATCHER: Config.boolean("ZEROCODE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  ZEROCODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("ZEROCODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  ZEROCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("ZEROCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  ZEROCODE_MODELS_URL: process.env["ZEROCODE_MODELS_URL"],
  ZEROCODE_MODELS_PATH: process.env["ZEROCODE_MODELS_PATH"],
  ZEROCODE_DB: process.env["ZEROCODE_DB"],

  ZEROCODE_WORKSPACE_ID: process.env["ZEROCODE_WORKSPACE_ID"],
  ZEROCODE_EXPERIMENTAL_WORKSPACES: enabledByExperimental("ZEROCODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get ZEROCODE_DISABLE_PROJECT_CONFIG() {
    return truthy("ZEROCODE_DISABLE_PROJECT_CONFIG")
  },
  get ZEROCODE_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("ZEROCODE_EXPERIMENTAL_REFERENCES")
  },
  get ZEROCODE_TUI_CONFIG() {
    return process.env["ZEROCODE_TUI_CONFIG"]
  },
  get ZEROCODE_CONFIG_DIR() {
    return process.env["ZEROCODE_CONFIG_DIR"]
  },
  get ZEROCODE_PURE() {
    return truthy("ZEROCODE_PURE")
  },
  get ZEROCODE_PERMISSION() {
    return process.env["ZEROCODE_PERMISSION"]
  },
  get ZEROCODE_PLUGIN_META_FILE() {
    return process.env["ZEROCODE_PLUGIN_META_FILE"]
  },
  get ZEROCODE_CLIENT() {
    return process.env["ZEROCODE_CLIENT"] ?? "cli"
  },
}
