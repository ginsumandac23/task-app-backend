const Task = require('../models/Tasks');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

module.exports.addTask = async (req, res, next) => {

	try {

		const newTask = new Task({
		  title: req.body.title,
		  category: req.body.category || "others",
		  priority: req.body.priority || "medium",
		  tags: req.body.tags || [],
		  dueDate: req.body.dueDate || null,
		  user: req.user.id
		});

		const result = await newTask.save();

		res.status(201).send({
			success: true,
			message: "Task successfully added",
			result: result
		});

	}catch(err){
		next(err);
	}
}


module.exports.getAllTasks = async (req, res, next) => {
	try {
		const tasks = await Task.find({
			user: req.user.id
		}).sort({ createdAt: -1 });

		return res.status(200).json(tasks);
	} catch (err) {
		next(err);
	}
};


module.exports.getActiveTasks = async (req, res, next) => {
	try {
		const tasks = await Task.find({
			user: req.user.id,
			completed: false
		}).sort({ createdAt: -1 });

		return res.status(200).json(tasks);
	} catch (err) {
		next(err);
	}
};


module.exports.getCompletedTasks = async (req, res, next) => {
	try {
		const tasks = await Task.find({
			user: req.user.id,
			completed: true
		}).sort({ createdAt: -1 });

		return res.status(200).json(tasks);
	} catch (err) {
		next(err);
	}
};


module.exports.completeTask = async(req, res, next) => {

	try {

		const { taskId } = req.params;

		const updateTask = await Task.findOneAndUpdate(
			{_id: taskId, user:req.user.id},
			{ completed: true },
			{new: true}
		);

		if(!updateTask){
			return res.status(404).send({message: "Task not found"});
		}

		res.json(updateTask);

	}catch(err){

		next(err);
	}
}


module.exports.updateTask = async (req, res, next) => {

	try {

		const task = req.params.taskId;

		const updateTask = {
			title: req.body.title,
			category: req.body.category,
			priority: req.body.priority,
			tags: req.body.tags
		}

		const taskResult = await Task.findByIdAndUpdate(task, updateTask, {new: true});

		if(!updateTask){
			return res.status(404).send({message: "Task not found"})
		}

		return res.status(200).json({
			success: true,
			message: "Task updated successfully",
			data: taskResult
		})

	}catch(err){

		next(err);

	}

}


module.exports.searchTask = async (req, res, next) => {
	try {
		const { title } = req.query;

		if (!title) {
			return res.status(400).json({ message: "Search query is required" });
		}

		const taskResult = await Task.find({
			title: { $regex: title, $options: 'i' },
			user: req.user.id
		});

		if (taskResult.length === 0) {
			return res.status(404).json({ message: "Task not found" });
		}

		return res.status(200).json(taskResult);

	} catch (err) {
		next(err);
	}
};


module.exports.deleteTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;

		const deletedTask = await Task.findOneAndDelete({
			_id: taskId,
			user: req.user.id
		});

		if (!deletedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		return res.status(200).json({
			success: true,
			message: "Task deleted successfully",
			data: deletedTask
		});

	} catch (err) {
		next(err);
	}
};