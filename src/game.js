const express = require('express');
const request = require('request');
require('dotenv').config();
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

const router = express.Router();

const processList = {};
const portList = {};
// exec version
// const process = function() {
//     console.log('run game server process');
//     exec('C:/WindowsServer/SaucewichServer.exe -log', (err,data)=>{
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(data.toString());
//         }
//     })
// };

requestCrash = function(port) {
    return new Promise((resolve, reject)=>{
        request.get(`${process.env.MAIN_SERVER}${port}`, (err, response, body)=>{
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
};

// spawn version
const processing = async function() {
    console.log('processing game server');
    const client = await spawn('C:/WindowsServer/SaucewichServer.exe');
    processList[client.pid] = client;
    console.log(client.pid);

    client.stdout.on('data', (data)=>{
        console.log('stdout : '+data);
    });

    client.stderr.on('data', (data)=>{
        console.log('stderr : '+data);
    });

    client.on('exit', async (code)=>{
        console.log('exit: '+ client.pid);
        delete processList[client.pid];
        console.log('port: '+ portList[client.pid]);
        await requestCrash(portList[client.pid]);
        delete portList[client.pid];
    });
};

router.get('/process', async (req, res, next)=>{
  await processing();
  res.json({success: true});
});

router.post('/port/:pid', async (req, res, next)=>{
    const pid = req.params.pid;
    const port = req.body.port;
    portList[pid] = port;
    res.json({pid: pid, port: portList[pid]});
    //test[pid].kill();
});

module.exports = router;
