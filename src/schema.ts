const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    content: { type: String },
  }
);

const TaskModel = mongoose.model('task', taskSchema);
module.exports = TaskModel;




// import mongoose, { Schema, Document } from 'mongoose';

// interface Task {
//   taskHeading: string;
//   taskContent: string;
// }

// const taskSchema = new Schema<Task>(
//   {
//     taskHeading: { type: String, required: true },
//     taskContent: { type: String },
//   },
//   { timestamps: true }
// );

// const TaskModel = mongoose.model<Task & Document>('task', taskSchema);
// export default TaskModel;
