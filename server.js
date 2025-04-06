// Loads the express module
const express = require("express");
const hbs = require("hbs");

const bodyParser = require("body-parser");

const path = require("path");

//Creates our express server
const app = express();
const port = 3000;

//Serves static files (we need it to import a css file)
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));

//Sets a basic route

// Render the initial page with the guestCount input form
app.get("/", (req, res) => {
  res.render("index");
});

// Create express route binder for draw.hbs and get the data from the url as parameters
// that came from index.hbs
app.post('/happy', (req, res) => {
  let {name, sex, guestCount} = req.body; // catch name, sex, guestCount
  let guests = [];
  let singers = [];

  // collect singing guests
  for (let i=0; i<guestCount; i++) { // data collection based on guestCount
    let guest = req.body[`name${i+1}`] || ""; // collect guest names based on inputs
    let attendance = req.body[`checkbox${i+1}`] ? 0 : 1; // attendance status based on checkbox

    guests.push({ guest, attendance }); // guests' data

    if (attendance == 1){
      singers.push(guest); // add attending guest to singers 
    }
  }

  // set lyric details
  let pronoun = sex === "male" ? "he's" : sex === "female" ? "she's" : "they're"; // pronoun based on sex

  let jollyLyrics = `For,${pronoun},a,jolly,good,fellow.,
                     For,${pronoun},a,jolly,good,fellow.,
                     For,${pronoun},a,jolly,good,fellow,,
                     which,nobody,can,deny!`; // ,, is for pause
    
  let hbdLyrics = [ // full lyrics
    "Happy", "birthday", "to", "you.",
    "Happy", "birthday", "to", "you.",
    "Happy", "birthday", "dear", `${name}.`,
    "Happy", "birthday", "to", "you!", jollyLyrics,
  ];
  
  let lyrics = hbdLyrics.map((word, i) => ({ // full lyrics assigned to singers
    singer: singers[i%singers.length] || "Singer", word,
  }));

  res.render("happy", { name, sex, guestCount, guests, lyrics, formData: req.body});
});

app.get("/happy", (req, res) => {
  res.render("happy", { name: "", sex: "", guestCount: 0, guests: [], lyrics: [] });
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
