const express = require("express");
const morgan = require("morgan");

require("dotenv").config();
const Person = require("./models/phonebook");
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
app.use(express.static("build"));
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
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
  <p>${Date().toString()}</p>`);
});

app.get("/api/persons/:id", (req, res, error) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "name must exist" });
  } else if (!body.number) {
    return res.status(400).json({ error: "number must exist" });
  }
  const newPerson = { name: body.name, number: body.number };
  const person = new Person(newPerson);
  person
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const modifiedPerson = req.body;
  if (!id || !modifiedPerson.name || !modifiedPerson.number) {
    return res.status(400).end();
  }

  Person.findByIdAndUpdate(id, modifiedPerson, {
    runValidators: true,
    new: true,
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
