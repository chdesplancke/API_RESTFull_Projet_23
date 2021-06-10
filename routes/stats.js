const express = require('express'),
    router = express.Router(),
    config = require('../config'),
    db = require('../database');


router.post('/', (req, res) => {
    const
        data = [],
        yesterday = new Date(),
        today = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    console.log(req.body.userId);
    console.log(yesterday.toISOString().slice(0, 10));
    console.log(today.toISOString().slice(0, 10));
    db.getConnection((err, conn) => {
        conn.query("SELECT " +
            "AVG(sht.hum) AS air_humidity_average, " +
            "MIN(sht.hum) AS air_humidity_min, " +
            "MAX(sht.hum) AS air_humidity_max, " +
            "COUNT(sht.hum) AS air_humidity_count, " +
            "AVG(sht.temp) AS temperature_average, " +
            "MIN(sht.temp) AS temperature_min, " +
            "MAX(sht.temp) AS temperature_max, " +
            "COUNT(sht.temp) AS temperature_count, " +
            "AVG(sen.hum) AS soil_moisture_average, " +
            "MIN(sen.hum) AS soil_moisture_min, " +
            "MAX(sen.hum) AS soil_moisture_max, " +
            "COUNT(sen.hum) AS soil_moisture_count, " +
            "AVG(tsl.light) AS light_average, " +
            "MIN(tsl.light) AS light_min, " +
            "MAX(tsl.light) AS light_max, " +
            "COUNT(tsl.light) AS light_count " +
            "FROM dfrobot_sht20 sht " +
            "INNER JOIN modules m on sht.module_id = m.id " +
            "INNER JOIN dfrobot_sen0308 sen on sht.date = sen.date " +
            "INNER JOIN adafruit_tsl2591 tsl on sht.date = tsl.date " +
            "WHERE m.owner_id = ? " +
            "AND sht.date >= '2021-05-08' " +
            "AND sht.date < '2021-05-09'",
            [req.body.userId],
            //[req.body.userId, yesterday.toISOString().slice(0, 10), today.toISOString().slice(0, 10)],
            (error, results) => {
                conn.release();
                console.log(error);
                if (error) return res.status(500).send('Erreur interne');
                if (!results[0]) return res.status(404).send('Il n\'y a aucune données');
                res.status(200).send(results[0]);
            });
    });
});

router.post('/month/:sensor/:data', (req, res) => {

});

module.exports = router;