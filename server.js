const express = require('express');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const path = require('path');
const { v4: uuid } = require("uuid");

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), "utf8", (err, data)=>{
        if (err) {
            console.info(err)
            res.status(500).send("Error in reading notes.")
        } else {
            res.send(data)
        }

    })
})

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

    let prevJSON = fs.readFileSync(path.join(__dirname, '/db/db.json'), "utf8")
    let allNotes = JSON.parse(prevJSON) // array
    allNotes.push(newNote)

    let newJSON = JSON.stringify(allNotes) // converts array/objects into a string in json convention
    
    fs.writeFile('/db/db.json', newJSON, (err) => {
        if (err) {
            console.info(err)
            res.status(500).send("Error in saving note.")
        } else {
            console.info(`${req.method} request received; Successfully added a new note.`);
            res.status(200).send(newNote)
        }

    });
  }
});

// Delete notes
// app.delete('/notes/:id', (req, res) => {
//     fs.readFile(path.join(__dirname, './Develop/db/db.json'), "utf8", (err, data)=>{
//         if (err) {
//             console.info(err)
//             res.status(500).send("Error in reading notes.")
//         } else {
//             res.send(data)
//         }
//     let notes = notes.JSON.parse(data);

//     })
// })


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})