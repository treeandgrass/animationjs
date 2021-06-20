export class Event {
  private eventsMap = new Map<string, Function[]>()

  public on (eventName: string, func: Function) {
    const set = (this.eventsMap.get(eventName) || []) as Function[]
    if (!this.eventsMap.has(eventName)) {
      this.eventsMap.set(eventName, set)
    }
    set.push(func)
  }

  emit (eventName: string, ...args: any[]) {
    if (this.eventsMap.has(eventName)) {
      const funcs = this.eventsMap.get(eventName)
      funcs.forEach((func) => {
        func(args)
      })
    }
  }
}