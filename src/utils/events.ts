import { OptionEntity } from "@/utils/store";

export class OptionsUpdatedEvent extends CustomEvent<{ options: OptionEntity }> { }
