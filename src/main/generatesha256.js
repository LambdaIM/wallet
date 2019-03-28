var crypto = require("crypto");

export default function (data) {

    let hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();

}