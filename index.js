// EXERCISES 3.1 - 3.6: base server
const express = require("express");
const app = express();

//  EXERCISE 3.7: import morgan (installed with: npm install morgan)
const morgan = require("morgan");

//  EXERCISE 3.8*: custom token that returns the request body
// Only POST requests carry data, so for other methods return an empty string
morgan.token("body", (request) =>
  request.method === "POST" ? JSON.stringify(request.body) : "",
);

//  EXERCISE 3.5: JSON parser
// Must come BEFORE morgan, otherwise request.body is undefined when morgan reads it
app.use(express.json());

// CHANGED for EXERCISE 3.11: serve the frontend production build
// Express looks for files (index.html, assets/...) in the "dist" folder first.
// "dist" is the folder created by `npm run build` in the frontend and copied here.
app.use(express.static("dist"));

//  EXERCISE 3.7 + 3.8*: morgan middleware
// 3.7 (tiny):  app.use(morgan("tiny"));
// 3.8 (tiny + body): the format below is "tiny" plus :body
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// EXERCISE 3.1: hardcoded data
let persons = [
  { id: "1", name: "Hira Khan", number: "040-123456" },
  { id: "2", name: "Ada Angela", number: "39-44-5323523" },
  { id: "3", name: "Danny John", number: "12-43-234345" },
  { id: "4", name: "Mary Poppy", number: "39-23-6423122" },
  { id: "5", name: "IAN Johny", number: "37-63-2223399" },
];

// EXERCISE 3.5: random id generator
const generateId = () => String(Math.floor(Math.random() * 1000000000));

//  EXERCISE 3.1: get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// EXERCISE 3.2: info page
app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

// EXERCISE 3.3: get a single person
app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id === request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//  EXERCISE 3.4: delete a person
app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((p) => p.id !== request.params.id);
  response.status(204).end();
});

//  EXERCISES 3.5 + 3.6: add a person with validation
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // 3.6: name or number missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  // 3.6: name must be unique
  if (persons.some((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({ error: "name must be unique" });
  }

  // 3.5: create and save
  const person = { id: generateId(), name: body.name, number: body.number };
  persons = persons.concat(person);
  response.json(person);
});

// CHANGED for EXERCISE 3.10: deployment
// Render tells the app which port to use through process.env.PORT.
// On your computer that variable doesn't exist, so it falls back to 3001.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
