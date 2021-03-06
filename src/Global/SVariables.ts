import { Command } from "HiveMind/Command";
import { CreepLogister } from "Creepers/CreepLogister";
import { Dictionary } from "lodash";
import { RoomData } from "Global/Room/RoomExtra";
import { TaskRunner } from "Tasks/TaskRunner";

export const tasks = {
    mine: "mine",
    harvest: "harvest",
    withdraw: "withdraw",
    transfer: "transfer",
    linkMine: "linkMine",
}

export const bodyParts = {
    attack: ATTACK,
    heal: HEAL,
    move: MOVE,
    work: WORK,
    carry: CARRY,
    ranged_attack: RANGED_ATTACK,
    tough: TOUGH,
    claim: CLAIM,
}

export class SVariables {
    public static hive: Command;
    public static lcreeps: CreepLogister;
    public static taskRunner: TaskRunner;
    public static rooms: Dictionary<RoomData> = {};
}
