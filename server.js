const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

//Changed for provided railways port
const port = process.env.PORT || 4080;

app.use(bodyParser.json());
app.use(cors());

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (username TEXT, password TEXT)");

    const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
    stmt.run("admin", "admin123");
    stmt.finalize();
});

app.post('/inject', (req, res) => {
    const { query } = req.body;
    console.log('Received query:', query);
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("An error occurred with the executed query:", err.message);
            res.status(500).send(err.message);
        } else {
            console.log("Executed query was a success and returned: " + res.send(rows));
            res.send(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});