import { ServerPlayer } from "bdsx/bds/player";
import { SimpleForm, FormInput, FormButton, CustomForm, FormDropdown } from "bdsx/bds/form";
import { getNames, players } from ".";

export function mainForm(client: ServerPlayer): void {
    const form = new SimpleForm();
    form.setTitle("Private Message");
    form.setContent("Choose how you search for a player to send a private message to him.");
    form.addButton(new FormButton("By nickname"))
    form.addButton(new FormButton("By list"))
    form.sendTo(client.getNetworkIdentifier(), async (data) => {
        if (data === null) {
            // pass
        } else {
            switch (data.response) {
                case 0:
                    byNicknameForm(client);
                    break;

                case 1:
                    byListForm(client);
                    break;
            }
        }
    });
}

function byNicknameForm(client: ServerPlayer): void {
    const client_name = client.getName();
    const form = new CustomForm();
    form.setTitle("Private Message");
    form.addComponent(new FormInput("Write the player's nickname", "Steve"))
    form.addComponent(new FormInput("Message", "Hello Steve!"));
    form.sendTo(client.getNetworkIdentifier(), async (data) => {
        if (data === null) {
            // pass
        } else {
            const name = data.response[0];
            const message = data.response[1];
            if (name.length === 0 || message.length === 0) {
                client.sendMessage("§c[PM] Error! Message or nickname is empty!");
            } else {
                if (client_name === "1") {
                    client.sendMessage("§c[PM] Error! You cannot send messages to yourself!");
                } else {
                    for (let i = 0; i < players.length; i++) {
                        const target = players[i] as ServerPlayer;
                        if (target.getName() === name) {
                            client.sendMessage(`[PM] You have sent a message to player §a${name}§r!`);
                            target.sendMessage(`[PM] Message from §a${client_name}§f -> §9${message}§r`);
                            break;
                        }
                    }
                }
            }
        }
    });
}

function byListForm(client: ServerPlayer): void {
    const client_name = client.getName();
    const names: string[] = getNames("1");
    const form = new CustomForm();
    form.setTitle("Private Message");
    form.addComponent(new FormDropdown("Select a player from the list", names))
    form.addComponent(new FormInput("Message", "Hello Steve!"));
    form.sendTo(client.getNetworkIdentifier(), async (data) => {
        if (data === null) {
            // pass
        } else {
            console.log(data.response);
            const name = data.response[0];
            const message = data.response[1];
            if (message.length === 0) {
                client.sendMessage("§c[PM] Error! Message is empty!");
            } else {
                let find: boolean = false;
                for (let i = 0; i < players.length; i++) {
                    const target = players[i] as ServerPlayer;
                    if (target.getName() === names[name]) {
                        find = true;
                        client.sendMessage(`[PM] You have sent a message to player §a${name}§r!`);
                        target.sendMessage(`[PM] Message from §a${client_name}§f -> §9${message}§r`);
                        break;
                    }
                }

                if (find === false) {
                    client.sendMessage("§c[PM] Error! Player not found! He may have already left from server.");
                }
            }
        }
    });
}