import { roles } from "HiveMind/Spawner/UnitTamplates";
import { roomPosToPos } from "Global/Room/RoomExtra";
import { MinerImplementation } from "../Implementations/MinerTask";
import { AddTask, RemoveTask } from "Tasks/TaskAdder";

export interface InitMinerTask extends Task<"iminer"> {
    sourceId?: string,
    pos: Pos,
}

export const InitMinerImplementation: TaskImplementation<InitMinerTask> = {
    CycleId: 0,
    name: "iminer",
    createTask() {
        this.CycleId++;
        const task = {
            sourceId: undefined,
            type: this.name,
            workerType: roles.miner,
            pos: {} as Pos,
            id: this.name + Game.time + this.CycleId,
            creep: "",
            tick: Game.time,
        }
        AddTask(task);
        return task;
    },

    taskRemoval(task) {

    },

    processTask(creep, task: InitMinerTask) {
        console.log("Initializing miner task!");
        const room = creep.room;
        if (task.sourceId) {
            const range = creep.pos.getRangeTo(task.pos.x, task.pos.y);
            if (range > 0) {
                creep.moveTo(task.pos.x, task.pos.y, { reusePath: 15 })
            } else {
                const mtask = MinerImplementation.createTask({ source: task.sourceId, creep: creep.name });
                RemoveTask(task);
                console.log(JSON.stringify(mtask));
                creep.memory.task = mtask.id;
            }
            return;
        }
        for (const sourceData of room.memory.sources) {
            console.log(JSON.stringify(sourceData));
            if (!(sourceData.miner in Game.creeps)) {
                const source = Game.getObjectById(sourceData.id) as Source;
                task.sourceId = source.id;
                let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (c: Structure) => c.structureType === STRUCTURE_CONTAINER,
                }) as any[];
                if (container.length > 0) {
                    task.pos = roomPosToPos(container[0].pos);
                } else {
                    container = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                        filter: (c: ConstructionSite) => c.structureType === STRUCTURE_CONTAINER,
                    })
                    if (container.length > 0) {
                        task.pos = roomPosToPos(container[0].pos);
                    } else {
                        const path = creep.pos.findPathTo(source, {
                            ignoreCreeps: true,
                            ignoreRoads: true,
                        });
                        const pos = path.reverse()[1];
                        console.log(JSON.stringify(path));
                        task.pos = { roomName: room.name, x: pos.x, y: pos.y };
                        const rpos = room.getPositionAt(pos.x, pos.y);
                        if (rpos) {
                            rpos.createConstructionSite(STRUCTURE_CONTAINER);
                        }
                    }
                }
                break;
            }
        }
    },

    is(task: Task<any>): task is InitMinerTask {
        return 'type' in task;
    }
}

// export class MinerImplementation implements TaskImplementation<Task<"miner">>{
//     public name: "miner";
//     public processTask(creep: Creep, task: MinerTask) {
//         const target = Game.resources[task.sourceId];
//         creep.harvest(target);
//     }
// }
