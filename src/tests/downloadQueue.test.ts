import DownloadQueue, { DownloadMode } from "../utils/class/donwloadQueue"

describe("DonwloadQueue", () => {
    let downloadQueue: DownloadQueue
    beforeEach(() => {
        downloadQueue = new DownloadQueue()
        const urls = ["http://example.com/"]
        downloadQueue.enqueue(urls)

        // Mock fetch
        global.fetch = jest.fn((url) => {
            return Promise.resolve({
                url,
            })
        }
        ) as jest.Mock;
    })
    afterEach(() => {
        downloadQueue.destroy()
    })

    it("Register urls", () => {
        expect(downloadQueue.queue.length).toBe(1)
    })

    it("Unqueue an url", () => {
        downloadQueue.dequeue()
        expect(downloadQueue.queue.length).toBe(0)
    })

    it("Fire async request", async () => {
        const spy = jest.spyOn(downloadQueue.eventBus, "post");
        await downloadQueue.fire(DownloadMode.ASYNC)
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ timestamp: expect.any(Number), type: "DOWNLOAD_START", payload: { url: "http://example.com/" } }));
    })

    it("Fire sync request", async () => {
        const spy = jest.spyOn(downloadQueue.eventBus, "post");
        await downloadQueue.fire(DownloadMode.SYNC)
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: "DOWNLOAD_START", payload: { url: "http://example.com/" } }));
    })
})