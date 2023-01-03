const express = require('express');
const path = require('path');
const fs = require('fs');
const notesDB = require('./db/db.json');
// const util = require('util');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

const writeToFile = (destination, content) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)); 
}

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err); 
        } else {
            const parsedData = JSON.parse(data); 
            parsedData.push(content); 
            writeToFile(file, parsedData); 
        }
    })
}

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request has been received to add note`); 
    
    const { noteTitle, noteBody } = req.body; 

    if (req.body) {
        const newNote = {
            noteTitle, 
            noteBody
        }; 

        readAndAppend(newNote, './db/db.json'); 
        res.json(`Note added successfully!`);
    } else {
        res.errored(`Error in adding note`); 
    }
})