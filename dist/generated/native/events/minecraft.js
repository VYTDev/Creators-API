/**
 * This script allows you to listen for Minecraft events
 */
import * as mc from "@minecraft/server";
import { Events } from "./index.js";
/**
 * An event handler that includes Minecraft events
 */
export const handler = new Events();
// world before events
mc.world.beforeEvents.chatSend.subscribe((ev) => handler.dispatchEvent("beforeChatSend", ev));
mc.world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe((ev) => handler.dispatchEvent("beforeDataDrivenEntityTrigger", ev));
mc.world.beforeEvents.explosion.subscribe((ev) => handler.dispatchEvent("beforeExplosion", ev));
mc.world.beforeEvents.itemDefinitionEvent.subscribe((ev) => handler.dispatchEvent("beforeItemDefinition", ev));
mc.world.beforeEvents.itemUse.subscribe((ev) => handler.dispatchEvent("beforeItemUse", ev));
mc.world.beforeEvents.itemUseOn.subscribe((ev) => handler.dispatchEvent("beforeItemUseOn", ev));
mc.world.beforeEvents.pistonActivate.subscribe((ev) => handler.dispatchEvent("beforePistonActivate", ev));
// world after events
mc.world.afterEvents.blockBreak.subscribe((ev) => handler.dispatchEvent("afterBlockBreak", ev));
mc.world.afterEvents.blockExplode.subscribe((ev) => handler.dispatchEvent("afterBlockExplode", ev));
mc.world.afterEvents.blockPlace.subscribe((ev) => handler.dispatchEvent("afterBlockPlace", ev));
mc.world.afterEvents.buttonPush.subscribe((ev) => handler.dispatchEvent("afterButtonPush", ev));
mc.world.afterEvents.chatSend.subscribe((ev) => handler.dispatchEvent("afterChatSend", ev));
mc.world.afterEvents.dataDrivenEntityTriggerEvent.subscribe((ev) => handler.dispatchEvent("afterDataDrivenEntityTrigger", ev));
mc.world.afterEvents.effectAdd.subscribe((ev) => handler.dispatchEvent("afterEffectAdd", ev));
mc.world.afterEvents.entityDie.subscribe((ev) => handler.dispatchEvent("afterEntityDie", ev));
mc.world.afterEvents.entityHealthChanged.subscribe((ev) => handler.dispatchEvent("afterEntityHealthChanged", ev));
mc.world.afterEvents.entityHitBlock.subscribe((ev) => handler.dispatchEvent("afterEntityHitBlock", ev));
mc.world.afterEvents.entityHitEntity.subscribe((ev) => handler.dispatchEvent("afterEntityHitEntity", ev));
mc.world.afterEvents.entityHurt.subscribe((ev) => handler.dispatchEvent("afterEntityHurt", ev));
mc.world.afterEvents.entityRemoved.subscribe((ev) => handler.dispatchEvent("afterEntityRemoved", ev));
mc.world.afterEvents.entitySpawn.subscribe((ev) => handler.dispatchEvent("afterEntitySpawn", ev));
mc.world.afterEvents.explosion.subscribe((ev) => handler.dispatchEvent("afterExplosion", ev));
mc.world.afterEvents.itemCompleteUse.subscribe((ev) => handler.dispatchEvent("afterItemCompleteUse", ev));
mc.world.afterEvents.itemDefinitionEvent.subscribe((ev) => handler.dispatchEvent("afterItemDefinition", ev));
mc.world.afterEvents.itemReleaseUse.subscribe((ev) => handler.dispatchEvent("afterItemReleaseUse", ev));
mc.world.afterEvents.itemStartUse.subscribe((ev) => handler.dispatchEvent("afterItemStartUse", ev));
mc.world.afterEvents.itemStartUseOn.subscribe((ev) => handler.dispatchEvent("afterItemStartUseOn", ev));
mc.world.afterEvents.itemStopUse.subscribe((ev) => handler.dispatchEvent("afterItemStopUse", ev));
mc.world.afterEvents.itemStopUseOn.subscribe((ev) => handler.dispatchEvent("afterItemStopUseOn", ev));
mc.world.afterEvents.itemUse.subscribe((ev) => handler.dispatchEvent("afterItemUse", ev));
mc.world.afterEvents.itemUseOn.subscribe((ev) => handler.dispatchEvent("afterItemUseOn", ev));
mc.world.afterEvents.leverAction.subscribe((ev) => handler.dispatchEvent("afterLeverAction", ev));
mc.world.afterEvents.messageReceive.subscribe((ev) => handler.dispatchEvent("afterMessageReceive", ev));
mc.world.afterEvents.pistonActivate.subscribe((ev) => handler.dispatchEvent("afterPistonActivate", ev));
mc.world.afterEvents.playerJoin.subscribe((ev) => handler.dispatchEvent("afterPlayerJoin", ev));
mc.world.afterEvents.playerLeave.subscribe((ev) => handler.dispatchEvent("afterPlayerLeave", ev));
mc.world.afterEvents.playerSpawn.subscribe((ev) => handler.dispatchEvent("afterPlayerSpawn", ev));
mc.world.afterEvents.pressurePlatePop.subscribe((ev) => handler.dispatchEvent("afterPressurePlatePop", ev));
mc.world.afterEvents.pressurePlatePush.subscribe((ev) => handler.dispatchEvent("afterPressurePlatePush", ev));
mc.world.afterEvents.projectileHitBlock.subscribe((ev) => handler.dispatchEvent("afterProjectileHitBlock", ev));
mc.world.afterEvents.projectileHitEntity.subscribe((ev) => handler.dispatchEvent("afterProjectileHitEntity", ev));
mc.world.afterEvents.targetBlockHit.subscribe((ev) => handler.dispatchEvent("afterTargetBlockHit", ev));
mc.world.afterEvents.tripWireTrip.subscribe((ev) => handler.dispatchEvent("afterTripWireTrip", ev));
mc.world.afterEvents.weatherChange.subscribe((ev) => handler.dispatchEvent("afterWeatherChange", ev));
mc.world.afterEvents.worldInitialize.subscribe((ev) => handler.dispatchEvent("afterWorldInitialize", ev));
// system before events
mc.system.beforeEvents.watchdogTerminate.subscribe((ev) => handler.dispatchEvent("beforeWatchdogTerminate", ev));
// system after events
mc.system.afterEvents.scriptEventReceive.subscribe((ev) => handler.dispatchEvent("afterScriptEventReceive", ev));
