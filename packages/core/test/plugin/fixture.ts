import { AgentV2 } from "@zerocode-ai/core/agent"
import { AISDK } from "@zerocode-ai/core/aisdk"
import { Catalog } from "@zerocode-ai/core/catalog"
import { CommandV2 } from "@zerocode-ai/core/command"
import { Credential } from "@zerocode-ai/core/credential"
import { AppNodeBuilder } from "@zerocode-ai/core/effect/app-node-builder"
import { LayerNodePlatform } from "@zerocode-ai/core/effect/app-node-platform"
import { LayerNode } from "@zerocode-ai/core/effect/layer-node"
import { EventV2 } from "@zerocode-ai/core/event"
import { FileSystem } from "@zerocode-ai/core/filesystem"
import { FSUtil } from "@zerocode-ai/core/fs-util"
import { Integration } from "@zerocode-ai/core/integration"
import { Location } from "@zerocode-ai/core/location"
import { Npm } from "@zerocode-ai/core/npm"
import { PluginV2 } from "@zerocode-ai/core/plugin"
import { Reference } from "@zerocode-ai/core/reference"
import { SkillV2 } from "@zerocode-ai/core/skill"
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
