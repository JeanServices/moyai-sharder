import IPC from "./IPC";
export default class Base {

    protected client;
    protected clusterID;
    protected ipc;

    public constructor(setup) {
        this.client = setup.client;
        this.clusterID = setup.clusterID;
        this.ipc = new IPC();
    }

    public restartCluster(clusterID) {
        this.ipc.sendTo(clusterID, "restart", { name: "restart" });
    }
}