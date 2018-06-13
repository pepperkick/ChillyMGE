function parse(json) {
    kv = '';

    for (let index in json) {
        if (json[index] instanceof Array) {
            for (let i in json[index]) {
                kv += `"${index}" \n{\n`;
                kv += parse(json[index][i]);
                kv += "}\n";
            }
        } else if (json[index] instanceof Object) {
            kv += `"${index}" \n{\n`;
            kv += parse(json[index]);
            kv += "}\n";
        } else {
            kv += '\"' + index + '\" \"' + json[index] + '\"\n';
        }
    }

    return kv;
}

exports.parse = parse;