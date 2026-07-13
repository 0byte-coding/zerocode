import { run as runTui, type TuiInput } from "@0codeai/zerocode-tui"
import { Global } from "@0codeai/zerocode-core/global"
import { AppNodeBuilder } from "@0codeai/zerocode-core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
