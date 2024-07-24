export default class SimpleRatelimit {
    requestCount;
    resetInterval;
    entries;
    constructor(requestCount, resetInterval) {
        this.requestCount = requestCount;
        this.resetInterval = resetInterval;
        this.entries = new Map();
    }
    get(key) {
        return (this.entries.get(key) ?? {
            remainingRequests: this.requestCount,
            resetTime: new Date(0),
        });
    }
    consume(key, count) {
        if (this.entries.has(key)) {
            const ratelimit = this.entries.get(key);
            if (ratelimit.remainingRequests - (count ?? 1) < 0) {
                if (this.requestCount - (count ?? 1) < 0) {
                    throw new RatelimitExceededError(`Consume request count is higher than default available request count!`);
                }
                else {
                    throw new RatelimitExceededError(`Ratelimit exceeded, try again in ${ratelimit.resetTime.getDate() - Date.now()} ms!`);
                }
            }
            ratelimit.remainingRequests -= count ?? 1;
            return ratelimit;
        }
        else {
            if (this.requestCount - (count ?? 1) < 0) {
                throw new RatelimitExceededError(`Consume request count is higher than default available request count!`);
            }
            const ratelimit = {
                remainingRequests: this.requestCount - (count ?? 1),
                resetTime: new Date(Date.now() + this.resetInterval),
                timer: null,
            };
            this.entries.set(key, ratelimit);
            ratelimit.timer = this._onAdd(ratelimit);
            return ratelimit;
        }
    }
    _onAdd(ratelimit) {
        return setInterval(() => {
            // TODO: work on
        }, this.resetInterval);
    }
}
export class RatelimitExceededError extends Error {
    constructor(message) {
        super(message.toString());
        this.name = "RatelimitExceededError";
        Object.setPrototypeOf(this, RatelimitExceededError.prototype);
    }
}
