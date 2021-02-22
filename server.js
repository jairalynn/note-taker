const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

const notesDB = fs.readFileSync('./db/db.json');
const notes = JSON.parse(notesDB);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.use(express.static('db'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
  
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });
  
  
  app.get("/api/notes", (req, res) => {
    return res.send(notes);
  });
  

  app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote["id"] = newNote.title + notes.length;
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    return res.json(newNote)
  
  });

  app.delete("/api/notes/:id", (req, res) => {
      const deleteId = req.params.id;
      for (const i = 0; i < notes.length; i++){
          if(notes[i].id == deleteId){
              notes.splice(i, 1);
          }
      }
      fs.writeFileSync('./db/db.json', JSON.stringify(notes));
      return res.json(notes);
  });

  app.listen(PORT, () => {
      console.log("App listening on Port" + PORT)
  });