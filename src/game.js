const express = require('express');
const exec = require('child_process').exec;

const router = express.Router();

const process = function() {
    console.log('run game server process');
    exec('C:/WindowsServer/SaucewichServer.exe -log', (err,data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data.toString());
        }
    })
};

router.get('/process', async (req, res, next)=>{
  await process();
  res.json({success: true});
});

module.exports = router;