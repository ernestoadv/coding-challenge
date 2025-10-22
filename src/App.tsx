import DownloadQueue, { DownloadMode } from "./utils/class/donwloadQueue"
import EventBus from "./utils/class/eventBus"
import { useCallback, useEffect, useRef } from 'react'

export default function App() {
  const downloadQueue = useRef(new DownloadQueue())
  const eventBus = useRef(new EventBus())

  const removableSeekCallback = useCallback(() => {
    console.log("REMOVABLE SEEK")
  }, [])

  useEffect(() => {
    // Download queue logic
    downloadQueue.current.enqueue(["http://example.com/", "http://example.net/", "http://example.org/"])
    downloadQueue.current.fire(DownloadMode.ASYNC)

    // Event bus logic
    eventBus.current.on("PAUSE", () => {
      console.log("PAUSE")
    })
    eventBus.current.on("PLAY", () => {
      console.log("PLAY")
    })
    eventBus.current.on("SEEK", () => {
      console.log("SEEK 1")
    })
    eventBus.current.on("SEEK", () => {
      console.log("SEEK 2")
    })
    eventBus.current.on("SEEK", removableSeekCallback)
    eventBus.current.off("SEEK", removableSeekCallback)
  }, [eventBus])

  return (
    <div style={{ height: "100vh", width: "100vw", backgroundColor: "black", display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: 20 }}>
      <button onClick={() => eventBus.current.post({ timestamp: Date.now(), type: "PAUSE" })}>{"PAUSE"}</button>
      <button onClick={() => eventBus.current.post({ timestamp: Date.now(), type: "PLAY" })}>{"PLAY"}</button>
      <button onClick={() => eventBus.current.post({ timestamp: Date.now(), type: "SEEK", payload: { position: 100 } })}>{"SEEK"}</button>
    </div>
  )
}

