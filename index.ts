
import { ServerPlayer } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { mainForm } from "./forms";

export const players: ServerPlayer[] = [];

events.serverOpen.on(()=>{
    console.log('[plugin:PrivateMessage] launching');
});

events.serverClose.on(()=>{
    console.log('[plugin:PrivateMessage] closed');
});

events.playerJoin.on((pk)=>{
    const client = pk.player.getNetworkIdentifier().getActor() as ServerPlayer;
    players.push(client);
    console.log(client.getName(), " Added!");
});

events.networkDisconnected.on(networkIdentifier => {
    const client = networkIdentifier.getActor() as ServerPlayer;
    const index = players.indexOf(client, 0);
    if (index !== -1) {
        delete players[index];
        console.log(client.getName(), " Rmoved!");
    }
});

events.command.on((cmd, origin, ctx) => {
    const client = getPlayer(origin);
    if(client instanceof ServerPlayer) {
        if (cmd === "/pm") {
            mainForm(client);
        }
    }
});

function getPlayer(client_name: string): ServerPlayer | null{
    for (let index = 0; index < players.length; index++) {
        if (players[index].getName() === client_name) {
            return players[index];
        }
    }

    return null;
}

export function getNames(client_name: string): string[] {
    const data: string[] = [];
    for (let index = 0; index < players.length; index++) {
        if (players[index].getName() !== client_name) {
            data.push(players[index].getName());
        }
    }
    return data;
}