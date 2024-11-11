const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "high" },
  { id: 2, task: "Build a REST API", completed: false, priority: "high"}
];


app.get('/todos', (req, res) => {
    const filter = req.query.completed;
    if(filter !== undefined) {
        const completeFilter = filter === 'true';
        const filteredTodos = todos.filter(todo => todo.completed === completeFilter);
        res.json(filteredTodos);
    } else {
        res.json(todos);
    }
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
    const priority = req.body.priority || 'medium'
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        completed: false,
        priority: priority
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/complete-all', (req, res) => {
    todos.map(todo => {
        todo.completed = true;
    });
    res.json(todos);
});


// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  res.json(todo);
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});