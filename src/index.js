const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistsRepositoryById(request, response, next){
  const { id } = request.params;

  const repositoryFound = repositories.find(repository => repository.id === id);

  if(!repositoryFound){
    return response.status(404).json({error: "Repository not found"});
  }

  request.repository = repositoryFound;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepositoryById, (request, response) => {
  const { url, title, techs} = request.body;
  const { repository } = request;

  repository.url = url;
  repository.title = title;
  repository.techs = techs;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checkExistsRepositoryById, (request, response) => {
  const { id } = request.repository;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkExistsRepositoryById, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.status(200).send(repository);
});

module.exports = app;
