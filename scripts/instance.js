const fs = require('fs');
const path = require('path');

const jsonParser = require('./json_parser');
const mapJson = require('./mapconfig.json');

console.log('Reading Config...');

const mapConfig = mapJson.config;
const mapParts = mapJson.parts;
const json = {
    world: {},
    entity: []
};
const config = {};
config[mapJson.name] = {};

let id = 1;

json.world = mapConfig;
json.world.id = 0;
json.world.mapversion = 0;
json.world.classname = 'worldspawn';
json.world.maxpropscreenwidth = -1;
json.camera = {
    activecamer: -1
};
json.cordon = {
    mixs: '(-1024 -1024 -1024)',
    maxs: '(1024 1024 1024)',
    active: 0
}

for (let index in mapParts) {
    const part = mapParts[index];

    if (part.use === false) continue;

    const entity = {
        id,
        classname: 'func_instance',
        angles: '0 0 0',
        file: part.path,
        fixup_style: part.fixup ? 1 : 0,
        targetname: part.fixup ? part.fixup : '',
        origin: part.origin,
        editior: {
            color: '0 255 255',
            visgroupshown: 1,
            visgroupautoshown: 1,
            logicalpos: '[0 0]'
        }
    }

    json.entity.push(entity);
    id++;

    console.log(`Instanced ${part.name}: ${part.path}`);

    config[mapJson.name][part.name] = {};

    if (part.spawns) {
        const origin = part.origin.split(' ');
        let count = 1;

        for (let i in part.spawns) {
            const spawn = part.spawns[i].split(' ');

            spawn[0] = parseFloat(spawn[0]) + parseFloat(origin[0]);
            spawn[1] = parseFloat(spawn[1]) + parseFloat(origin[1]);
            spawn[2] = parseFloat(spawn[2]) + parseFloat(origin[2]);

            config[mapJson.name][part.name][count] = spawn.join(' ');

            count++;
        }

        console.log(`Generated Spawns for ${part.name}`);
    }
}

const mapKv = jsonParser.parse(json);
const configKv = jsonParser.parse(config);

fs.writeFileSync(`${mapJson.path}/${mapJson.name}.vmf`, mapKv);
fs.writeFileSync(`${mapJson.path}/${mapJson.name}_spawns.cfg`, configKv);
console.log('Finished!');


