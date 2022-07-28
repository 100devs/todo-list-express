//Modules
const express = require("express"); //making it possible to use express in this file
const app = express(); //setting a constant and assigning it to the instance of express
const MongoClient = require("mongodb").MongoClient; //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121; //requires that the mongo client library be imported
require("dotenv").config(); //it allows you to use the .env file contents within your server.js file //Tip - this should be in your gitignore file
// import and enable env file (to hide keys)

//DATABASE
//.env lets you set environment variables, so you can keep sensitive info. like your mongodb connection string,
//This is our private hidden environment variables. .env is for hiding important keys
//Again, private but still use it in your application with process.env

let db, //declare a variable called db but not assign a value. We're declaring it globally so we can use it in multiple places
  dbConnectionStr = process.env.DB_STRING, //declaring variable but here, we're assigning a value (look in env file and find DB_String  grabbing that value and
  //assigning it to dbConnectionStr
  dbName = "todo"; // Setting the name of the database that we want to assess (declare name of db into a variable)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
  .then((client) => {
    //waiting for the connection and proceeding if successful, and passing in all the client information
    console.log(`Connected to ${dbName} Database`); //log to the console a template literal "connected to todo Database"
    db = client.db(dbName); //assigning a value to previously declared db variable that contains a db client factory method
  }); //closing our .then

//MIDDLEWARE
app.set("view engine", "ejs"); //declaring that we're using templating engine to render ejs
app.use(express.static("public")); // tells our app to use a folder named "public" for all of our static files
//e.g images and css files
app.use(express.urlencoded({ extended: true })); //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()); //tells the app to use Express's json method to take the object
//and turn it into Json string

//Routes
app.get("/", async (request, response) => {
  //go get something to display to users on our client side, / is our main page index.ejs
  // it's doing it with an async function
  //create a const called 'todoitems's' that goes into our databse , creating a collection called todos
  // and finding anything in that database and turning it into an array of objects
  //called todo
  //OR
  // create a variable to capture an array of our documents in our colleCtion 'todos' db called
  const todoItems = await db //creates a constant in our todos collectio
    .collection("todos") //loos at dococuments in teh collection
    .find()
    .toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false }); // The countdocuments methdos
  //coiutsn teh numer of documents hthat have a complted stuatus equal to 'false - you're poing
  // and counting how may to-do list items haven't been completed yet. "what is left on the agenda?"
  response.render("index.ejs", { items: todoItems, left: itemsLeft }); //SENDS RESPONSE THAT RENDERS THE NUMBER
  //OF DOCUMENTS IN OUR COLLECTION AND THE NUMBER OF ITEMS LEFT-ITEMS THAT DON'T HAVE "TRUE" FOR "COMPLETED IN INDEX.JS".
  // db.collection('todos').find().toArray() -> find the todos, put in array
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})-> find the number of not completed
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error)) -> if we hit an error lets us know
  // })

  app.post("/addTodo", (request, response) => {
    //adding an elemENT to our databse via route. /addTodo OR update from the CRUD or create
    db.collection("todos")
      //server will go into our collection called todos
      .insertOne({ thing: request.body.todoItem, completed: false }) // insert ine thing called todoitem with a status of "completed" set to "false, ie
      //it puts some stuff in there. bye. OR //add a new item/document  add a new item to our todo list on database; insert in the body of the todoitem and automatically set it to false for completed
      .then((result) => {
        console.log("Todo Added"); // let us know that we successfully adds a todo
        response.redirect("/"); //  go back to the route screen
      })
      .catch((error) => console.error(error)); // uh oh we got an error here you go
  });

  app.put("/markComplete", (request, response) => {
    //update some parts of the documents on our database
    db.collection("todos")
      .updateOne(
        { thing: request.body.itemFromJS },
        {
          //change the todo
          $set: {
            completed: true, // mark it as complete
          },
        },
        {
          sort: { _id: -1 }, // sort by id: descending  biggest to smallest so it ends up last?
          upsert: false, // update+ insert = upsert the rendering so
        }
      )
      .then((result) => {
        // second do:
        console.log("Marked Complete"); // let us know it worked
        response.json("Marked Complete"); // let the client know it worked
      })
      .catch((error) => console.error(error)); // if error shove it in console log
  });

  app.put("/markUnComplete", (request, response) => {
    //update documents round 2: fight the man
    db.collection("todos")
      .updateOne(
        { thing: request.body.itemFromJS },
        {
          $set: {
            completed: false, // we didnt actually do this to so it's undone
          },
        },
        {
          sort: { _id: -1 }, // sort by id: this thing goes last
          upsert: false, // don't add a double
        }
      )
      .then((result) => {
        // set up result in case we use it later but we don't use it now
        console.log("Marked Incomplete");
        response.json("Marked Complete");
      })
      .catch((error) => console.error(error)); // if error shove it in console log
  });

  app.delete("/deleteItem", (request, response) => {
    db.collection("todos")
      .deleteOne({ thing: request.body.itemFromJS }) // delete that bad boy
      .then((result) => {
        // again, result in case we want it later
        console.log("Todo Deleted"); // it worked - to server
        response.json("Todo Deleted"); // it worked - to client
      })
      .catch((error) => console.error(error)); // if error shove it in console log
  });

  app
    .listen(process.env.PORT || PORT, () => {
      // this is where we listen to the PORT; first one is for the herokus set or relse use the one we declared
      console.log(`Server running on port ${PORT}`); // this lets us know we are connected the the server
    })

    .then((result) => {
      //asuming thate everythng went oaky ..
      console.log("Todo Added"); //print "todo added" to the console in the rele for VS code
      response.redirect("/"); // refreshed index.ejs to show thte new thing we added to the databse on the page
    })
    .catch((error) => console.error(error)); //if error shove it in console log
});

