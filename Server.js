const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const mustache = mustacheExpress();
const bodyParser = require('body-parser');
const { Client } = require('pg');

mustache.cache = null;

app.engine('mustache', mustache);

app.set('view engine', 'mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/add', (req, res) => {
    res.render('user-form.mustache');
});
app.get('/Contact', (req, res) => {
    res.render('Contact_us.mustache');
});




app.post('/meds/add', (req, res) => {
    console.log('post body', req.body);

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {
            console.log('Connection Complete');
            const sql = 'INSERT INTO meds (name,count,brand) VALUES ($1, $2, $3)';
            const params = [req.body.name, req.body.count, req.body.brand];
            return client.query(sql, params);

        })
        .then((result) => {
            console.log('result?', result);
            res.redirect('/meds');
        });

});

// Dash board

app.get('/dashboard',(req,res)=>{

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {
           return client.query('SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds');

        })
        .then((result) => {
          console.log('?result',result[0]);
          console.log('?result',result[1]);
          res.render('dashboard.mustache',{n1:result[0].rows,n2:result[1].rows});
        });

});

app.get('/meds', (req, res) => {
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM meds');

        })
        .then((result) => {
            console.log('result?', result);
            res.render('meds.mustache', result);

        });

});

app.post('/meds/delete/:id', (req, res) => {

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {

            const sql = 'DELETE FROM meds WHERE m_id=$1';
            const params = [req.params.id];
            return client.query(sql, params);
        })
        .then((result) => {
            res.redirect('/meds');
        });

});

app.get('/meds/edit/:id', (req, res) => {


    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {

            const sql = 'SELECT * FROM meds WHERE m_id=$1';
            const params = [req.params.id];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log('result?', result);
            res.render('meds-edit', { med: result.rows[0] });
        });
});

app.post('/meds/edit/:id', (req, res) => {

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '12345678',
        port: 5432,

    });
    client.connect()
        .then(() => {

            const sql = 'UPDATE meds SET name=$1 , count=$2 , brand=$3 WHERE m_id=$4';
            const params = [req.body.name, req.body.count, req.body.brand, req.params.id];
            return client.query(sql, params);
        })
        .then((result) => {
            console.log('result?', result);
            res.redirect('/meds');
        });
});

app.listen(5001, () => {
    console.log('Listening to port 5001.');
})