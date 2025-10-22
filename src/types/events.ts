/**
 * Player event types
 */
export type EventType =
    | "DOWNLOAD_END"
    | "DOWNLOAD_ERROR"
    | "DOWNLOAD_PROGRESS"
    | "DOWNLOAD_START"
    | "PLAY"
    | "PAUSE"
    | "SEEK"


/**
 * Interface that represent the minimum data an event should contain
*/
export interface BaseEvent<T extends EventType = EventType, P = unknown> {
    payload?: P;
    timestamp: number;
    type: T;
}
/**
 * Event interfaces
 * 
 * TBD: This is not escalable, it'd be better to create different maps an add events there and categorize them. 
 * That way, we could aggregate new maps related to different events so that the EventBus could handle any 
 * kind of event, not just generic events.
 */
export interface DownloadEndEvent extends BaseEvent<'DOWNLOAD_END', { url: string }> { }
export interface DownloadErrorEvent extends BaseEvent<'DOWNLOAD_ERROR', { error: unknown, url: string }> { }
export interface DownloadProgressEvent extends BaseEvent<'DOWNLOAD_PROGRESS', { progress: number, url: string }> { }
export interface DownloadStartEvent extends BaseEvent<'DOWNLOAD_START', { url: string }> { }
export interface PauseEvent extends BaseEvent<'PAUSE'> { }
export interface PlayEvent extends BaseEvent<'PLAY'> { }
export interface SeekEvent extends BaseEvent<'SEEK', { position: number }> { }

/**
 * Aggregate all events and export them as a generic type
 */
export type Event = DownloadEndEvent | DownloadErrorEvent | DownloadProgressEvent | DownloadStartEvent | PauseEvent | PlayEvent | SeekEvent 