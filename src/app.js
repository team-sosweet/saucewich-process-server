const express = require('express');

const gameRouter = require('./game');

const app = express();

app.use('/game',gameRouter);

app.listen(7000, () => {
    console.log(`server listening on 7000 port.`);
});
