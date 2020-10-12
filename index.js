function sendudp() {
    const dgram = require('dgram');
    var client = dgram.createSocket('udp4');
    var data = Buffer.from('fine ciclo');
    client.send(data, 5000, '192.168.0.129', function(error) {
      if (error) {
        client.close();
      } else {
        console.log('Data sent!!!');
      }
    });
}

function receiveudp() {
    const dgram = require('dgram');
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        return msg;
    });

    server.on('listening', () => {
        var address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(31313);
}

function main(isInit) {
    const ioclient = require('socket.io-client');
    const http = require('http');

    const { executeCmd } = require(__dirname + '/modules/commands.js');
    const { config } = require(__dirname + '/config/config.js');

    let infoDebug = {"error-chromiumcrashed": null, "error-pageerror": null, "error-requestfailed": null, "console": []}
    var fileRead = false;
    var configSaved = {};
    
    let machineName = "brightsign";
    let centrale = ioclient(config.centrale);

    var registryClass = require("@brightsign/registry");
    var registry = new registryClass();

    centrale.on('config', function (dataArr) {
        console.log(dataArr, `from central`);
        configSaved = dataArr;

        registry.write({"appdata": dataArr}).then( function(){
            console.log("Write Successful");
            if (isInit) {
                openAppAndServer();
            }
        });
    });

    centrale.on('connect_error', function() {
        console.log("CONNECTION ERROR");
        if(fileRead == false) {
            registry.read("appdata").then(function(registry){
                console.log(JSON.stringify(registry));
                configSaved = registry;
                if (isInit) {
                    openAppAndServer();
                }
            });
        }
    });

    centrale.on('cmd', function(cmd) {
        executeCmd(cmd);
    });

    function openAppAndServer() {
        let server = http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Listening to port: ' + config.port);
            res.write('Config: ' + configSaved.app);
            res.write('Node version ' + Number(process.version.match(/^v(\d+\.\d+)/)[1]));
            res.end();
        });

        server.listen(config.port, function() {
            console.log("callback listen");        
        });

        console.log("APP DA APRIREEEEEEE", configSaved.app);

        //location.href = __dirname + configSaved.app + "\\layout\\index.html";
        location.href = __dirname + configSaved.app + "\\layout\\index.html";
    }

    function emitPeriferica() {
        var registryClass = require("@brightsign/registry");
        var registry = new registryClass();

        registry.read().then(function(registry) {
            let name = registry.networking.un;
            global.name = name;
            console.log("NAME", name);

            centrale.emit('periferica', {machineName: machineName, name: name, infoDebug: infoDebug});
        });
    }

    centrale.on('connect', function () {
        console.log(`connected to central`);
        emitPeriferica();
    });

    centrale.on('disconnect', function () {
        console.log(`disconnected from central`);
    });
}

function interno() {
    const { config } = require(__dirname + '/config/config.js');

    const ioclient = require('socket.io-client');
    let centrale = ioclient(config.centrale);

    centrale.on('config', function (dataArr) {
        console.log(dataArr, `from central`);
    });

    centrale.on('connect', function () {
        console.log(`connected to central`);
        emitPeriferica2();
    });

    function emitPeriferica2() {
        let machineName = "brightsign";
        let name = global.name;

        let infoDebug = {"error-chromiumcrashed": null, "error-pageerror": null, "error-requestfailed": null, "console": []}
        centrale.emit('periferica', {machineName: machineName, name: name, infoDebug: infoDebug});
    }
}

function provaprint() {
    console.log('una prova del print, vedo la funzione?');
}

window.main = main;
window.interno = interno;
window.sendudp = sendudp;
window.receiveudp = receiveudp;
window.provaprint = provaprint;