const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({
          erro: 'invalid project ID'
      });
  }

  const repositoryIndex= repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ erro: "repository not Found"});
  }

  response.locals.IndexId = repositoryIndex;

  console.log(response.locals.IndexId);

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

    const results = title
        ? repositories.filter(repository=> repository.title.includes(title))
        : repositories;

    return response.json(results);
});

app.post("/repositories", (request, response) => {
  const  {title, url, techs}  = request.body;

  const id = uuid();

  const likes = 0;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs}  = request.body;

  //const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //if(repositoryIndex < 0){
  //    return response.status(400).json({ erro: "repository not Found"});
  //}

  const repositoryIndex = response.locals.IndexId;

  //console.log(repositoryIndex);

  repositories[repositoryIndex] = {...repositories[repositoryIndex], title, url, techs};

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  //const { id } = request.params;

  //const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //if(repositoryIndex < 0){
  //    return response.status(400).json({ erro: "repository not Found"});
  //}
  const repositoryIndex = response.locals.IndexId;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send('Deleted');
});

app.post("/repositories/:id/like", (request, response) => {
  //const { id } = request.params;

  //const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //if(repositoryIndex < 0){
  //  return response.status(400).json({ erro: "repository not Found"});
  //}
  const repositoryIndex = response.locals.IndexId;

  const newrepository = repositories[repositoryIndex];

  newrepository.likes = newrepository.likes + 1;

  repositories.splice(repositoryIndex, 1);

  repositories.push(newrepository);

  return response.json(newrepository);
});

module.exports = app;
