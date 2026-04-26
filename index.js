const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();


const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/tasks');

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Now connected to database'));


const corsOption = {
  origin: [
    "http://localhost:5173",
    "https://task-app-frontend-eight.vercel.app"
  ],
  credentials: true,
  optionSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOption));

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);


if(require.main === module){
	app.listen(process.env.PORT || 3000, () => console.log(`API is now online on port ${process.env.PORT || 3000}`));
}
module.exports = {app, mongoose};