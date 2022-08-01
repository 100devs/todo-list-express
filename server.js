const express = require('express') //making it possible to use express in this file
 /* load/import express, requires that express be imported into Node*/
const app = express()  //setting a constant and assigning it to the instance of express
/* run express, create an express application*/
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
//mongoclient allows us to actually TALK to mongodb
//Why is MongoClient capitalized again? =>Because it is a Class, and all classes have a first uppercase character
/* requires that the MonogoClient library be imported, connects to mongodb*/
// Rascal_Two:: there are like half a dozen different ways to actually "connect" via mongodb module, via this class, actually constructing the class vs calling the static connect method, bypassing the class and using the defaulty exported connect function, etc

const PORT = 2121 //setting a constant to define the location where our server will be listening.
/* specifies port number (currently a local port)*/
//all in caps because its a global constant
require('dotenv').config() //allows us to look for variables inside of the .env file
/* allows you to use the .env file contents within your server.js file (should be included in gitignore file)

you could also write this line as const dotenv = require('dotenv').config();
to make it look like all the other ones
doesn't change the functionality 

allows you to bring in your hidden/non public variables from the .end file, its hidden, for security purposes. Will go to github though if its not in the gitignore file*/


let db, //declare a variable called db but not assign a value
//why do we declare the variable outside here, why at this point in the code? => because we're declaring it globally so we can use it in multiple places
/*gives you your database, establishes database; declare variable for database*/

    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    //declare unique-connection-key to db
    //think of it like an ip address, point database to ... sets dbconnectionStr equal to address provided by MongoDB (DB_string is in the .env config file in line 5, hide your biz)
    dbName = 'todo'
    //declaring a variable and assigning the name of the database we will be using
     // declare name of db into a variable
   
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string.
//also passing in an additional property useUnifiedTopology

//defines how we connect to our mongo DB. useUnifiedTopology.
//useUnifiedTopology. helps ensure that things are returned in a clean manner

    .then(client => { //why are we using then here? because mongoclient is establishing a promise
        //why do we want a promise? because we only want to console.log ect if it was successful!
        //waiting for connection and proceeding if successful, and passing in all client information

        //responding to the client side and saying...
        console.log(`Connected to ${dbName} Database`)
        //log to the console the template literal"connected to todo database"
        //will produce a message in the console if the client connected properly (i.e.,"hey, we made it! we connected to the database named 'todo!")

        db = client.db(dbName); //assigns a variable to previously declared db variable that contains a db factory client method that contains lots of information we can use later
         //Defines the database as 'todo', works with line 15. 
    }) //closing our .then

//would call this following section what? middleware. et you setup a pipeline fron an incoming http request; :communicate between client and db
app.set('view engine', 'ejs') // sets ejs as the default render method
//determing how we're going to use a view (template) engine to render ejs (embedded javascript) commands for our app
app.use(express.static('public')) //sets the location for static assets
//Tells our app to use a folder named "public" for all of our static files/assets e.g. images and Css, main.js files)
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URL's automatically
// Call to middleware that cleans up how things are displayed and how our server communicates withour client (similar to the the body parser useUnifiedTopology above.)
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
//Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
//parses all `application/x-www-form-urlencoded` (aka form) requests contents, extended to support arrays and objects

app.use(express.json()) //parses json content from incoming requests
//tells the app to use Express's json method to take the object and turn it into a JSON string
// so the incoming request body can be interpretted as json

//ROUTES
app.get('/',async (request, response)=>{ //this is a get/read request to the root
    //starts a GET method when the root route is passed in, sets up req and res parameters
    //GET stuff to display to users on the client side (in this case, index.ejs)
    const todoItems = await db.collection('todos').find().toArray()
    //find is blank to say get everything from the collection
    //sets a variable and awaits ALL items from the todos collection

    // create a variable to capture an array of our documents in our collection 'todos' db called

    // setting a constant variable called todoItems
    //  creating a collection called "todos", will go into our database and look for anything in the database called todoItems, and turn it into an array of objects 
   // if you look at the index.ejs file, this is where the todoItems is displayed as an array ul class todoItems

    const itemsLeft = await db //creates a constant in our todos collection    
    .collection('todos') //looks at documents in the collection
    
    .countDocuments({completed: false})     //why a count? because we're going to display how many things are left to do in the EJS render
    
    //counts documents that have a completed status equal to "false"
    //In MongoDB, the countDocuments() method counts the number of documents that matches to the selection criteria. It returns a numeric value
   //we're counting the incomplete todos (where completed:false) and assigning that number to const=itemsLeft "what is still left on the agenda"
   //"completed" is just a property we have set on an item object.

   // there is a completed property on every todo object, which is set to false as the default. Later on we will have a put (edit) route so we can set the completed property to true for completed to do items.

    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sends response that renders all of the number of items from the .countDocuments({completed}) info to our index.ejs 

    //we're doing 2 things, rendering the EJS file and passing through the db items and the count remaining inside of an object. reminder that items is the array we're looping through
    //we plop these items and left straight back into the EJS 5:15:44 mayan's video

    //below is the classic promise version of the code above, as a classic then function instead of await:

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //you could uncomment out this code and it'll catch errors, mayan checked it in her VOD

//no catch so any error is YEETED into the void
})

