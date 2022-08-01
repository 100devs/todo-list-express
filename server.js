const express = require('express') //making it possible to use express in this file
 /* load/import express, requires that express be imported into Node*/
const app = express()  //setting a constant and assigning it to the instance of express
/* run express, create an express application*/
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
/* requires that the MonogoClient library be imported, connects to mongodb*/
const PORT = 2121 //setting a constant to define the location where our server will be listening.
/* specifies port number (currently a local port)*/
require('dotenv').config() //allows us to look for variables inside of the .env file
/* allows you to use the .env file contents within your server.js file (should be included in gitignore file)

you could also write this line as const dotenv = require('dotenv').config();
to make it look like all the other ones
doesn't change the functionality 


allows you to bring in your hidden/non public variables from the .end file, its hidden, for security purposes. Will go to github though if its not in the gitignore file*/


let db, //declare a variable called db but not assign a value
/*gives you your database, establishes database; declare variable for database*/
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    //declare unique-connection-key to db
    //think of it like an ip address, point database to ... sets dbconnectionStr equal to address provided by MongoDB (DB_string is in the .env config file in line 5, hide your biz)
    dbName = 'todo'
    //declaring a variable and assigning the name of the database we will be using
     // declare name of db into a variable

    // ###### LEFT OFF HERE
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //defines how we connect to our mongo DB. useUnifiedTopology.
//useUnifiedTopology. helps ensure that things are returned in a clean manner

    .then(client => {
        //responding to the client side and saying...
        console.log(`Connected to ${dbName} Database`)
        //will produce a message in the console if the client connected properly (i.e.,"hey, we made it! we connected to the database named 'todo!")
        db = client.db(dbName); //Defines the database as 'todo', works with line 15. 
    })
    
app.set('view engine', 'ejs') //determing how we're going to use a view (template) engine to render ejs (embedded javascript) commands for our app
app.use(express.static('public')) //Tells our app to use a folder named "public" for all of our static files 9e.g. images and Css files)
app.use(express.urlencoded({ extended: true })) // Call to middleware that cleans up how things are displayed and how our server communicates withour client (similar to the the body parser useUnifiedTopology above.)
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.

app.use(express.json()) //tells the app to use Exrpess's json method to take the object and turn it into a JSON string

//ROUTES
app.get('/',async (request, response)=>{
    //GET stuff to display to users on the client side (in this case, index.ejs)
    const todoItems = await db.collection('todos').find().toArray()
    // create a variable to capture an array of our documents in our colletion 'todos' db called

    // setting a constant variable called todoItems
    //  creating a collection called "todos", will go into our database and look for anything in the database called todoItems, and turn it into an array of objects 
   // if you look at the index.ejs file, this is where the  todoItems is displayed as an array ul class todoItems

    const itemsLeft = await db //creats a constant in our todos collection    
    .collection('todos') //looks at documents in the collection
    
    .countDocuments({completed: false}) //counts documents that have a completed status equal to "false"
    //In MongoDB, the countDocuments() method counts the number of documents that matches to the selection criteria. It returns a numeric value
   //we're counting the incomplete todos (where completed:false) and assigning that number to const=itemsLeft "what is still left on the agenda"
   //"completed" is just a property we have set on an item object.

   // there is a completed property on every todo object, which is set to false as the default. Later on we will have a put (edit) route so we can set the completed property to true for completed to do items.

    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sends response that renders all of the number of items from the .countDocuments({completed}) info to our index.js 

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))

//no catch so any error is YEETED into the void. I think that whole commented out part is the old promise chain way to do it vs the await with const way to do it. Then forgot to keep the catch error
})

app.post('/addTodo', (request, response) => {

    //adding element to our database with a route of /addTodo
    db.collection('todos') //server will go into our collection called "todos"
    .insertOne({thing: request.body.todoItem, completed: false}) //insert one thing named todo item, going to get a status of completed: false aka not completed (i.e. it puts some stuff in there, bye)
    .then(result => {
        console.log('Todo Added') //print "todo added" to the console in the repl for VS Code
        response.redirect('/')//refreshes the EJS page to show that new thing we added to the database on the page
    })
    .catch(error => console.error(error)) //if we weren't able to add anything to the database, we'll see an error message in the console
})

app.put('/markComplete', (request, response) => {
    //update in CRUD format, when weclick something on the front end...
    db.collection('todos') //going to go into our "todos" collection
    
    .updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of completed equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed

        //sort the array in descending order by id?

        //trues come up as -1 in the database
        // like rap names, negative means we're taking way from it
        // sorting by completed or not
        //so completed items will be grayed out 
        upsert: false //doesn't create a document for the todo item if the item isn't found

        //if upsert: true => upsert will update the db if the note is found and insert a new note if not found
    })
    .then(result => { //assuming everything went okay
        console.log('Marked Complete') //console.log marked complete
        response.json('Marked Complete') //response.json is what is going back to our fetch in main.js
    })
    .catch(error => console.error(error)) //if something broke, show an error message in the console
})

app.put('/markUnComplete', (request, response) => { // this route unclicks a thing that you've marked as complete ~ will take away complete status
    // 
    db.collection('todos') //Go into todos collection
    
    .updateOne
    ({thing: request.body.itemFromJS},{ //look for item from itemFromJs
        $set: {
            completed: false //undoes what we did with markComple. It changes "completed "status to "false"
          }
    },{
        sort: {_id: -1}, //???? "unknown js magic"
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //console.log marked complete
        response.json('Marked Complete') //response.json is what is going back to our fetch in main.js, returns response of "makred complete" to the fetch in main.js
    .catch(error => console.error(error))
    //something broke, an error is logged to the console
})

})

app.delete('/deleteItem', (request, response) => { // get rid of the thing line
    db.collection('todos') // goes into your collection
    
    .deleteOne({thing: request.body.itemFromJS}) //uses deleteOne method and find a thing that matches the name of the thing you clicked on
    .then(result => {
        //assuming everything went okay
        console.log('Todo Deleted')
        //console.log "todo deleted"
        response.json('Todo Deleted')
        //returns response of "todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))
    //something broke, an error is logged to the console

})

app.listen(process.env.PORT || PORT, ()=>{ //teels our server to listen for connections on the PORT we defined as  constant earlier OR process.env.PORT will tell the server to listen on the port of the app (e.g. the PORT used by heroku)
    console.log(`Server running on port ${PORT}`)
    //console.log the port number or server is running on
});