const express = require('express'),
    router = express.Router(),
    config = require('../config'),
    db = require('../database');

router.post('/:sensor/:number', (req, res) =>{
    const
        number = req.params.number,
        sensor = req.params.sensor;
    if(config.table.indexOf(sensor) === -1){
        return res.status(400).end("Invalid sensor " + sensor + " from " + req.originalUrl);
    }
    if(number === "yesterday"){
        const date = new Date();
        date.setDate(date.getDate() - 1);
        db.getConnection((err, conn) => {
            conn.query(
                'SELECT * FROM ?? INNER JOIN modules m on ??.module_id = m.id WHERE date >= ? AND m.owner_id = ? ORDER BY date DESC',
                [sensor, sensor, date, req.body.userId],
                (error, results) => {
                    conn.release();
                    if (error) return res.status(500).send('Erreur interne');
                    if (!results[0]) return res.status(404).send('Il n\'y a aucune données');
                    res.status(200).send(results);
                });
        });
    }
    else if(number === 'latest'){
        db.getConnection((err, conn) => {
            conn.query(
                'SELECT * FROM ?? INNER JOIN modules m on ??.module_id = m.id WHERE m.owner_id = ? ORDER BY date DESC LIMIT 1',
                [sensor, sensor, req.body.userId],
                (error, results) => {
                    conn.release();
                    if (error) return res.status(500).send('Erreur interne');
                    if (!results[0]) return res.status(404).send('Il n\'y a aucune données');
                    res.status(200).send(results[0]);
                });
        });
    }else if(typeof number != 'number' && !isNaN(number)){
        db.getConnection((err, conn) => {
            conn.query(
                'SELECT * FROM ?? INNER JOIN modules m on ??.module_id = m.id WHERE m.owner_id = ? ORDER BY date DESC LIMIT ?',
                [sensor, sensor, req.body.userId, Number(number)],
                (error, results) => {
                    conn.release();
                    if (error) return res.status(500).send('Erreur interne');
                    if (!results[0]) return res.status(404).send('Il n\'y a aucune données');
                    res.status(200).send(results);
                });
        });
    }else{
        return res.status(400).end("Invalid parameter " + number + " from " + req.originalUrl);
    }
})

module.exports = router;