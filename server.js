// Include framework/packages/module required for this application 
const express = require('express');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3000; // Sets the port for the web server to listen on 
const path = require('path');
const { v4: uuid } = require("uuid");

// Middleware to serve the static file and parse incoming requests
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves up the index.html file when the user hits root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Serves up the notes.html file when the user hits /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Retrieve all notes saved in the db.json file
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), "utf8", (err, data)=>{
        if (err) {
            console.error(err)
            res.status(500).send("Error in reading notes.")
        } else {
            res.send(data)
        }

    })
})

// Create a new note
app.post('/api/notes', (req, res) => {
  
  const title = req.body.title;
  const text = req.body.text;

  console.log([title,text])

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(), //assigns a unique id to each note
    };

    let prevJSON = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf8")
    let allNotes = JSON.parse(prevJSON) // Converts previously saved notes to array
    allNotes.push(newNote) // Adds in the new note to the notes array
    
    // Converts the array back into string
    let newJSON = JSON.stringify(allNotes) 
    
    fs.writeFile('./db/db.json', newJSON, (err) => {
        if (err) {
            console.error(err)
            res.status(500).send("Error in saving note.")
        } else {
            console.info(`${req.method} request received; Successfully added a new note.`);
            res.status(200).send(newNote)
        }

    });
  }
});

// Listens on the defined port for any connections
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})