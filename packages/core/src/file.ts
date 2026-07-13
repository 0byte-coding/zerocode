export * as File from "./file"

import { Revert } from "@0codeai/zerocode-schema/revert"

export const Diff = Revert.FileDiff
export type Diff = typeof Diff.Type
