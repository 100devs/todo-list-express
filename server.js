const express = require('express'); //making it possible to use express in this file
const app = express(); //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient; //making it possible to use methods associted with MongoClient and talk to our DB
const PORT = 2121; //setting a constant to define the location where our server will be listetning
require('dotenv').config(); //allows us to look for variables inside the .env file

let db, //declaring a variable but not assigning a value
	dbConnectionStr = process.env.DB_STRING, //declaring a value and assigning our db connection string to it
	dbName = 'todo'; //declaring a variable and assigning it the name of the db we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //we are connecting to mongoDB and passing our connection sttring, passing in an additional property
	.then((client) => {
		//we're waiting for the connetion and proceeding if successful, and passing in all the client information
		console.log(`Connected to ${dbName} Database`); //log to the console a template literal
		db = client.db(dbName); //assigning value to variable db that contains a db client factory method
	}); //closing our .then

//middleware - helps facilitate communication for our requests
app.set('view engine', 'ejs'); //sets ejs as the default render method
app.use(express.static('public')); //it sets location for static assets
app.use(express.urlencoded({ extended: true })); //tells express to decode and encode URLs where the header matches the content, supports arrays and objects
app.use(express.json()); //parses JSON content from incoming requests

app.get('/', async (request, response) => {
	//starts a GET method when the root route is passed in, sets up req and res parameters
	const todoItems = await db.collection('todos').find().toArray(); //sets a variable and awaits ALL items from the todos collection
	const itemsLeft = await db.collection('todos').countDocuments({ completed: false }); //sets a variable and awaits a count of uncompleted items to later display in EJS
	response.render('index.ejs', { items: todoItems, left: itemsLeft }); //rendering the EJS file and passing through the db items and the countt remaining inside of an object
	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

app.post('/addTodo', (request, response) => {
	//starts a POST method when the add route is passed in
	db.collection('todos')
		.insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new intem into todos collection, gives it a completed value of false by  default
		.then((result) => {
			//if insert is successful, do something
			console.log('Todo Added'); //console log action
			response.redirect('/'); //gets rid of the /addTodo route, and redirects to the homepage
		})
		.catch((error) => console.error(error)); //catching errors
}); //ending the POST

app.put('/markComplete', (request, response) => {
	//starts a PUT method when the markComplete route is passed in
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS }, //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
			{
				$set: {
					completed: true, //set completed status to true
				},
			},
			{
				sort: { _id: -1 }, //moves item to the bottom of the list
				upsert: false, //prevents insertion if item does not already exist
			}
		)
		.then((result) => {
			//starts a then if update was successful
			console.log('Marked Complete'); //logs to the console
			response.json('Marked Complete'); //sending response back to sender
		}) //closing .then
		.catch((error) => console.error(error)); //catching errors
});

app.put('/markUnComplete', (request, response) => {
	//starts a PUT method when the markUncomplete route is passed in
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS }, //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
			{
				$set: {
					completed: false, //set completed status to false
				},
			},
			{
				sort: { _id: -1 }, //moves item to the bottom of the list
				upsert: false, //prevents insertion if item does not already exist
			}
		)
		.then((result) => {
			//starts a then if update was successful
			console.log('Marked Complete'); //logs to the console
			response.json('Marked Complete'); //sending response back to sender
		}) //closing .then
		.catch((error) => console.error(error)); //catching errors
});

app.delete('/deleteItem', (request, response) => {
	//starts a DELETE method when the deleteItem route is passed in
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS }) ///look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
		.then((result) => {
			//starts a then if delete was successful
			console.log('Todo Deleted'); //logs to the console
			response.json('Todo Deleted'); //sending response back to sender
		}) //closing .then
		.catch((error) => console.error(error)); //catching errors
});

app.listen(process.env.PORT || PORT, () => {
	//setting up which port we will be listening on - either the portt from the .env file or the port variable we sett
	console.log(`Server running on port ${PORT}`); //console.log the running port
});