app.post('/addTodo', (request, response) => { //express method post, which is adding a new todo item
    //starts a POST method when the add route is passed in

    //what will trigger this to run? will come straight from the form 5:33:00, so the form in ejs says EEEYYY server do a post for me will ya? and server says yep, i'm listening at this route for you

    //adding element to our database with a route of /addTodo
    db.collection('todos') //server will go into our collection called "todos"
    .insertOne({thing: request.body.todoItem, completed: false}) 
    //setting ups a new object with 2 keys: thing and completed. 
    // the value for thing, is created from the form's input box which has a name of "todoItem". So the value is created from what the user typed in
    // literally saying: go into our request that is passed to us, grab the body of the request and whats typed into the input box which has the name "todoItem"
// giving it completed false because its a brand new request so it shouldn't be done yet
    //insert one thing named todo item, going to get a status of completed: false aka not completed (i.e. it puts some stuff in there, bye)
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //print "todo added" to the console in the repl for VS Code
        response.redirect('/')//refreshes the EJS page to show that new thing we added to the database on the page
        //why redirect?! Because when you use a form to pass an action, its actually sending us to that route in the browser. so the route becomes localhost/whatever/addToDo so its a path in the browser, so i don't want to stay at this place. I want to go back home, so we redirect from that path back home. 
            // Rascal_Two:that's why whenever you try to go back through a form you get that little popup saying "Are you sure you want to resubmit the form" or something like that
    })
    .catch(error => console.error(error)) //if we weren't able to add anything to the database, we'll see an error message in the console
}) //ending the POST

app.put('/markComplete', (request, response) => { //so telling express to update
    //update in CRUD format, when we click something on the front end...
    db.collection('todos') //going to go into our "todos" collection
    
    .updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the itempassed in fromt he main.js file that was clicked on
        //how do we know what thing to update? matching on the task name inthe database, itemFromJS is being passed to main.js, it passes on the innerText and wrapping it up as json. So it looks in the request, see the body has an itemFromJS

        //in the database it is literally called thing 05:50:00

        //what could be a problem with this? 
            //if there were multiple tasks with the same, it would always delete the first one, not the one you actually click to delete
            //this is why when you build your own apps to USE THE ID value instead
             // Rascal_Two:that's why IDs are unique in the first place PartyHat
        $set: { //setting the completed value to true
            completed: true //Add status of completed equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list

        //trues come up as -1 in the database
        // like rap names, negative means we're taking way from it
     
        upsert: false //doesn't create a document for the todo item if the item isn't found, which we don't want in this case. Its a mix of insert and update. 

        //if upsert: true => upsert will update the db if the note is found and insert a new note if not found
    })
    .then(result => { //assuming everything went okay
        //starting a then if update was successful
        console.log('Marked Complete') //console.log marked complete
        response.json('Marked Complete') //response.json is what is going back to our fetch in main.js
        //why bother to write a response.json? gets put into a variable called data, which is console.logged (within markcomplete function)
        //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //if something broke, show an error message in the console
}) //ending put

app.put('/markUnComplete', (request, response) => { // this route unclicks a thing that you've marked as complete ~ will take away complete status
    // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos') //Go into todos collection

     //look in the db for one item matching the name of the itempassed in fromt he main.js file that was clicked on
    
    .updateOne
    ({thing: request.body.itemFromJS},{ //look for item from itemFromJs
        $set: {
            completed: false //undoes what we did with markComple. It changes "completed "status to "false"
            //set completed status to false
          }
    },{
        sort: {_id: -1}, //???? "unknown js magic" //moves item to the bottom of the list
        upsert: false //prevents insertion if the item does not already exist
    })
    .then(result => { //stars a then if update was successful
        console.log('Marked Complete') //console.log marked complete
        response.json('Marked Complete')  //sending a response back to sender
        //response.json is what is going back to our fetch in main.js, returns response of "makred complete" to the fetch in main.js
       
    .catch(error => console.error(error))
    //something broke, an error is logged to the console
    //catching errors
})

})

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos') // goes into your collection
    
    .deleteOne({thing: request.body.itemFromJS}) //uses deleteOne method and find a thing that matches the name of the thing you clicked on
    //look inside the todos collection for the ONE item that has a matching name from our JS file
    //again recced to use id not the name like "thing" here
    .then(result => { //starts a then if delete was successful
        //assuming everything went okay
        console.log('Todo Deleted')
        //console.log "todo deleted"
        response.json('Todo Deleted')
        //returns response of "todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))
    //something broke, an error is logged to the console

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ 
    // setting up which port we will be listening on - either from the env file but if theres no port in the env file,use the port variable we set up earlier
    //tells our server to listen for connections on the PORT we defined as  constant earlier OR process.env.PORT will tell the server to listen on the port of the app (e.g. the PORT used by heroku)
    console.log(`Server running on port ${PORT}`)    //console.log the port number our server is running on
}); //end the listen method