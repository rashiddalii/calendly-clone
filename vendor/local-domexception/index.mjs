if (!globalThis.DOMException) {
  throw new Error(
    "local-domexception: globalThis.DOMException is missing (requires Node 18+)"
  )
}

export default globalThis.DOMException
