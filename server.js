//-----------------Todo App----------------------
//Author : zak_4Ar1A
//Using  : ejs node express
//-----------------------------------------------

const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient; //way to talk to mongodb
const PORT = 2121; //Port we were be  listening
require("dotenv").config(); //allows us to see variable inside of ,env file

let db, //declare  variables
	dbConnectionStr = process.env.DB_STRING,
	dbName = "todo"; //name of DB

//Creating connection toMngodb and passing our string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`);
		db = client.db(dbName);
	}
);

//Midlleware
app.set("view engine", "ejs"); //set default render => ejs
app.use(express.static("public")); //sets location for stactic assets
app.use(express.urlencoded({ extended: true })); //tells eexpress to decode and ecode urls where the head matches the content suppors array and objects
app.use(express.json()); //parses Json content

//Routers

app.get("/", async (request, response) => {
	//start a Get method  to the root
	const todoItems = await db.collection("todos").find().toArray(); //awaiting all items in db
	const itemsLeft = await db
		.collection("todos")
		.countDocuments({ completed: false }); //get all left items from dataBase uncompleted items
	response
		.render("index.ejs", { items: todoItems, left: itemsLeft }) //send data to ejs
	//.catch((error) => console.error(error));

	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
});

app.post("/addTodo", (request, response) => {
	//start a POST method when the add route is passed in
	db.collection("todos")
		.insertOne({ thing: request.body.todoItem, completed: false }) //insert a new task with uncompleted
		.then((result) => {
			console.log("Todo Added");
			response.redirect("/");
		})
		.catch((error) => console.error(error));
});
//Update a thing task 
app.put("/markComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: true,
				},
			},
			{
				sort: { _id: -1 },	//sorting the thing
				upsert: false,		//if it's note existe it will note created 
			}
		)
		.then((result) => {
			console.log("Marked Complete");
			response.json("Marked Complete");
		})
		.catch((error) => console.error(error));
});
//
//Update a thing task with uncompleted task 
app.put("/markUnComplete", (request, response) => {
	db.collection("todos")
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: false,
				},
			},
			{
				sort: { _id: -1 },
				upsert: false,
			}
		)
		.then((result) => {
			console.log("Marked Complete");
			response.json("Marked Complete");
		})
		.catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
	db.collection("todos")
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log("Todo Deleted");
			response.json("Todo Deleted");
		})
		.catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
