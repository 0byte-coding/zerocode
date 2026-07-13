import path from "path"

process.env.ZEROCODE_DB = ":memory:"
process.env.ZEROCODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.ZEROCODE_DISABLE_MODELS_FETCH = "true"
