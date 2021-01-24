/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import IPC from "./IPC";

export default class Base {

    protected bot;
    protected clusterID;
    protected ipc;

    public constructor(setup: any) {
        this.bot = setup.bot;
        this.clusterID = setup.clusterID;
        this.ipc = new IPC();
    }

    public restartCluster(clusterID: any) {
        this.ipc.sendTo(clusterID, "restart", { _eventName: "restart" });
    }
}
