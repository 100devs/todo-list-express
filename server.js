const express     = require('express')// Reuries the express package
const app         = express()//Init's that express package
const MongoClient = require('mongodb').MongoClient// Requries Mongo DB
const PORT        = 2121 //Sets port to execute
require('dotenv').config() // Holds secret variables like MongoDB keys or tokens, exists outside of code. (Ignored in git ignore)


let db,//Establish some vars
    dbConnectionStr = process.env.DB_STRING,//Secret db string to connect to it
    dbName          = 'todo'//Name of DB
//Mongo API code to connect to Mongo DB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//Unified Topology = keeps open watch on the connection to make sure the data is ready. More efficient but as stable yet.

    .then(client => {
        console.log(`Connected to ${dbName} Database`)//Log that were connected
        db = client.db(dbName)//Take client, connect to database, set it to this var

    })
    
app.set('view engine', 'ejs')//Set the settings for the express app we assigned earlier.
app.use(express.static('public'))//Middleware - Look in public folder for routes we call up later., btwn call /response
app.use(express.urlencoded({ extended: true }))// Setting
app.use(express.json())// Setting

//The async makes sure the response ONLY sends when the response actually exists
app.get('/',async (request, response)=>{ //app.get when the client requests something. Code executed sends a response
    const todoItems = await db.collection('todos').find().toArray()//Get todo items from db in array form
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Get count of Items in todos that hve the completed status of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Create a response that contains the above two vars.
    // db.collection('todos').find().toArray() => More efficient, one DB connection, and filters out completed:false items bc you already got them
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) Catches any errors just in case.
})

app.post('/addTodo', (request, response) => { //.Post, or update or create stuff.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// Open a connection, insert a thing
    //This is bad because no validation is done.
    .then(result => {
        console.log('Todo Added')//Let us know that we succesfully added a todo
        response.redirect('/')//Go back to the route screen.
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {//Update parts of the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Change the todos, update one to be true.
        $set: {//Change the todo.
            completed: true
          }
    },{
        sort  : {_id: -1},   //Sort by ID: Decending to smallest so it ends up last?
        upsert: false        // Update + insert; updates the rendering so you don't double add stuff.

    })
    .then(result => { //Second do
        console.log('Marked Complete')//Let us know it's completed
        response.json('Marked Complete')//Let the client know it worked.
    })
    .catch(error => console.error(error))//If error shove it in the console log.

})

app.put('/markUnComplete', (request, response) => { //Update our document round 2: fight the man
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // change this one todo
        $set: {
            completed: false  // We didn't actually do this todo it's undone.
          }
    },{
        sort  : {_id: -1},   //Sort by ID, this guy goes last
        upsert: false        //Dont add a double
    })
    .then(result => { //Sets up the result in case we want to use it later but we don't use it now
        console.log('Marked InComplete') //Let us know it didn't work
        response.json('Marked InComplete') //Let them know it didn't work
    })
    .catch(error => console.error(error))// Issues

})

app.delete('/deleteItem', (request, response) => { // Delete an item 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//Delete the todo
    .then(result => {//Again result, if you want it later
        console.log('Todo Deleted')//It wokred, to server
        response.json('Todo Deleted')//It worked, to client
    })
    .catch(error => console.error(error))//Problems

})

app.listen(process.env.PORT || PORT, ()=>{//This is where we listen to the PORT, first one is herokus set one or else
    console.log(`Server running on port ${PORT}`)//Show where server is running.
})