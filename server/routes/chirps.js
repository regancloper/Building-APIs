const express = require('express');
const chirpsStore = require('../utils/chirpstore');
let router = express.Router();

router.get('/:id?', (req, res) => {
    let id = req.params.id;
    if (id) {
        res.json(chirpsStore.GetChirp(id));
    } else {
        res.send(chirpsStore.GetChirps());
    }
});

router.post('/', (req, res) => {
    const chirp = req.body;
    chirpsStore.CreateChirp(chirp);
    res.sendStatus(200);
});


router.put('/:id', (req, res) => {
    let id = req.params.id;
    const chirp = req.body;
    chirpsStore.UpdateChirp(id, chirp);
    res.sendStatus(200);
});


router.delete('/:id', (req, res) => {
    let id = req.params.id;
    chirpsStore.DeleteChirp(id);
    res.sendStatus(200);
});

module.exports = router;

