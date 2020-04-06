const fs = require('fs');
const exec = require('child_process').exec;

const config = require('./mapconfig.json');
const parts = config.parts;
const path = `"I:/Games/steamapps/common/Team Fortress 2/tf/maps`;

const data = [[
    "name",
    "models",
    "brushes",
    "brushsides",
    "planes",
    "vertexes",
    "nodes",
    "texinfos",
    "texdata",
    "faces",
    "waterindices",
    "dispinfos"
]];
const total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const flags = [];


for (let i in parts) {
    const part = parts[i];
    const name = part.name;
    const file = path + '/' + part.path.split('/')[2].split('.')[0] + '.bsp"';
	
    console.log(file);

    if (!part.use) {
        flags.push(true)
        continue;
    }

    flags.push(false);

    exec(`vbspinfo.exe -treeinfo ${file}`, (error, stdout, stderr) => {
        const stats = [
            part.name
        ]

        stats.push(/models\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/brushes\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/brushsides\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/planes\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/vertexes\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/nodes\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/texinfos\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/texdata\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/faces\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/waterindices\s+(.*?)\//.exec(stdout)[1]);
        stats.push(/dispinfos\s+(.*?)\//.exec(stdout)[1]);

        stats[1] += ` (${((parseInt(stats[1]) / 1024) * 100).toFixed(1)}%)`
        stats[2] += ` (${((parseInt(stats[2]) / 8192) * 100).toFixed(1)}%)`
        stats[3] += ` (${((parseInt(stats[3]) / 65536) * 100).toFixed(1)}%)`
        stats[4] += ` (${((parseInt(stats[4]) / 65536) * 100).toFixed(1)}%)`
        stats[5] += ` (${((parseInt(stats[5]) / 65536) * 100).toFixed(1)}%)`
        stats[6] += ` (${((parseInt(stats[6]) / 65536) * 100).toFixed(1)}%)`
        stats[7] += ` (${((parseInt(stats[7]) / 12288) * 100).toFixed(1)}%)`
        stats[8] += ` (${((parseInt(stats[8]) / 2048) * 100).toFixed(1)}%)`
        stats[9] += ` (${((parseInt(stats[9]) / 65536) * 100).toFixed(1)}%)`
        stats[10] += ` (${((parseInt(stats[10]) / 65536) * 100).toFixed(1)}%)`
        stats[11] += ` (${((parseInt(stats[11]) / 2048) * 100).toFixed(1)}%)`

        for (let j = 1; j < 12; j++) {
            total[j] += parseInt(stats[j]);
        }

        data.push(stats);
        flags[i] = true;

        for (let j in flags) {
            if (!flags[j]) return;
        }

        calculate();
        writeTable();
    });
}

function calculate() {
    const stats = [
        "Total",
    ]

    for (let i = 1; i < 12; i++) {
        stats.push(total[i]);
    }

    stats[1] += ` (${((parseInt(stats[1]) / 1024) * 100).toFixed(1)}%)`
    stats[2] += ` (${((parseInt(stats[2]) / 8192) * 100).toFixed(1)}%)`
    stats[3] += ` (${((parseInt(stats[3]) / 65536) * 100).toFixed(1)}%)`
    stats[4] += ` (${((parseInt(stats[4]) / 65536) * 100).toFixed(1)}%)`
    stats[5] += ` (${((parseInt(stats[5]) / 65536) * 100).toFixed(1)}%)`
    stats[6] += ` (${((parseInt(stats[6]) / 65536) * 100).toFixed(1)}%)`
    stats[7] += ` (${((parseInt(stats[7]) / 12288) * 100).toFixed(1)}%)`
    stats[8] += ` (${((parseInt(stats[8]) / 2048) * 100).toFixed(1)}%)`
    stats[9] += ` (${((parseInt(stats[9]) / 65536) * 100).toFixed(1)}%)`
    stats[10] += ` (${((parseInt(stats[10]) / 65536) * 100).toFixed(1)}%)`
    stats[11] += ` (${((parseInt(stats[11]) / 2048) * 100).toFixed(1)}%)`

    data.push(stats);
}

function writeTable() {
    let body = "<table border='1'>";

    for (let i in data) {
        const row = data[i];

        body += "<tr>";

        for (let j in row) {
            body += "<td>" + row[j] + "</td>";
        }

        body += "</tr>";
    }

    body += "</table>";

    const html = `<html><body>${body}</body></html>`;

    fs.writeFileSync('mapstats1.html', html);

    console.log('Finished!');
}


