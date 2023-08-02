import express, {Request, Response} from 'express'
const TaskModel = require('./schema');
// const http = require('http')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors= require('cors')
const app= express();
// import TaskModel from 'schema'
app.use(bodyParser.urlencoded({ extended: true }));
// const taskSchema = new mongoose.Schema({
//   heading: { type: String, required: true },
//   content: { type: String },
// });
app.use((req: Request, res: Response, next) => {
  console.log('Received request:', req.method, req.url, req.body);
  next();
});

app.use(cors())

// const todoSchema = new mongoose.Schema({
//   heading: { type: String, required: true },
//   content: { type: String },
// });
// const TaskModel = mongoose.model('todo', )
const port = 3000;
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://ice-009:Armaan%4006@cluster0.ynzphiq.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error: Error) => {
  console.error('Error connecting to MongoDB:', error);
});


app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await TaskModel.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const todos = await TaskModel.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error });
    console.log(error)
  }
});
app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const todo = await TaskModel.findById(id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  const { heading, content } = req.body;
  console.log('Received POST request with data:', req.body);

  try {
    const newTodo = await TaskModel.create({ heading, content });
    console.log('New task created:', newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating new task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { heading, content } = req.body;
  try {
    const todo = await TaskModel.findByIdAndUpdate(id, { heading, content }, { new: true });
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const todo = await TaskModel.findByIdAndDelete(id);
    if (todo) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// app.use('/api/tasks', app);

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
