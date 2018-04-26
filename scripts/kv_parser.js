let json = {}, currentJson, currentName, objectStack = [], nameStack = [];

const regex = {
    property: /"(.*?)"\s+"(.*?)"/
};

function parseLine(line) {
    if (regex.property.test(line)) {
        const property = line.match(regex.property, 'g');

        currentJson[property[1]] = property[2];
    } else if (line === '{') {
        currentJson = {};

        objectStack.push(currentJson);
        nameStack.push(currentName);
    } else if (line === '}') {
        const data = objectStack.pop();
        const name = nameStack.pop();
        let last = objectStack[objectStack.length - 1];

        for (let i in currentJson) {
            data[i] = currentJson[i];
        }
        currentJson = {};

        if (last) {
            last = add(last, name, data);
        } else {
            json = add(json, name, data);
        }
    } else {
        currentName = line.replace(/\"/g, '');
    }
}

function add(object, name, value) {
    if (object.hasOwnProperty(name)) {
        if (!(object[name] instanceof Array)) {
            const temp = object[name];
            object[name] = [];
            object[name].push(temp);
        }

        object[name].push(value);
    } else {
        object[name] = value;
    }

    return object;
}

function parse(kv) {
    json = {};
    currentJson = {};
    currentName = "";
    objectStack = [];
    nameStack = [];

    const lines = kv.split('\n');

    for (let i in lines) {
        parseLine(lines[i].trim());
    };

    return json;
}

exports.parse = parse;