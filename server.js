// require libraries so we can use them and set PORT variable
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
require("dotenv").config();

// create our global variables
let db,
	dbConnectionStr = process.env.DB_STRING, // connection String stored safely in .env; this will grab it
	dbName = "todo";
// connect to our database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //unified topology deprecated
	.then((client) => {
		console.log(`Connected to ${dbName} Database`); //confirming our connection to our db
		db = client.db(dbName);
	});
// setting our ejs as our view engine
app.set("view engine", "ejs");
app.use(express.static("public")); //allows us to automagically serve public folder
app.use(express.urlencoded({ extended: true })); //parse url and json for us, does what body-parser did
app.use(express.json());

// get request from root to serve whats in our db
app.get("/", async (request, response) => {
	const todoItems = await db.collection("todos").find().toArray(); //grab todoItems from db then turn into an array, stores into todoItems
	const itemsLeft = await db
		.collection("todos")
		.countDocuments({ completed: false }); //counts all docs that havent been completed and stores them into itemsLeft
	response.render("index.ejs", { items: todoItems, left: itemsLeft }); //respond by sending render from ejs file passing in variables items(==todoItems) and left(==itemLeft)

	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

// post request to add new todos
app.post("/addTodo", (request, response) => {
	db.collection("todos")
		.insertOne({ thing: request.body.todoItem, completed: false }) //go into collection, insert new thing by going to ejs body then class todoItem with completed status false
		.then((result) => {
			console.log("Todo Added"); //verify success of post
			response.redirect("/"); // saying to refresh with new todo
		})
		.catch((error) => console.error(error)); //handle error and log if occur
});

// put request to update item with complete status of true
app.put("/markComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: true,
				}, //go into todos collection then select item and change completed status to true
			},
			{
				sort: { _id: -1 },
				upsert: false, //if set to true, would update and insert if item didnt already exist
			}
		)
		.then((result) => {
			console.log("Marked Complete"); //once update successful, log words server side
			response.json("Marked Complete"); //send words as json response so it can log on client side
		})
		.catch((error) => console.error(error)); //error catch with log if occurs
});

// put request to mark an item with completed status of true to false
app.put("/markUnComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: false,
				}, //go into collection, grab item and change completed status to false
			},
			{
				sort: { _id: -1 },
				upsert: false,
			}
		)
		.then((result) => {
			console.log("Marked Complete"); //log words server side
			response.json("Marked Complete"); //log json words again
		})
		.catch((error) => console.error(error)); //handle error with log if occurs
});
//De-Le-Te request to delete item from existence(or just the DOM potentially)
app.delete("/deleteItem", (request, response) => {
	db.collection("todos")
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			//go into collection, grab item and delete it
			console.log("Todo Deleted"); //deleted words server side
			response.json("Todo Deleted"); //deleted words as json to go to client side
		})
		.catch((error) => console.error(error)); //handle error and log if occurs
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`); //listen for our port to connect and log words saying we're winning son
});
