class EventBus {
    private REGISTRY = new Map<string, Array<(...any: any) => Promise<void>>>();

    listen<Params>(event: string, handler: (params: Params) => Promise<void>) {
        console.debug(`Adding listener for ${event}`);
        const listeners = this.REGISTRY.get(event) ?? [];
        this.REGISTRY.set(event, [...listeners, handler]);
        console.debug(`Added listener for ${event}`);
    }

    dispatch<Params>(event: string, params?: Params) {
        console.debug(`Dispatching event ${event}`);
        const listeners = this.REGISTRY.get(event) ?? [];
        // We explicitly do not want callers to attempt to wait for this promise to complete.
        Promise.all(listeners.map((listener) => listener(params))).then(() => {
            console.debug(`Dispatched event ${event} to ${listeners.length} listener(s)`);
        });
    }
}

export const eventBus = new EventBus();
