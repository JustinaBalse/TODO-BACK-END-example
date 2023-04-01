const express = require("express");
const app = express();

// Duomenų bazės valdymui
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Kintamųjų iš .env failo naudojimui
const dotenv = require("dotenv");
dotenv.config();

// Prisijungimas prie DB
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err)=> console.log(err));

// Dokumento schema (vieno įrašo schema)
let taskSchema = new Schema(
  {
    task: {
        type: String
    },
    status: {
        type: Boolean
    }
  }
);

// Modelis
const Task = new model("Task", taskSchema);


// middleware - decode JSON data
app.use(express.json());

// GET TASKS
app.get("/api/v1/todos", async (req, res) => {
  try {
    const allTasks = await Task.find();
    res.status(200).json({
      status: "success",
      results: allTasks.length,
      data: {
        tasks: allTasks,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
})

// GET TASK BY ID
app.get("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id });
    console.log(task);

    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    } else {
      res.status(200).json({
        status: "success",
        data: {
          task: task,
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
})

// CREATE TASK
app.post("/api/v1/todos", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
})


/**
 * DELETE TASK
 */
app.delete("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ msg: `No todo with id: ${id}` });
    } else {
      res.status(200).json({
        status: "success",
        message: `Task with id: ${id} deleted successfully.`,
        task: task,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// // Rasti visus dokumentus
// async function findAllTasks(){
//   const tasks = await Task.find({});
//   console.log(tasks);
// }
// // findAllTasks();

// // Rasti dokumentą pagal ID
// const taskID = '6404eb71c9a28153b30fed15';
// async function findById(id) {
//   const task = await Task.findById(id).exec();
//   console.log(task);
// }
// // findById(taskID);

// // Rasti dokumentą pagal ID ir ištrinti
// const taskID2 = '6404eb71c9a28153b30fed15';
// async function findByIdandDelete(id) {
//   const task = await Task.findByIdAndDelete(id);
//   console.log(task);
// }
// // findByIdandDelete(taskID2);