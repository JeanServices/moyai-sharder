import EventEmitter from "events";
export default class IPC extends EventEmitter {

    public events: Map<any, any>;

    public constructor() {
        super();
        this.events = new Map();

        process.on("message", (msg: any) => {
            let event = this.events.get(msg._eventName);
            if (event) {
                event.fn(msg);
            }
        });
    }

    public register(event: any, callback: any) {
        this.events.set(event, { fn: callback });
    }

    public unregister(name: any) {
        this.events.delete(name);
    }

    public broadcast(name: any, message: { _eventName: String }) {
        message._eventName = name;
        process.send({ name: "broadcast", msg: message });
    }

    public sendTo(cluster: any, name: any, message: { _eventName: String }) {
        message._eventName = name;
        process.send({ name: "send", cluster: cluster, msg: message });
    }

    public restart(cluster: any) {
        process.send({ name: "send", cluster: cluster, msg: { _eventName: "restart" }});
    }

    public restartAll() {
        process.send({ name: "broadcast", msg: { _eventName: "restart" }});
    }

    public async fetchUser(id: any) {
        process.send({ name: "fetchUser", id });

        return new Promise((resolve, reject) => {
            const callback = (user: any) => {
                this.removeListener(id, callback);
                resolve(user);
            };

            this.on(id, callback);
        });
    }

    public async fetchGuild(id: any) {
        process.send({ name: "fetchGuild", id });

        return new Promise((resolve, reject) => {
            const callback = (guild: any) => {
                this.removeListener(id, callback);
                resolve(guild);
            };

            this.on(id, callback);
        });
    }

    public async fetchChannel(id: any) {
        process.send({ name: "fetchChannel", id });

        return new Promise((resolve, reject) => {
            const callback = (channel: any) => {
                this.removeListener(id, callback);
                resolve(channel);
            };

            this.on(id, callback);
        });
    }

    public async fetchMember(guildID: any, memberID: any) {
        process.send({ name: "fetchMember", guildID, memberID });

        return new Promise((resolve, reject) => {
            const callback = (channel: any) => {
                this.removeListener(memberID, callback);
                resolve(channel);
            };

            this.on(memberID, callback);
        });
    }
}
