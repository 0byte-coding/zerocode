import { run as runTui, type TuiInput } from "@zerocode-ai/tui"
import { Global } from "@zerocode-ai/core/global"
import { AppNodeBuilder } from "@zerocode-ai/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
