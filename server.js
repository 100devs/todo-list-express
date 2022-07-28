//MODULES
const express = require('express')//Requires that Express be imported into Node
const app = express() //Create Express application
const MongoClient = require('mongodb').MongoClient//Requires that MongoClient library be imported
const PORT = 2121//Establishes local port on port 2121
require('dotenv').config()//Allows you to bring in hidden environmental var.


let db, //Creates DB
    dbConnectionStr = process.env.DB_STRING,//Sets dbConnectionStr equal to address provided by MongoDB (DB_STRING is in the env config file in line 5)
    dbName = 'todo'//Defines how we connect to our Mongo DB. useUnifiedTopology helps ensure that things are

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//MIDDLEWARE    
app.set('view engine', 'ejs')//Determines how we're doing to use a view (template) engine to render ejs )embedded JS) commands for our app
app.use(express.static('public'))// Tells our app to use a folder named "public" for all of our static files (ue imgs and css files)
app.use(express.urlencoded({ extended: true }))//Call to middleware that cleans up how things are displated and how our server communicates with our client (Similar to useUnifiedTopology above.)
app.use(express.json())//Tells the app to use Express's json method to take the object and turn it into a JSON string

//ROUTES
app.get('/',async (request, response)=>{ // GET stuff to display to users on the client side (in this case, index.ejs) with an asynchronous function
    const todoItems = await db.collection('todos').find().toArray()// Create a constant calle "todoitems" tjat foes into our database, breating a collection called "todos", find anything in that database, and turn it into an array of objects
    const itemsLeft = await db // Creates a constant in our todos collection
        .collection('todos')// Looks at documents in the collection
        .countDocuments({completed: false}) // the .countDocuments method counts the cumber of documents that have a completed status equal to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Sends response that renders the number of documents in our collect and the number of items left (items that don't have "true" for "completed") in index.js -- ask them what is still left to do on the agenda
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    //Adds item to our database via route /addTdo
    db.collection('todos')// Server will fo into our collection called "Todos"
        .insertOne({thing: request.body.todoItem, completed: false})// Insert one "thing" named todoItem with a status of "compeleted" set to 'false' (ie it puts osme stuff in there)
        .then(result => {
            //Assuming that everything went okay...
        console.log('Todo Added')// Print "Todo Added" to the console in the repl for BS Code
        response.redirect('/') // Refreses index.ejs to show that new thing we added the database, we see an error message in the console
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    // UPDATE, When we click something on the frontend...
    db.collection('todos')//Going to go into our "todos" collection
        .updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of "completed" equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1},
        //Once a thing has been marked as completed, this removes it from the todo list, sorts the array by descending order by id
        upsert: false //Doesn't create a document for todo if the item isn't found
    })
    .then(result => { //Assuming that eveything went okay and we for a result..
        console.log('Marked Complete') //Console.log "Marked Complete"
        response.json('Marked Complete') //Returns response "Marked Complete"
    })
    .catch(error => console.error(error))// If something is broke, an error is logged to console

})

app.put('/markUnComplete', (request, response) => {// This route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos')//Go into todos collection
        .updateOne({thing: request.body.itemFromJS},{// Look for item from itemFromJS
        $set: {
            completed: false //Undoes what we did with mark Complete - changes "completed" status to "false"
          }
    },{
        sort: {_id: -1},//Useless JS magic
        upsert: false //Doesn't create a document for todo if the item isn't found
    })
    .then(result => { //Assuming that eveything went okay and we for a result..
        console.log('Marked Complete')//Console.log "Marked Complete"
        response.json('Marked Complete')//Returns response "Marked Complete"
    })
    .catch(error => console.error(error))// If something is broke, an error is logged to console

})

app.delete('/deleteItem', (request, response) => { //DELETE
    db.collection('todos') //Goes into collection
        .deleteOne({thing: request.body.itemFromJS}) //Uses deleteOne method and find a thing that matches the name of the thing you clicked on
    .then(result => { //Assuming all is well..
        console.log('Todo Deleted') //Console.log "Todo Deleted"
        response.json('Todo Deleted')//Return response of "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))// If something is broke, an error is logged to console

})

app.listen(process.env.PORT || PORT, ()=>{ //Tells our server to listen for connection on the PORT we defined a const earlier  OR process,env.PORT will tell the server to listen on the portt of the app ( ie the PORT used by heroku)
    console.log(`Server running on port ${PORT}`) //Console log the port number or server is running on
})
