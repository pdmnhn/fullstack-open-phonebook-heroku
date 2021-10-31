const express = require("express");
const morgan = require("morgan");
let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const app = express();

app.use(express.json());
morgan.token("resBody", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resBody"
  )
);

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
  <p>${Date().toString()}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((per) => per.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((per) => per.id === id);
  if (person) {
    phonebook = phonebook.filter((per) => per.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(10000 * Math.random());
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "name must exist" });
  } else if (!body.number) {
    return res.status(400).json({ error: "number must exist" });
  } else if (
    phonebook.find(
      (person) => person.name.toLowerCase() == body.name.toLowerCase()
    )
  ) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = { id, name: body.name, number: body.number };
  phonebook.push(newPerson);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
