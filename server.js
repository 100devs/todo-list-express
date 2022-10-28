const express = require("express"); //importing express in the file server.js
const app = express(); //setting a constant and assigning it a instance of express
const MongoClient = require("mongodb").MongoClient; //importing mongodb and assigning MongoClient to a constant which will help to talk to our database
const PORT = 2121; //setting a constant with port number 2121 where our server will be listening
require("dotenv").config(); //Allows us to access variable declared inside env variable

let db, //declaring a variable called db
	dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it DB_STRING from env file
	dbName = "todo"; //declaring a variable and assigning it the name of database

//connecting to mongoDB and and passing in connection string and also passing in additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
	//Waiting for the promise to fullfil and proceeding if successful and passing in all the client information
	.then((client) => {
		console.log(`Connected to ${dbName} Database`); //logging to console "Connected to todo Database"
		db = client.db(dbName); //assigning a value to previously declared variable with db client factory method
	}); // Closing our .then

//middleware
app.set("view engine", "ejs"); //sets ejs as default render
app.use(express.static("public")); //sets the location for static files
app.use(express.urlencoded({ extended: true })); //Tells the express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()); //Parse Json content from incoming requests

// Starts GET method when root route is passed in, sets up req, res parameter
app.get("/", async (request, response) => {
	const todoItems = await db.collection("todos").find().toArray(); //sets a variable and awaits for all items from todos collection
	const itemsLeft = await db
		.collection("todos")
		.countDocuments({ completed: false }); //sets a variable and awaits for count of all items from todos collection where completed is false to display in ejs
	response.render("index.ejs", { items: todoItems, left: itemsLeft }); //rendering ejs as a response and passing todoItems and itemsLeft as an object to ejs
	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

// Starts POST method when /addTodo route is passed in, sets up req, res parameter
app.post("/addTodo", (request, response) => {
	db.collection("todos")
		.insertOne({ thing: request.body.todoItem, completed: false }) //finds todos the collection and inserts new item and give it completed value of false
		//if insertion is successfull, do something
		.then((result) => {
			console.log("Todo Added"); //logging todo added
			response.redirect("/"); //gets rid of /addTodo Route and redirects back to home
		}) //closing .then
		.catch((error) => console.error(error)); //Catching errors
}); //ending the post

// Starts PUT method when /markComplete route is passed in, sets up req, res parameter
app.put("/markComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS }, //looks in the database which item have property of thing and value same as passed from main.js
			{
				$set: {
					completed: true, //sets completed status to true
				},
			},
			{
				sort: { _id: -1 }, //moves item bottom of the list
				upsert: false, //prevents insertion if items does not exists
			}
		)
		//starting a then if update was successful
		.then((result) => {
			console.log("Marked Complete"); //Console logging successfull completion
			response.json("Marked Complete"); //sending response as a json
		}) //ending .then
		.catch((error) => console.error(error)); //catching errors
}); //ending put

// Starts PUT method when /markUnComplete route is passed in, sets up req, res parameter
app.put("/markUnComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS }, //looks in the database which item have property of thing and value same as passed from main.js
			{
				$set: {
					completed: false, //sets completed status to false
				},
			},
			{
				sort: { _id: -1 }, //moves item bottom of the list
				upsert: false, //prevents insertion if items does not exists
			}
		)
		//starting a then if update was successful
		.then((result) => {
			console.log("Marked Complete"); //Console logging successfull completion
			response.json("Marked Complete"); //sending response as a json
		}) //ending .then
		.catch((error) => console.error(error)); //catching errors
}); //ending put

// Starts DELETE method when /deleteItem route is passed in, sets up req, res parameter
app.delete("/deleteItem", (request, response) => {
	db.collection("todos")
		.deleteOne({ thing: request.body.itemFromJS }) //looks in the database which item have property of thing and value same as passed from main.js and deletes it
		//starts then if deletion was successful
		.then((result) => {
			console.log("Todo Deleted"); //logging in the console
			response.json("Todo Deleted"); //sending response of type json
		}) //closing .then
		.catch((error) => console.error(error)); //catching the error
}); //ending delete

//setting up which port we will be listening on - either from .env or from the constant PORT
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`); //logging in console
}); //end the listen
