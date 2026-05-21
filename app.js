const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tododb';
mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// Serve simple HTML UI
app.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  const items = todos.map(t =>
    `<li style="margin:8px 0">${t.task}
       <form method="POST" action="/delete/${t._id}" style="display:inline">
         <button type="submit" style="margin-left:10px;color:red;border:none;background:none;cursor:pointer">✕</button>
       </form>
     </li>`
  ).join('');

  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Todo App – Fiza Maheen</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; }
    h1  { color: #2E75B6; }
    input[type=text] { width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    button[type=submit] { padding: 8px 16px; background: #2E75B6; color: white; border: none; border-radius: 4px; cursor: pointer; }
    ul  { list-style: none; padding: 0; }
    li  { background: #f4f4f4; padding: 10px; border-radius: 4px; margin: 6px 0; }
  </style>
</head>
<body>
  <h1>📝 Todo App</h1>
  <p>SP23-BCT-016 | Fiza Maheen | CSC418 DevOps</p>
  <form method="POST" action="/add">
    <input type="text" name="task" placeholder="Enter a new task..." required />
    <button type="submit">Add</button>
  </form>
  <ul>${items || '<li>No tasks yet!</li>'}</ul>
</body>
</html>`);
});

// Add task
app.post('/add', async (req, res) => {
  await Todo.create({ task: req.body.task });
  res.redirect('/');
});

// Delete task
app.post('/delete/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Health check endpoint (for Prometheus)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Todo app running on port ${PORT}`));
