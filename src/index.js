const express = require("express");
const server = express();

server.listen(3000);
server.use(express.json());

const projects = [];
let countRequest = 0;


//middleware count request
server.use((req, res, next) => {
  countRequest++;
  console.log(`${countRequest} requisições foram realizadas!`);
  return next();
});

//middleware verify if exists project
function existsProject(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => id === p.id);

  if(!project) {
    return res.status(400).json({ error: "Project do not found!" });
  }

  return next();
}

//return all projects
server.get('/projects', (req, res) => {
  return res.json({ projects });
});

//add a project without task
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json({ project });
});

//update title of project
server.put('/projects/:id', existsProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json({ project });
});

//delete a project
server.delete('/projects/:id', existsProject, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  projects.splice(project, 1);

  return res.status(200).send();
});

//add task in project
server.post('/projects/:id/tasks', existsProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectId = projects.findIndex(p => p.id === id);

  projects[projectId].tasks.push(title);

  return res.json(projects);
});