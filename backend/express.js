// Start the server
const express = require('express');
const cors = require('cors')
const app = express();
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Middleware to parse JSON data
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}))
app.use(cors(
    {
    origin: true,
    credentials: true
    }
));

const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'graphiccards'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});



// GET route to fetch all graphic cards
app.get('/graphiccards', (req, res) => {
    connection.query('SELECT * FROM graphicCards', (err, results) => {
        if (err) {
            console.error('Error fetching graphic cards:', err);
            res.status(500).send('Error fetching graphic cards');
        } else {
            res.json(results);
        }
    });
});

// GET route to fetch a graphic card by ID
app.get('/graphiccards/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM graphicCards WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error('Error fetching graphic card:', err);
            res.status(500).send('Error fetching graphic card');
        } else if (results.length === 0) {
            res.status(404).send('Graphic card not found');
        } else {
            res.json(results[0]);
        }
    });
});

// POST route to create a new graphic card
app.post('/graphiccards', (req, res) => {
    const { name, price, imgsrc } = req.body;
    const newGraphicCard = {
        name,
        price,
        imgsrc
    }; connection.query('INSERT INTO graphicCards SET ?', newGraphicCard, (err, result) => {
        if (err) {
            console.error('Error inserting graphic card:', err);
            res.status(500).send('Error inserting graphic card');
        } else {
            console.log('New graphic card inserted:', result.insertId);
            res.status(201).send('New graphic card inserted');
        }
    });
});

// PUT route to update a graphic card by ID
app.put('/graphiccards/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, imgsrc } = req.body;
    const updatedGraphicCard = {
        name,
        price,
        imgsrc
    };

    connection.query('UPDATE graphicCards SET ? WHERE id = ?', [updatedGraphicCard, id], (err, result) => {
        if (err) {
            console.error('Error updating graphic card:', err);
            res.status(500).send('Error updating graphic card');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Graphic card not found');
        } else {
            console.log('Graphic card updated:', id);
            res.status(200).send('Graphic card updated');
        }
    });
});

// DELETE route to delete a graphic card by ID
app.delete('/graphiccards/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM graphicCards WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error deleting graphic card:', err);
            res.status(500).send('Error deleting graphic card');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Graphic card not found');
        } else {
            console.log('Graphic card deleted:', id);
            res.status(200).send('Graphic card deleted');
        }
    });
});

// Close the database connection when the server is closed
app.on('close', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
});



