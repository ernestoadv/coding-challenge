import EventBus from "../utils/class/eventBus"

describe("EventBus", () => {
    let eventBus: EventBus;
    beforeEach(() => {
        eventBus = new EventBus()
    })
    afterEach(() => {
        eventBus.destroy()
    })

    it("Register a listener", () => {
        const callback = jest.fn()
        eventBus.on("PLAY", callback)
        const associatedListeners = eventBus.listeners.get("PLAY")?.length
        expect(associatedListeners).toBe(1)
    })

    it("Unregister a listener", () => {
        const callback = jest.fn()
        eventBus.on("PLAY", callback)
        expect(eventBus.listeners.get("PLAY")?.length).toBe(1)
        eventBus.off("PLAY", callback)
        expect(eventBus.listeners.get("PLAY")?.length).toBe(undefined)
    })

    it("Register a listener and call post", () => {
        const callback = jest.fn()
        eventBus.on("PLAY", callback)
        expect(eventBus.listeners.get("PLAY")?.length).toBe(1)
        eventBus.post({ timestamp: Date.now(), type: "PLAY" })
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it("Do not register a listener twice", () => {
        const callback = jest.fn()
        eventBus.on("PLAY", callback)
        eventBus.on("PLAY", callback)
        const associatedListeners = eventBus.listeners.get("PLAY")?.length
        expect(associatedListeners).toBe(1)
    })

    it("Register two listeners with different priorities and call post", () => {
        const order: string[] = []
        eventBus.on("PLAY", () => order.push("LOW PRIORITY"), -10)
        eventBus.on("PLAY", () => order.push("HIGH PRIORITY"), 10)
        eventBus.post({ timestamp: Date.now(), type: "PLAY" })
        expect(order).toEqual(["HIGH PRIORITY", "LOW PRIORITY"])
    })
}) 