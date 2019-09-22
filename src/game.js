const express = require('express');
const request = require('request');
require('dotenv').config();
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const redisClient = require('./redisSetting');
const {getValue, deleteKey} = require('./redisUtil');

const router = express.Router();

const portList = {};

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
    //const client = await spawn('C:/windows/system32/notepad.exe');
    console.log(client.pid);

    client.stdout.on('data', (data)=>{
        console.log('stdout : '+data);
    });

    client.stderr.on('data', (data)=>{
        console.log('stderr : '+data);
    });

    client.on('exit', async (code)=>{
        console.log('exit: '+ client.pid);
        const port = await getValue('process', client.pid);
        console.log('port: '+ port);
        await requestCrash(port);
        console.log(await deleteKey('process', client.pid));
    });
};

router.get('/process', async (req, res, next)=>{
  await processing();
  res.json({success: true});
});

router.post('/port/:pid', async (req, res, next)=>{
    const pid = req.params.pid;
    const port = req.body.port;
    await redisClient.hset('process', pid, port);
    //portList[pid] = port;
    res.json({pid: pid, port: port});
});

module.exports = router;
