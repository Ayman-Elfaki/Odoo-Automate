import { OptionEntity } from "@/utils/store";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface BackgrondProtocolMap {
    getOptions(): OptionEntity | undefined
    setOptions(data: { options: Partial<OptionEntity> }): void
    getTabInfo(): Browser.tabs.Tab

    onPageUpdated(data: { url: string | URL }): void
    onOptionsUpdated(data: { options: OptionEntity }): void
}

export const { sendMessage, onMessage } = defineExtensionMessaging<BackgrondProtocolMap>();
