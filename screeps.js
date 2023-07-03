//const upgraderCreepBehavior = require('creep');
//const spawnChargerCreepBehavior = require('spawnCharger');

module.exports.loop = function () {
    const spaxn=Game.spawns['Spawn1']
  //creeps that will upgrade controller ,array of N numbers 
   Array.from(Array(31).keys()).forEach(el=>{
        const name='upgradsaerCreep'+el
        let upgraderCreep=Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, { memory: {role:'controller upgrader'}});
        //find upgraderCreep if exist
        if(upgraderCreep==ERR_NAME_EXISTS) 
            upgraderCreep=Game.creeps[name]
        upgraderCreepBehavior(upgraderCreep)
    })
    //To keep Spawn able to spawn and re-spawn creeps 
    //we need to make sure Spawn has always enough energy
    //we create 5 creeps responsible of charging the Spawn
   Array.from(Array(5).keys()).forEach(el=>{
        const name='spawnupgradsaerCreep'+el
        let upgraderCreep=Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name,{ memory: {role:'Spawn1 charger'}});
        //find upgraderCreep if exist
        if(upgraderCreep==ERR_NAME_EXISTS) 
            upgraderCreep=Game.creeps[name]
       spawnChargerCreepBehavior(upgraderCreep,spawn)
    })

}


 const upgraderCreepBehavior=function (upgraderCreep) {
        if (!upgraderCreep || !upgraderCreep.pos) return;
        const currentRoom = upgraderCreep.room;
        const controller=currentRoom.controller
        const closest_source=upgraderCreep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        const src_distance=upgraderCreep.pos.getRangeTo(closest_source)
        const ctrl_distance=upgraderCreep.pos.getRangeTo(controller)
        const creep_energy=upgraderCreep.store[RESOURCE_ENERGY]
        //check if upgraderCreep has eneregy
        if(creep_energy < upgraderCreep.store.getCapacity() && (ctrl_distance>src_distance||creep_energy==0)){
            upgraderCreep.say('need power')
            //search for sources with active energy
            //find the closest one
            if(src_distance>1){
                upgraderCreep.say('to src')
                upgraderCreep.moveTo(closest_source)
                return;
            }
            upgraderCreep.say('harvest')
            upgraderCreep.harvest(closest_source)
            return;
        }
        //if full energy and creep is far from controller
        if(ctrl_distance>3){
         upgraderCreep.say('to Ctrl')
         upgraderCreep.moveTo(controller)
         return;
        }
        upgraderCreep.upgradeController(controller)
}

const spawnChargerCreepBehavior = function(spawnChargerCreep, spawn) {
  if (!spawnChargerCreep || !spawnChargerCreep.store) return;
  const creepEnergy = spawnChargerCreep.store.getUsedCapacity(RESOURCE_ENERGY);
  //check if creep still have available capacity
  if (creepEnergy < spawnChargerCreep.store.getCapacity()) {
    const closestSource = spawnChargerCreep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (closestSource) {
      if (spawnChargerCreep.pos.isNearTo(closestSource)) {
        spawnChargerCreep.harvest(closestSource);
      } else {
        spawnChargerCreep.moveTo(closestSource);
      }
    }
  } else {
    if (spawnChargerCreep.pos.isNearTo(spawn)) {
      spawnChargerCreep.transfer(spawn, RESOURCE_ENERGY);
    } else {
      spawnChargerCreep.moveTo(spawn);
    }
  }
};