import { OptionEntity } from "./store";


export class OptionsUpdatedEvent extends CustomEvent<{ options: OptionEntity}> {
}
