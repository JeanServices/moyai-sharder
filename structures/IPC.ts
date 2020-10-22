const EventEmitter = require("events");
export default class IPC extends EventEmitter {
    public constructor() {
        super();
        this.events = new Map();

        process.on("message", msg => {
            let event = this.events.get(msg._eventName);
            if (event) {
                event.fn(msg);
            }
        });
    }

    public register(event, callback) {
        this.events.set(event, { fn: callback });
    }

    public unregister(name) {
        this.events.delete(name);
    }

    public broadcast(name, message: { _eventName: String }) {
        message._eventName = name;
        process.send({ name: "broadcast", msg: message });
    }

    public sendTo(cluster, name, message) {
        if(!message) message = {};
        message._eventName = name;
        process.send({ name: "send", cluster: cluster, msg: message });
    }

    public restart(cluster) {
        process.send({ name: "send", cluster: cluster, msg: { _eventName: "restart" }});
    }

    public restartAll() {
        process.send({ name: "broadcast", msg: { _eventName: "restart" }});
    }

    public async fetchUser(id) {
        process.send({ name: "fetchUser", id });

        return new Promise((resolve, reject) => {
            const callback = (user) => {
                this.removeListener(id, callback);
                resolve(user);
            };

            this.on(id, callback);
        });
    }

    public async fetchGuild(id) {
        process.send({ name: "fetchGuild", id });

        return new Promise((resolve, reject) => {
            const callback = (guild) => {
                this.removeListener(id, callback);
                resolve(guild);
            };

            this.on(id, callback);
        });
    }

    public async fetchChannel(id) {
        process.send({ name: "fetchChannel", id });

        return new Promise((resolve, reject) => {
            const callback = (channel) => {
                this.removeListener(id, callback);
                resolve(channel);
            };

            this.on(id, callback);
        });
    }

    public async fetchMember(guildID, memberID) {
        process.send({ name: "fetchMember", guildID, memberID });

        return new Promise((resolve, reject) => {
            const callback = (channel) => {
                this.removeListener(memberID, callback);
                resolve(channel);
            };

            this.on(memberID, callback);
        });
    }
}