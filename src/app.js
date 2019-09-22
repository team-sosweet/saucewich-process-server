const express = require('express');
require('dotenv').config();
const gameRouter = require('./game');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use('/game',gameRouter);

app.listen(7000, () => {
    console.log(`server listening on 7000 port.`);
});
