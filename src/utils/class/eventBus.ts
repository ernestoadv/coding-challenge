import type { EventType, Event } from "../../types/events"

const DEFAULT_PRIORITY = 0 // The higher the value, the more priority a listener will have

/**
 * A listener that contains a callback that will receive base + custom data
*/
// TBD: As of now, only generic events are allowed, categorize them
type Listener<Event> = (event: Event) => void
interface ListenerEntry {
    listener: Listener<Event>
    priority: number
}

/**
 * Class that defines Event bus behaviour and its actions
 */
export default class EventBus {
    // Map that associates an event type to its listeners
    listeners: Map<string, ListenerEntry[]>
    constructor() {
        this.listeners = new Map()
    }

    /**
     * @param event PlayerEvent to subscribe to
     * @param listener Listener to include
     * 
     * Register a listener to the EventBus
     */
    on(event: EventType, listener: Listener<Event>, priority?: number) {
        const associatedListeners = this.listeners.get(event) ?? []
        if (associatedListeners.some(item => item.listener === listener)) {
            return;
        }
        associatedListeners.push({ listener, priority: priority || DEFAULT_PRIORITY })
        associatedListeners.sort((a, b) => b.priority - a.priority)
        this.listeners.set(event, associatedListeners)
    }

    /**
     * @param event PlayerEvent to look for
     * @param listener Listener to remove
     * 
     * Unregister a listener from the EventBus
     */
    off(event: EventType, listener: Listener<Event>) {
        let associatedListeners = this.listeners.get(event) ?? []
        if (!associatedListeners?.length) return;
        associatedListeners = associatedListeners.filter(item => item.listener !== listener)
        associatedListeners.length ?
            this.listeners.set(event, associatedListeners) :
            this.listeners.delete(event)
    }

    /**
     * @param event Event to trigger
     * 
     * Posts information to all event associated listeners
     */
    post(event: Event) {
        const associatedListeners = this.listeners.get(event.type) ?? []
        if (!associatedListeners?.length) return;
        associatedListeners.forEach(item => {
            try { item.listener(event) } catch (e) {
                console.error("[EventBus] Error when triggering listener")
            }
        });
    }

    /**
     * Remove all listeners
     */
    destroy() {
        this.listeners.clear()
    }
}