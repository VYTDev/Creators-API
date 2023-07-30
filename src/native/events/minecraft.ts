/**
 * This script allows you to listen for Minecraft events
 */
import * as mc from "@minecraft/server";
import { Events } from "./index.js";

export type MinecraftEventList = {
    // world before events
    beforeChatSend: [mc.ChatSendBeforeEvent],
    beforeDataDrivenEntityTrigger: [mc.DataDrivenEntityTriggerBeforeEvent],
    beforeExplosion: [mc.ExplosionBeforeEvent],
    beforeItemDefinition: [mc.ItemDefinitionTriggeredBeforeEvent],
    beforeItemUse: [mc.ItemUseBeforeEvent],
    beforeItemUseOn: [mc.ItemUseOnBeforeEvent],
    beforePistonActivate: [mc.PistonActivateBeforeEvent],
    // world after events
    afterBlockBreak: [mc.BlockBreakAfterEvent],
    afterBlockExplode: [mc.BlockExplodeAfterEvent],
    afterBlockPlace: [mc.BlockPlaceAfterEvent],
    afterButtonPush: [mc.ButtonPushAfterEvent],
    afterChatSend: [mc.ChatSendAfterEvent],
    afterDataDrivenEntityTrigger: [mc.DataDrivenEntityTriggerAfterEvent],
    afterEffectAdd: [mc.EffectAddAfterEvent],
    afterEntityDie: [mc.EntityDieAfterEvent],
    afterEntityHealthChanged: [mc.EntityHealthChangedAfterEvent],
    afterEntityHitBlock: [mc.EntityHitBlockAfterEvent],
    afterEntityHitEntity: [mc.EntityHitEntityAfterEvent],
    afterEntityHurt: [mc.EntityHurtAfterEvent],
    afterEntityRemoved: [mc.EntityRemovedAfterEvent],
    afterEntitySpawn: [mc.EntitySpawnAfterEvent],
    afterExplosion: [mc.ExplosionAfterEvent],
    afterItemCompleteUse: [mc.ItemCompleteUseAfterEvent],
    afterItemDefinition: [mc.ItemDefinitionTriggeredAfterEvent],
    afterItemReleaseUse: [mc.ItemReleaseUseAfterEvent],
    afterItemStartUse: [mc.ItemStartUseAfterEvent],
    afterItemStartUseOn: [mc.ItemStartUseOnAfterEvent],
    afterItemStopUse: [mc.ItemStopUseAfterEvent],
    afterItemStopUseOn: [mc.ItemStopUseOnAfterEvent],
    afterItemUse: [mc.ItemUseAfterEvent],
    afterItemUseOn: [mc.ItemUseOnAfterEvent],
    afterLeverAction: [mc.LeverActionAfterEvent],
    afterMessageReceive: [mc.MessageReceiveAfterEvent],
    afterPistonActivate: [mc.PistonActivateAfterEvent],
    afterPlayerJoin: [mc.PlayerJoinAfterEvent],
    afterPlayerLeave: [mc.PlayerLeaveAfterEvent],
    afterPlayerSpawn: [mc.PlayerSpawnAfterEvent],
    afterPressurePlatePop: [mc.PressurePlatePopAfterEvent],
    afterPressurePlatePush: [mc.PressurePlatePushAfterEvent],
    afterProjectileHit: [mc.ProjectileHitAfterEvent],
    afterTargetBlockHit: [mc.TargetBlockHitAfterEvent],
    afterTripWireTrip: [mc.TripWireTripAfterEvent],
    afterWeatherChange: [mc.WeatherChangeAfterEvent],
    afterWorldInitialize: [mc.WorldInitializeAfterEvent],
    // system before events
    beforeWatchdogTerminate: [mc.WatchdogTerminateBeforeEvent],
    // system after events
    afterScriptEventReceive: [mc.ScriptEventCommandMessageAfterEvent],
}

/**
 * An event handler that includes Minecraft events
 */
