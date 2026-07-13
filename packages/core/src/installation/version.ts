declare global {
  const ZEROCODE_VERSION: string
  const ZEROCODE_CHANNEL: string
}

export const InstallationVersion = typeof ZEROCODE_VERSION === "string" ? ZEROCODE_VERSION : "local"
export const InstallationChannel = typeof ZEROCODE_CHANNEL === "string" ? ZEROCODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
