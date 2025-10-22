import EventBus from "./eventBus"

const DELAY_MULTIPLIER = 5000 // The higher the value, the greater the delay (ms)

/**
 * Enum that stores downloading modes available
 */
export enum DownloadMode {
    ASYNC,
    SYNC
}

/**
 * Class that defines a Download Queue that allows to download
 * several urls in a synchronous/asynchronous mode
 */
export default class DownloadQueue {
    // Queue that stores urls to download
    eventBus: EventBus
    queue: string[]
    constructor() {
        this.eventBus = new EventBus()
        this.queue = []

        // Initi bus listeners
        this.eventBus.on("DOWNLOAD_END", (event) => console.log(`${(event.payload as { url: string })?.url} download ended`))
        this.eventBus.on("DOWNLOAD_ERROR", (event) => console.log(`${(event.payload as { url: string })?.url} download error -> ${(event.payload as { error: unknown })?.error}`))
        this.eventBus.on("DOWNLOAD_PROGRESS", (event) => console.log(`${(event.payload as { url: string })?.url} download progress -> ${(event.payload as { progress: number })?.progress}`)) // TBD: Emit this event, fetch API wont provide any info on this
        this.eventBus.on("DOWNLOAD_START", (event) => { console.log(`${(event.payload as { url: string })?.url} download started`) })
    }

    destroy() {
        this.eventBus.destroy()
        this.queue = []
    }

    /**
     * @param url Item or items to add to the queu
     * 
     * Adds items to the que
     */
    enqueue(url: string | string[]) {
        if (typeof url === "string") {
            this.queue.push(url)
        } else {
            this.queue = url
        }
    }

    /**
     * Extracts an item from the queue
     */
    dequeue() {
        return this.queue.shift()
    }

    /**
     * Triggers urls request
     */
    async fire(async = DownloadMode.ASYNC) {
        await async === DownloadMode.ASYNC ? this.asyncDowload() : this.syncDownload()
    }

    private async download(url: string) {
        this.eventBus.post({ type: "DOWNLOAD_START", timestamp: Date.now(), payload: { url } })
        const delay = Math.random() * DELAY_MULTIPLIER
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await fetch(url)
                    this.eventBus.post({ type: "DOWNLOAD_END", timestamp: Date.now(), payload: { url } })
                    resolve()
                } catch (error) {
                    this.eventBus.post({ type: "DOWNLOAD_ERROR", timestamp: Date.now(), payload: { error, url } })
                    reject()
                }
            }, delay)
        })
    }

    /**
     * Downloads all urls asynchronously
     * 
     * @returns 
     */
    private async asyncDowload() {
        await Promise.all(this.queue.map(item => this.download(item)))
    }

    /**
     * Downloads all urls synchronoysly
     */
    private async syncDownload() {
        for (let i = 0; i < this.queue.length; i++) {
            await this.download(this.queue[i])
        }
    }
}