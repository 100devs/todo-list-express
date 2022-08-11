const express = require('express'); //importing express into file for functionality
const app = express(); //set constant variable creating an instance of express and giving it namespace of 'app'
const MongoClient = require('mongodb').MongoClient; //mongodb is the cluster and MongoClient provides functionality to interact with that cluster
const PORT = 5500; // set constant variable for location that server will listen for requests
require('dotenv').config(); // allows us to look for env variables in .env file

let db, //declare global variable without assigning a value for versatility in using it in different functions later
	dbConnectionStr = process.env.DB_STRING, // declare variable with out DB_STRING from our .env file
	dbName = 'todo'; // assign dbName with the value of 'todo'

//Setting a connection to MongoClient, using our connection string with some additional properties
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	// waiting for successful connection and passing in client information
	(client) => {
		console.log(`Connected to ${dbName} Database`); //Log to console
		db = client.db(dbName); //Assigning value to global db variable, contains information about the db for use later.
	} // closing .then()
); // closing .connect()

//Middleware
app.set('view engine', 'ejs'); //sets ejs as default render method
app.use(express.static('public')); // sets location for static assets
app.use(express.urlencoded({ extended: true })); // Tells express to decode and encode URLs where header matches the content. Supports arrays and objects
app.use(express.json()); // Parses JSON content

// READ request to the root route (default page)
app.get('/', async (request, response) => {
	//async function setting req and res params.
	const todoItems = await db.collection('todos').find().toArray(); //Fetch to db with the name 'todos' and collecting all documents into an array, assigns ity to variable.
	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false }); //sets a variable and awaits a count of uncompleted items to later display in EJS
	response.render('index.ejs', { items: todoItems, left: itemsLeft }); //Renders index.ejs as a response, passing in an object with our array of items and our count of items left to complete.

	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

//starts a POST request when the add route is passed in (see form at bottom of index.ejs)
app.post('/addTodo', (request, response) => {
	db.collection('todos') //Targets our todos db
		.insertOne({ thing: request.body.todoItem, completed: false }) // Mongo method to add one to the todos collection using the information from the form and setting completed to false by default
		//if this insertOne operates successfully:
		.then((result) => {
			console.log('Todo Added'); //Log to console to confirm success
			response.redirect('/'); //Reload the page to leave the /addTodo route and travel to the root route.
		})
		// If there is an error, log it to the console.
		.catch((error) => console.error(error));
});
//PUT method when the markComplete route is passed in
app.put('/markComplete', (request, response) => {
	db.collection('todos') //In the collection named 'todos'
		.updateOne(
			//find and update a collection where 'thing' property has the value of itemFromJS in markComplete() in main.js
			//NOTE: It is more consistent to use unique identifiers instead of name since this will only upade the first matching collection, of which there may be many
			{ thing: request.body.itemFromJS },
			{
				// sets completed property to true'
				$set: {
					completed: true,
				},
			},

			{
				sort: { _id: -1 }, //moves item to bottom of list.
				upsert: false, //If value does not exist, insert it (we set to false)
			}
		)
		// If update was successful,
		.then((result) => {
			//Log this flag to console
			console.log('Marked Complete');
			//respond with 'marked complete' to confirm our request and response cycle is finished
			response.json('Marked Complete');
		})
		// If there is an error, log it to the console.
		.catch((error) => console.error(error));
});
//PUT method when the markUnComplete route is passed in
app.put('/markUnComplete', (request, response) => {
	db.collection('todos') //In the collection named 'todos'
		.updateOne(
			//find and update a collection where 'thing' property has the value of itemFromJS in markUnComplete() in main.js
			{ thing: request.body.itemFromJS },
			// Setting completed property of item to false
			{
				$set: {
					completed: false,
				},
			},

			{
				sort: { _id: -1 }, // moves item to the bottom of list
				upsert: false, //Prevents insertion of item if it does not already exist
			}
		)
		.then((result) => {
			//If above request was successful,
			console.log('Marked Complete'); // Log flag to console
			response.json('Marked Complete'); // Respond so app knows our request/response cycle is finished.
		})
		// If there is an error, log it to the console.
		.catch((error) => console.error(error));
});
//DELETE method when the markUnComplete route is passed in
app.delete('/deleteItem', (request, response) => {
	db.collection('todos') //In the collection named 'todos'
		.deleteOne({ thing: request.body.itemFromJS }) //find and update a collection where 'thing' property has the value of itemFromJS in deleteItem() in main.js

		//If above request was successful,
		.then((result) => {
			console.log('Todo Deleted'); // Log flag to console
			response.json('Todo Deleted'); // Respond so app knows our request/response cycle is finished.
		})
		// If there is an error, log it to the console.
		.catch((error) => console.error(error));
});
// Specifies what port the app will be listening on, can use .env or global declared variable PORT
app.listen(process.env.PORT || PORT, () => {
	//Log flag to the console displaying the current running port.
	console.log(`Server running on port ${PORT}`);
});
