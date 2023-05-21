//PREP AND PSEUDO CODE
//P = Parameters - what are the parameters that go into the app, to send inputs into the app
    //type into form and press submit button  (inputting data)
    //click on items to delete or mark as completed (changing state of data)
//R = Return/Result - what comes back? pair parameter with result
    //typing into form will return a new item and counter goes up by one
    //clicking on item returns marked as done and is crossed out(formatting change), counter decraments
    //clicking trashcan will remove it from the list and counter decraments (note it's conditional, if you delete an item marked as complete it will not decrament the counter again)
//E = Examples 
    //see what the code is actually doing
//P = Pseudo Code - talk through code in terms of general tasks rather than JS syntax
    //it's going to have a user frontend and a mongoDB backend to store our data, what's happening in the DB?
    //when I submit what do I need to happen? I need an event listener on the button, send something to API that will handle data and send it to the DB
    //create a DB entry/document

    //when I click delete what do I need to happen? specific listener on trashcan, delete req to server API, req to DB
        //what else might it send so the DB knows which item to delete? some kind of identifying information along the req body, for example db ID

    //when I click an item? event listener for a PUT/UPDATE request, flip the completed:true/false flag in the DB, as well as listening to change formatting based on the state of completed

    //what has to happen when we refresh or load page? GET request to server, but also something has to maintain the todo list which is grabbed from the DB
        //refresh has to occur from changes to the page, ie deletion



//CRUD SET UP
//1)npm init
//2)npm install (all dependencies from package.json)
//3)connection string - kept secret inside .env file - touch .env

const express = require('express') //importing express framework
const app = express() //creating new express instance then assigned to app constant
const MongoClient = require('mongodb').MongoClient //allow us to talk to DB, perform operations using methods associated with mongo client, capitalised because it's actually a class, assigned to constant MongoClient
//actually several ways to connect to mongoDB
const PORT = 2121 //setting port constant to port 2121, set listening port location
require('dotenv').config() //allows us for access to variables inside of .env file, called dotenv just because its named that, no secrets

//clean code of assigning multiple variables at once
let db, //just declaring a variable called db, no assignment, why? we need to declare it globally, to be used in multiple places
    dbConnectionStr = process.env.DB_STRING, //declaring variable that goes to .env file and find the DB_STRING variable, assigned to dbConnectionStr
    dbName = 'todo' //declare variable and assign name of DB we will be using, all we've done here is set the specific database, we haven't said anything in regards to collections and documents, that comes later on
    //DB hierarchy 
        //CLUSTER
        //Database(s)
        //Collection(s)
        //Document(s)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //using the mongoclient method to connect to the DB, passing in our connectionStr assigned earlier. Passing in additional property useunified to stop the long deprecation warning once connecting, NOTE can check documentation to see the additional properties
    //try to establish a connection, but it's not guaranteed so can chain additional .thens because mongoclient.connect uses promises, connecting will take time, so once promise is fulfilled. We only want to do this stuff if the connection was successful
    .then(client => { //waiting for connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //console logging that we connected to the DB if successful
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    })//closing our .then callback
    
//this group of code is called middleware, good practice to group it up together
app.set('view engine', 'ejs')   //render ejs file as the default, how we should expect our page to be rendered
app.use(express.static('public')) //sets the location for static assets(html, css imgs etc)
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content, extended part supports arrays/objects
app.use(express.json()) //middleware helps parse the json from the req, built into express


app.get('/',async (request, response)=>{    //the root route passed, GET req triggered by first time load or refresh, asynch too and sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //sets a variable and awaits a count of documents with the completed property set to false, to be later displayed in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering index.ejs and inside the render method, we pass in an object that contains to do items and the items left count
    //if you look at ejs, items.length, items is the array of ALL docs that's looped through to list out on a page
    //just rendered the count straight into the ejs, no manipulation needed
    //NOTE - no error handling

    //classic then version
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //standard POST to /addTodo endpoint, POST is triggered from the form which had a POST method, action to '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //go to todo DB, insert a new object/document, thing property value is the todoitem sent in the the request, and by default set to false, which makes sense since it's a todo item being added, will have no completed formatting. request.body.todoItem comes from name attribute tag
    .then(result => { //if insert was successfl then -
        console.log('Todo Added') //console.log the action
        response.redirect('/')         //redirect back to root, so it will trigger a refresh/page load - when we do a form to pass an action, it actually sends us to that route if this code is excluded you end up in a weird/new path in the browser from submitting the form
    })
    .catch(error => console.error(error))    //always need a catch that will run if the promise is rejected
}) //ending post

app.put('/markComplete', (request, response) => {   //update request, there's an event listener client side that triggers the put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to todoDB, finds the appropriate document to update, matching on text, in main.js fetch, itemFromJS is the JSON in the req body
        $set: {
            completed: true //$set is built in from mongo, it will set that specified document's completed property to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //if value didn't exist it inserts it for us if set to TRUE
    })
    .then(result => {   //similar again, if promise was successful .then runs, which informs that it was completed
        console.log('Marked Complete') //console logging successful completion
        response.json('Marked Complete') //why send json back? json gets sent back to main.js function, awaits response which then gets converted into a string, which is 'Marked Complete'
    })
    .catch(error => console.error(error)) //catch errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //like above but a different route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find specified document
        $set: {
            completed: false    //set it to false this time
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {  //standard express delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //go to todo db, delete specified document in that collection, matches from our js file
    .then(result => { //if deletion successful
        console.log('Todo Deleted') //console log result
        response.json('Todo Deleted') //response back to sender
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{  //settuing up which port we will be listening on - either the port from the .env file or from PORT variable
    console.log(`Server running on port ${PORT}`) //NOTE if running from .env it won't log this correctly
})