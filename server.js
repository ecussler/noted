const express = require('express');
const path = require('path');
const fs = require('fs');
const notesDB = require('./db/db.json');
const util = require('util');
const uuid = require('./helpers/uuid'); 

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


// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile); 


/**
 * Function to write input into the set file
 * @param {*} destination destination of the information (typically the database)
 * @param {*} content content of note
 */

const writeToFile = (destination, content) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)); 
}


/**
 * Function to read database information and append new data
 * @param {*} content content to be written read and appended to the database array
 * @param {*} file where to read and append data
 */

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


// POST request to add notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request has been received to add note`); 
    
    const { title, text } = req.body; 

    if (req.body) {
        const newNote = {
            title, 
            text, 
            id: uuid()
        }; 
        console.log(newNote); 
        readAndAppend(newNote, './db/db.json'); 
        res.json(`Note added successfully!`);
    } else {
        res.errored(`Error in adding note`); 
    }
})


// GET request to populate saved notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`); 
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))); 
});