/**
 * This script allows you to listen for Minecraft events
 */
import * as mc from "@minecraft/server";
import { Events } from "./index.js";
export type MinecraftEventList = {
    beforeChatSend: [mc.ChatSendBeforeEvent];
    beforeDataDrivenEntityTrigger: [mc.DataDrivenEntityTriggerBeforeEvent];
    beforeExplosion: [mc.ExplosionBeforeEvent];
    beforeItemDefinition: [mc.ItemDefinitionTriggeredBeforeEvent];
    beforeItemUse: [mc.ItemUseBeforeEvent];
    beforeItemUseOn: [mc.ItemUseOnBeforeEvent];
    beforePistonActivate: [mc.PistonActivateBeforeEvent];
    afterBlockBreak: [mc.BlockBreakAfterEvent];
    afterBlockExplode: [mc.BlockExplodeAfterEvent];
    afterBlockPlace: [mc.BlockPlaceAfterEvent];
    afterButtonPush: [mc.ButtonPushAfterEvent];
    afterChatSend: [mc.ChatSendAfterEvent];
    afterDataDrivenEntityTrigger: [mc.DataDrivenEntityTriggerAfterEvent];
    afterEffectAdd: [mc.EffectAddAfterEvent];
    afterEntityDie: [mc.EntityDieAfterEvent];
    afterEntityHealthChanged: [mc.EntityHealthChangedAfterEvent];
    afterEntityHitBlock: [mc.EntityHitBlockAfterEvent];
    afterEntityHitEntity: [mc.EntityHitEntityAfterEvent];
    afterEntityHurt: [mc.EntityHurtAfterEvent];
    afterEntityRemoved: [mc.EntityRemovedAfterEvent];
    afterEntitySpawn: [mc.EntitySpawnAfterEvent];
    afterExplosion: [mc.ExplosionAfterEvent];
    afterItemCompleteUse: [mc.ItemCompleteUseAfterEvent];
    afterItemDefinition: [mc.ItemDefinitionTriggeredAfterEvent];
    afterItemReleaseUse: [mc.ItemReleaseUseAfterEvent];
    afterItemStartUse: [mc.ItemStartUseAfterEvent];
    afterItemStartUseOn: [mc.ItemStartUseOnAfterEvent];
    afterItemStopUse: [mc.ItemStopUseAfterEvent];
    afterItemStopUseOn: [mc.ItemStopUseOnAfterEvent];
    afterItemUse: [mc.ItemUseAfterEvent];
    afterItemUseOn: [mc.ItemUseOnAfterEvent];
    afterLeverAction: [mc.LeverActionAfterEvent];
    afterMessageReceive: [mc.MessageReceiveAfterEvent];
    afterPistonActivate: [mc.PistonActivateAfterEvent];
    afterPlayerJoin: [mc.PlayerJoinAfterEvent];
    afterPlayerLeave: [mc.PlayerLeaveAfterEvent];
    afterPlayerSpawn: [mc.PlayerSpawnAfterEvent];
    afterPressurePlatePop: [mc.PressurePlatePopAfterEvent];
    afterPressurePlatePush: [mc.PressurePlatePushAfterEvent];
    afterProjectileHitBlock: [mc.ProjectileHitBlockAfterEvent];
    afterProjectileHitEntity: [mc.ProjectileHitEntityAfterEvent];
    afterTargetBlockHit: [mc.TargetBlockHitAfterEvent];
    afterTripWireTrip: [mc.TripWireTripAfterEvent];
    afterWeatherChange: [mc.WeatherChangeAfterEvent];
    afterWorldInitialize: [mc.WorldInitializeAfterEvent];
    beforeWatchdogTerminate: [mc.WatchdogTerminateBeforeEvent];
    afterScriptEventReceive: [mc.ScriptEventCommandMessageAfterEvent];
};
/**
 * An event handler that includes Minecraft events
 */
export declare const handler: Events<MinecraftEventList>;
