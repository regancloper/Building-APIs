const express = require('express');
const apiRouter = require('./routes');

let app = express();

app.use(express.json());
app.use(express.static('client'));

app.use('/api', apiRouter);


app.listen(3000, () => console.log('Running on port 3000!'));