app.put("/markComplete", (request, response) => {
  //update  when we click somthing on the frontend ...
  db.collection("todos") // going to go into our 'todos' collectins
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, // add status of completed equal to 'true' to item in our collection
        },
      },
      {
        sort: { _id: -1 }, //once a thing has been marked as completed it takes it off the to-do list and
        //adds plus one to the completed list. sorted by completed or not. -1 means we're getting rid of it
        upsert: false, //upsert will update the db if the note is found and insert a new note if not found
      }
    )
    .then((result) => {
      console.log("Marked Complete"); //let us know it worked
      response.json("Marked Complete"); //let the client know it worked
    })
    .catch((error) => console.error(error)); //if error shove it in console log
});

app.put("/markUnComplete", (request, response) => {
  //this route unclicks a thing that you've marked as complete
  //will take away complete status
  db.collection("todos") //Go into todos collection
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        //look for item from itemFromJS
        $set: {
          completed: false, // undoes what we did with markcomplete. it changes 'completed'
          //status to "false"
        },
      },
      {
        sort: { _id: -1 }, // sort by id: descending  biggest to smallest so it ends up last?
        upsert: false, // update+ insert = upsert the rendering so
      }
    )
    .then((result) => {
      console.log("Marked Complete"); //console log "marked complete"
      response.json("Marked Complete"); //returns response of marked cote to fetch in main.js
    })
    .catch((error) => console.error(error)); //if error shove it in console log
}); //ending put

app.delete("/deleteItem", (request, response) => {
  //request response is the other half of the async await in main.js
  db.collection("todos") //database collection requesting something from the body.
    //goes into your collection
    .deleteOne({ thing: request.body.itemFromJS })
    //uses deleteOne method and find a thing that matches the name of the thing you clicked
    //on
    .then((result) => {
      //assuming everything went well ...
      console.log("Todo Deleted"); //console log"to do deleted'
      response.json("Todo Deleted"); //returns response fo "todo deleted" to the fetch in main.js
    })
    .catch((error) => console.error(error)); //if error shove it in console log
}); //ending delete

app.listen(process.env.PORT || PORT, () => {
  //setting up which port we will be listening on - either the port from the .env file or the port variable we set
  console.log(`Server running on port ${PORT}`); //console.log the running port, this lets us know we are connected the the server
}); //end the listen method