export const handler = new Events<MinecraftEventList>();
// world before events
mc.world.beforeEvents.chatSend.subscribe((ev: mc.ChatSendBeforeEvent) => handler.dispatchEvent("beforeChatSend", ev));
mc.world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe((ev: mc.DataDrivenEntityTriggerBeforeEvent) => handler.dispatchEvent("beforeDataDrivenEntityTrigger", ev));
mc.world.beforeEvents.explosion.subscribe((ev: mc.ExplosionBeforeEvent) => handler.dispatchEvent("beforeExplosion", ev));
mc.world.beforeEvents.itemDefinitionEvent.subscribe((ev: mc.ItemDefinitionTriggeredBeforeEvent) => handler.dispatchEvent("beforeItemDefinition", ev));
mc.world.beforeEvents.itemUse.subscribe((ev: mc.ItemUseBeforeEvent) => handler.dispatchEvent("beforeItemUse", ev));
mc.world.beforeEvents.itemUseOn.subscribe((ev: mc.ItemUseOnBeforeEvent) => handler.dispatchEvent("beforeItemUseOn", ev));
mc.world.beforeEvents.pistonActivate.subscribe((ev: mc.PistonActivateBeforeEvent) => handler.dispatchEvent("beforePistonActivate", ev));
// world after events
mc.world.afterEvents.blockBreak.subscribe((ev: mc.BlockBreakAfterEvent) => handler.dispatchEvent("afterBlockBreak", ev));
mc.world.afterEvents.blockExplode.subscribe((ev: mc.BlockExplodeAfterEvent) => handler.dispatchEvent("afterBlockExplode", ev));
mc.world.afterEvents.blockPlace.subscribe((ev: mc.BlockPlaceAfterEvent) => handler.dispatchEvent("afterBlockPlace", ev));
mc.world.afterEvents.buttonPush.subscribe((ev: mc.ButtonPushAfterEvent) => handler.dispatchEvent("afterButtonPush", ev));
mc.world.afterEvents.chatSend.subscribe((ev: mc.ChatSendAfterEvent) => handler.dispatchEvent("afterChatSend", ev));
mc.world.afterEvents.dataDrivenEntityTriggerEvent.subscribe((ev: mc.DataDrivenEntityTriggerAfterEvent) => handler.dispatchEvent("afterDataDrivenEntityTrigger", ev));
mc.world.afterEvents.effectAdd.subscribe((ev: mc.EffectAddAfterEvent) => handler.dispatchEvent("afterEffectAdd", ev));
mc.world.afterEvents.entityDie.subscribe((ev: mc.EntityDieAfterEvent) => handler.dispatchEvent("afterEntityDie", ev));
mc.world.afterEvents.entityHealthChanged.subscribe((ev: mc.EntityHealthChangedAfterEvent) => handler.dispatchEvent("afterEntityHealthChanged", ev));
mc.world.afterEvents.entityHitBlock.subscribe((ev: mc.EntityHitBlockAfterEvent) => handler.dispatchEvent("afterEntityHitBlock", ev));
mc.world.afterEvents.entityHitEntity.subscribe((ev: mc.EntityHitEntityAfterEvent) => handler.dispatchEvent("afterEntityHitEntity", ev));
mc.world.afterEvents.entityHurt.subscribe((ev: mc.EntityHurtAfterEvent) => handler.dispatchEvent("afterEntityHurt", ev));
mc.world.afterEvents.entityRemoved.subscribe((ev: mc.EntityRemovedAfterEvent) => handler.dispatchEvent("afterEntityRemoved", ev));
mc.world.afterEvents.entitySpawn.subscribe((ev: mc.EntitySpawnAfterEvent) => handler.dispatchEvent("afterEntitySpawn", ev));
mc.world.afterEvents.explosion.subscribe((ev: mc.ExplosionAfterEvent) => handler.dispatchEvent("afterExplosion", ev));
mc.world.afterEvents.itemCompleteUse.subscribe((ev: mc.ItemCompleteUseAfterEvent) => handler.dispatchEvent("afterItemCompleteUse", ev));
mc.world.afterEvents.itemDefinitionEvent.subscribe((ev: mc.ItemDefinitionTriggeredAfterEvent) => handler.dispatchEvent("afterItemDefinition", ev));
mc.world.afterEvents.itemReleaseUse.subscribe((ev: mc.ItemReleaseUseAfterEvent) => handler.dispatchEvent("afterItemReleaseUse", ev));
mc.world.afterEvents.itemStartUse.subscribe((ev: mc.ItemStartUseAfterEvent) => handler.dispatchEvent("afterItemStartUse", ev));
mc.world.afterEvents.itemStartUseOn.subscribe((ev: mc.ItemStartUseOnAfterEvent) => handler.dispatchEvent("afterItemStartUseOn", ev));
mc.world.afterEvents.itemStopUse.subscribe((ev: mc.ItemStopUseAfterEvent) => handler.dispatchEvent("afterItemStopUse", ev));
mc.world.afterEvents.itemStopUseOn.subscribe((ev: mc.ItemStopUseOnAfterEvent) => handler.dispatchEvent("afterItemStopUseOn", ev));
mc.world.afterEvents.itemUse.subscribe((ev: mc.ItemUseAfterEvent) => handler.dispatchEvent("afterItemUse", ev));
mc.world.afterEvents.itemUseOn.subscribe((ev: mc.ItemUseOnAfterEvent) => handler.dispatchEvent("afterItemUseOn", ev));
mc.world.afterEvents.leverAction.subscribe((ev: mc.LeverActionAfterEvent) => handler.dispatchEvent("afterLeverAction", ev));
mc.world.afterEvents.messageReceive.subscribe((ev: mc.MessageReceiveAfterEvent) => handler.dispatchEvent("afterMessageReceive", ev));
mc.world.afterEvents.pistonActivate.subscribe((ev: mc.PistonActivateAfterEvent) => handler.dispatchEvent("afterPistonActivate", ev));
mc.world.afterEvents.playerJoin.subscribe((ev: mc.PlayerJoinAfterEvent) => handler.dispatchEvent("afterPlayerJoin", ev));
mc.world.afterEvents.playerLeave.subscribe((ev: mc.PlayerLeaveAfterEvent) => handler.dispatchEvent("afterPlayerLeave", ev));
mc.world.afterEvents.playerSpawn.subscribe((ev: mc.PlayerSpawnAfterEvent) => handler.dispatchEvent("afterPlayerSpawn", ev));
mc.world.afterEvents.pressurePlatePop.subscribe((ev: mc.PressurePlatePopAfterEvent) => handler.dispatchEvent("afterPressurePlatePop", ev));
mc.world.afterEvents.pressurePlatePush.subscribe((ev: mc.PressurePlatePushAfterEvent) => handler.dispatchEvent("afterPressurePlatePush", ev));
mc.world.afterEvents.projectileHit.subscribe((ev: mc.ProjectileHitAfterEvent) => handler.dispatchEvent("afterProjectileHit", ev));
mc.world.afterEvents.targetBlockHit.subscribe((ev: mc.TargetBlockHitAfterEvent) => handler.dispatchEvent("afterTargetBlockHit", ev));
mc.world.afterEvents.tripWireTrip.subscribe((ev: mc.TripWireTripAfterEvent) => handler.dispatchEvent("afterTripWireTrip", ev));
mc.world.afterEvents.weatherChange.subscribe((ev: mc.WeatherChangeAfterEvent) => handler.dispatchEvent("afterWeatherChange", ev));
mc.world.afterEvents.worldInitialize.subscribe((ev: mc.WorldInitializeAfterEvent) => handler.dispatchEvent("afterWorldInitialize", ev));
// system before events
mc.system.beforeEvents.watchdogTerminate.subscribe((ev: mc.WatchdogTerminateBeforeEvent) => handler.dispatchEvent("beforeWatchdogTerminate", ev));
// system after events
mc.system.afterEvents.scriptEventReceive.subscribe((ev: mc.ScriptEventCommandMessageAfterEvent) => handler.dispatchEvent("afterScriptEventReceive", ev));
