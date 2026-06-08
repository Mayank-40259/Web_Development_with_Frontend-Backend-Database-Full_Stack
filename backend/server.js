const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS मिडलवेयर इनेबल करें ताकि आपका फ्रंटएंड कनेक्ट हो सके
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// .env फाइल से वैल्यूज लेकर MySQL डेटाबेस कनेक्शन बनाना
// .env फाइल से वैल्यूज लेकर MySQL डेटाबेस कनेक्शन पूल बनाना

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mayank@BCA',
    database: process.env.DB_NAME || 'portfolio_db',
    port: process.env.DB_PORT || '3306',
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Error: ' + err.message);
        return;
    }
    console.log('MySQL Database Connected Successfully on Localhost!');
});

// डिफ़ॉल्ट रूट
app.get('/', (req, res) => {
    res.json({ message: "Node.js Server is running successfully!" });
});

// फॉर्म सबमिशन एक्सेप्ट करने के लिए POST API रूट
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "सभी फील्ड्स भरना अनिवार्य है।" });
    }

    // टेबल का नाम बदलकर 'contact_messages' किया जो MySQL में बनेगी
    const sqlQuery = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
    db.query(sqlQuery, [name, email, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, message: "डेटाबेस में सेव हो गया!" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));

module.exports = app;
