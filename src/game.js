const express = require('express');
const exec = require('child_process').exec;

const router = express.Router();

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

// spawn version
const process = function() {
    console.log('processing game server');
    const client = spawn('C:/WindowsServer/SaucewichServer.exe -log');

    client.stdout.on('data', (data)=>{
        console.log('stdout : '+data);
    });

    client.stderr.on('data', (data)=>{
        console.log('stderr : '+data);
    });

    client.on('exit', (code)=>{
        console.log('exit: '+ code);
    });
};

router.get('/process', async (req, res, next)=>{
  await process();
  res.json({success: true});
});

module.exports = router;
