import { describe, expect, it } from "vitest"
import {
  addGregorianDays,
  iterateInclusiveCalendarDays,
  subtractIntervals,
  sliceIntoSlots,
} from "./slots"

describe("addGregorianDays", () => {
  it("rolls month and year", () => {
    expect(addGregorianDays("2024-01-31", 1)).toBe("2024-02-01")
    expect(addGregorianDays("2024-12-31", 1)).toBe("2025-01-01")
  })

  it("handles leap day", () => {
    expect(addGregorianDays("2024-02-28", 1)).toBe("2024-02-29")
    expect(addGregorianDays("2024-02-29", 1)).toBe("2024-03-01")
  })

  it("steps backward", () => {
    expect(addGregorianDays("2024-03-01", -1)).toBe("2024-02-29")
  })
})

describe("iterateInclusiveCalendarDays", () => {
  it("yields inclusive range", () => {
    expect([...iterateInclusiveCalendarDays("2024-06-01", "2024-06-03")]).toEqual([
      "2024-06-01",
      "2024-06-02",
      "2024-06-03",
    ])
  })

  it("handles single day", () => {
    expect([...iterateInclusiveCalendarDays("2024-01-15", "2024-01-15")]).toEqual([
      "2024-01-15",
    ])
  })
})

describe("subtractIntervals", () => {
  it("returns free when no busy", () => {
    const free = [
      {
        start: new Date("2024-06-01T10:00:00.000Z"),
        end: new Date("2024-06-01T12:00:00.000Z"),
      },
    ]
    expect(subtractIntervals(free, [])).toEqual(free)
  })

  it("splits out a middle busy block", () => {
    const free = [
      {
        start: new Date("2024-06-01T09:00:00.000Z"),
        end: new Date("2024-06-01T17:00:00.000Z"),
      },
    ]
    const busy = [
      {
        start: new Date("2024-06-01T12:00:00.000Z"),
        end: new Date("2024-06-01T13:00:00.000Z"),
      },
    ]
    const out = subtractIntervals(free, busy)
    expect(out).toHaveLength(2)
    expect(out[0].start.toISOString()).toBe("2024-06-01T09:00:00.000Z")
    expect(out[0].end.toISOString()).toBe("2024-06-01T12:00:00.000Z")
    expect(out[1].start.toISOString()).toBe("2024-06-01T13:00:00.000Z")
    expect(out[1].end.toISOString()).toBe("2024-06-01T17:00:00.000Z")
  })
})

describe("sliceIntoSlots", () => {
  it("packs contiguous slots when buffers are zero", () => {
    const interval = {
      start: new Date("2024-06-01T10:00:00.000Z"),
      end: new Date("2024-06-01T11:30:00.000Z"),
    }
    const starts = sliceIntoSlots(interval, 30, 0, 0)
    expect(starts.map((d) => d.toISOString())).toEqual([
      "2024-06-01T10:00:00.000Z",
      "2024-06-01T10:30:00.000Z",
      "2024-06-01T11:00:00.000Z",
    ])
  })

  it("trims interval with bufferBefore and bufferAfter", () => {
    const interval = {
      start: new Date("2024-06-01T10:00:00.000Z"),
      end: new Date("2024-06-01T11:30:00.000Z"),
    }
    const starts = sliceIntoSlots(interval, 30, 15, 15)
    // effective 10:15–11:15 → one 30m slot (next start would end after 11:15)
    expect(starts).toHaveLength(1)
    expect(starts[0].toISOString()).toBe("2024-06-01T10:15:00.000Z")
  })

  it("leaves gap between offered starts using bufferAfter as step tail", () => {
    const interval = {
      start: new Date("2024-06-01T10:00:00.000Z"),
      end: new Date("2024-06-01T12:15:00.000Z"),
    }
    const starts = sliceIntoSlots(interval, 30, 0, 15)
    // effectiveEnd 12:00; step 45m → 10:00, 10:45, 11:30 (next12:15 > 12:00)
    expect(starts.map((d) => d.toISOString())).toEqual([
      "2024-06-01T10:00:00.000Z",
      "2024-06-01T10:45:00.000Z",
      "2024-06-01T11:30:00.000Z",
    ])
  })
})
