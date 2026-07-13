import { AgentV2 } from "@0codeai/zerocode-core/agent"
import { AISDK } from "@0codeai/zerocode-core/aisdk"
import { Catalog } from "@0codeai/zerocode-core/catalog"
import { CommandV2 } from "@0codeai/zerocode-core/command"
import { Credential } from "@0codeai/zerocode-core/credential"
import { AppNodeBuilder } from "@0codeai/zerocode-core/effect/app-node-builder"
import { LayerNodePlatform } from "@0codeai/zerocode-core/effect/app-node-platform"
import { LayerNode } from "@0codeai/zerocode-core/effect/layer-node"
import { EventV2 } from "@0codeai/zerocode-core/event"
import { FileSystem } from "@0codeai/zerocode-core/filesystem"
import { FSUtil } from "@0codeai/zerocode-core/fs-util"
import { Integration } from "@0codeai/zerocode-core/integration"
import { Location } from "@0codeai/zerocode-core/location"
import { Npm } from "@0codeai/zerocode-core/npm"
import { PluginV2 } from "@0codeai/zerocode-core/plugin"
import { Reference } from "@0codeai/zerocode-core/reference"
import { SkillV2 } from "@0codeai/zerocode-core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
