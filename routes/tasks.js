const express = require('express');
const taskController = require('../controllers/tasks');
const bcrypt = require('bcryptjs');
const { verify } = require('../auth');

const router = express.Router();

router.post("/", verify, taskController.addTask);

router.get("/", verify, taskController.getAllTasks);
router.get("/active", verify, taskController.getActiveTasks);
router.get("/completed", verify, taskController.getCompletedTasks);

router.get("/search", verify, taskController.searchTask);

router.patch("/:taskId", verify, taskController.updateTask);
router.patch("/complete/:taskId", verify, taskController.completeTask);

router.delete("/:taskId", verify, taskController.deleteTask);


module.exports = router;