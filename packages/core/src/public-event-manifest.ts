export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@0codeai/zerocode-schema/event"
import { EventManifest } from "@0codeai/zerocode-schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
