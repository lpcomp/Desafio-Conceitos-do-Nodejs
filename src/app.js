const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository id.' })
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexReposity = repositories.findIndex(repository => repository.id === id);

  if (indexReposity < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[indexReposity] = repository;

  return response.json(repository);  
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const indexReposity = repositories.findIndex(repository => repository.id === id);

  if (indexReposity < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(indexReposity, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const indexReposity = repositories.findIndex(repository => repository.id === id);

  if (indexReposity < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const { title, url, techs } = repositories[indexReposity];
  let { likes } = repositories[indexReposity];
  likes++;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[indexReposity] = repository;

  return response.json(repository);
});

module.exports = app;
