import { spawn } from "node:child_process"
import path from "node:path"
import chokidar from "chokidar"

let child = null
let envDebounce = null
let prismaDebounce = null
let shuttingDown = false

/** In Docker, Turbopack often misses bind-mount file events; Webpack + WATCHPACK_POLLING is reliable. */
const useWebpackDev = process.env.NEXT_DEV_USE_WEBPACK === "true"

const prismaCli = path.join(process.cwd(), "node_modules/prisma/build/index.js")

function nextBinPath() {
  return path.join(process.cwd(), "node_modules/next/dist/bin/next")
}

function nextDevArgs() {
  const args = ["dev"]
  if (useWebpackDev) args.push("--webpack")
  return args
}

function startNext() {
  if (child) {
    child.removeAllListeners()
    child.kill("SIGTERM")
    child = null
  }
  child = spawn(process.execPath, [nextBinPath(), ...nextDevArgs()], {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
  })
  child.on("exit", (code, signal) => {
    child = null
    if (shuttingDown) return
    if (signal === "SIGTERM" || signal === "SIGINT") return
    if (code !== 0 && code !== null) process.exit(code ?? 1)
  })
}

function scheduleRestartAfterEnvChange() {
  clearTimeout(envDebounce)
  envDebounce = setTimeout(() => {
    console.log("\n[dev] Env file changed — restarting Next.js (picks up .env changes).\n")
    startNext()
  }, 400)
}

function schedulePrismaGenerateAndRestart() {
  clearTimeout(prismaDebounce)
  prismaDebounce = setTimeout(() => {
    console.log("\n[dev] Prisma schema changed — running prisma generate…\n")
    const gen = spawn(process.execPath, [prismaCli, "generate"], {
      stdio: "inherit",
      env: process.env,
      cwd: process.cwd(),
    })
    gen.on("exit", (code) => {
      if (code !== 0) {
        console.error(`\n[dev] prisma generate exited with code ${code}\n`)
        return
      }
      console.log("\n[dev] Prisma client updated — restarting Next.js.\n")
      startNext()
    })
  }, 500)
}

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  clearTimeout(envDebounce)
  clearTimeout(prismaDebounce)
  if (child) {
    child.once("exit", () => process.exit(0))
    child.kill("SIGTERM")
    setTimeout(() => process.exit(0), 10_000).unref()
  } else {
    process.exit(0)
  }
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

const usePolling =
  process.env.CHOKIDAR_USEPOLLING === "true" ||
  process.env.WATCHPACK_POLLING === "true"

const pollInterval = usePolling ? 1000 : undefined

startNext()

function isPrismaSchemaFile(relPath) {
  const n = relPath.replace(/\\/g, "/")
  if (!n.endsWith(".prisma")) return false
  if (n.includes("/prisma/migrations/")) return false
  return n.includes("/prisma/") || n.startsWith("prisma/")
}

chokidar
  .watch([".env*", "prisma"], {
    cwd: process.cwd(),
    ignoreInitial: true,
    usePolling,
    interval: pollInterval,
    binaryInterval: pollInterval,
    depth: 10,
    awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 100 },
    ignored: (targetPath) => {
      const p = targetPath.replace(/\\/g, "/")
      return p.includes("/prisma/migrations/")
    },
  })
  .on("all", (_event, relPath) => {
    const norm = relPath.replace(/\\/g, "/")

    if (isPrismaSchemaFile(norm)) {
      schedulePrismaGenerateAndRestart()
      return
    }

    const base = norm.split("/").pop() ?? ""
    if (base.endsWith("~")) return
    if (base !== ".env" && !base.startsWith(".env.")) return
    scheduleRestartAfterEnvChange()
  })
