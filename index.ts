// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
// // import { open, Database } from 'sqlite';
// // import sqlite3 from 'sqlite3';
// import cors from 'cors';


// const app = express();
// app.use(bodyParser.json());
// app.use(cors());


// let db: Database<sqlite3.Database, sqlite3.Statement>;

// async function setupDatabase() {
//   try {
//     db = await open({
//       filename: './mydatabase.sqlite',
//       driver: sqlite3.Database,
//     });

//     await db.exec(`
//       CREATE TABLE IF NOT EXISTS todos (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         heading TEXT NOT NULL,
//         content TEXT
//       );
//     `);
//   } catch (error) {
//     console.error('Error setting up the database:', error);
//     throw error;
//   }
// }




// app.get('/api/todos', async (req: Request, res: Response) => {
//   try {
//     const todos = await db.all('SELECT * FROM todos;');
//     res.json(todos);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// app.get('/api/todos/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const todo = await db.get('SELECT * FROM todos WHERE id = ?;', [id]);
//     if (todo) {
//       res.json(todo);
//     } else {
//       res.status(404).json({ message: 'Todo not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.post('/api/todos', async (req: Request, res: Response) => {
//   const { heading, content } = req.body;
//   try {
//     const result = await db.run('INSERT INTO todos (heading, content) VALUES (?, ?);', [
//       heading,
//       content,
//     ]);
//     const newTodo = { id: result.lastID, heading, content };
//     res.status(201).json(newTodo);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.put('/api/todos/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const { heading, content } = req.body;
//   try {
//     const result = await db.run('UPDATE todos SET heading = ?, content = ? WHERE id = ?;', [
//       heading,
//       content,
//       id,
//     ]);
//     if (result.changes > 0) {
//       const updatedTodo = { id: parseInt(id), heading, content };
//       res.json(updatedTodo);
//     } else {
//       res.status(404).json({ message: 'Todo not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.delete('/api/todos/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const result = await db.run('DELETE FROM todos WHERE id = ?;', [id]);
//     if (result.changes > 0) {
//       res.sendStatus(204);
//     } else {
//       res.status(404).json({ message: 'Todo not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



// // Start the server
// const port = 8080;
// setupDatabase()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error initializing the app:', error);
//   });
import express, {Request, Response} from 'express'
const http = require('http')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors= require('cors')
const app= express()
app.use(bodyParser.json())
app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
mongoose.connect('mongodb+srv://ice-009:ice-009@cluster0.n4xny3y.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors())


const todoSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String },
  });
  const todoModel = mongoose.model('todo', todoSchema)
  app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  app.get('/api/todos', async (req: Request, res: Response) => {
    try {
      const todos = await todoModel.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
      console.log(error)
    }
  });
  app.get('/api/todos/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const todo = await todoModel.findById(id);
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.post('/api/todos', async (req: Request, res: Response) => {
    const { heading, content } = req.body;
    try {
      const newTodo = await todoModel.create({ heading, content });
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.put('/api/todos/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const { heading, content } = req.body;
    try {
      const todo = await todoModel.findByIdAndUpdate(id, { heading, content }, { new: true });
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.delete('/api/todos/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const todo = await todoModel.findByIdAndDelete(id);
      if (todo) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.listen(8080, () => {
    console.log(`Server is running on http://localhost:8080}`);
  });
