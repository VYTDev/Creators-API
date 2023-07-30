// example plugin script
// include 'events' built-in library
import { main } from "events";
// include '@minecraft/server' Minecraft module
import { world } from "@minecraft/server";

main.addEventListener("afterWorldInitialize", (ev) => {
    // broadcast this message
    world.sendMessage("Hello, world!");
});
