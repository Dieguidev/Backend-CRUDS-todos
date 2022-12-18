const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
app.use(express.json());

const jsonPath = path.resolve('./files/todos.json');

app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  res.send(jsonFile)
})

app.post('/tasks', async (req, res) => {
  const toDo = req.body;
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

  const lastIndex = toDoArray.length - 1;
  const newId = toDoArray[lastIndex].id + 1;
  toDoArray.push({ id: newId, ...toDo })
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));

  res.end();
});

app.put('/tasks', async (req, res) => {
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const { status, id } = req.body;
  const toDoId = toDoArray.findIndex(toDo => toDo.id === id);
  if (toDoId >= 0) {
    toDoArray[toDoId].status = status;
  }
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
  res.send('To Do actualizado')
})

app.delete('/tasks', async (req, res) => {
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const { id } = req.body;
  const toDoId = toDoArray.findIndex(toDo=>toDo.id===id);
  toDoArray.splice(toDoId, 1)
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
  res.send('To Do eliminado')
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`servidor escuchando desde ${PORT}`)
})