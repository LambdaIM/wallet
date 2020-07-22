var fs = require('fs')
var os = require('os')
var package = require('./package.json')



var platform = os.platform();

var name = package.build.productName;
var version =package.version;
var oldPath ;
var newPath = ''
var newname=name.split(' ').join('-');
if(platform=='darwin'){
    oldPath =`./build/${name}-${version}.dmg`;
    newPath =`./build/${newname}-${version}.dmg`;
}else{
    oldPath =`./build/${name} Setup ${version}.exe`;
    newPath =`./build/${newname}-Setup-${version}.exe`;
}


// win Lambda Wallet Setup 0.5.56.exe
// mac Lambda Wallet-0.5.56.dmg
var haveold = fs.existsSync(oldPath)

// fs.renameSync(oldPath, newPath)
console.log(haveold)
if(haveold){
    fs.renameSync(oldPath, newPath)
}else{
    console.log('文件不存在')
}