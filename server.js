const express = require('express') //making it possible to use express
const app = express() //storing express and its methods in a constant called app
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoDB
const PORT = 8000 // defined the location our server will be listening
require('dotenv').config() // allows us to look for variables in the .env file


let db, //declaring a variable for later use
    dbConnectionStr = process.env.DB_STRING, //assigning our connection string from .env to the variable.
    dbName = 'todo' //assigning the name of the database to a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongoDB, passing in the connection string
    .then(client => { //waiting for the connection, then if the promise goes through, passing in the client information
        console.log(`Connected to ${dbName} Database`) // logging in the console that the connection was succesful, w/ the template literal putting in the name of the database itself.
        db = client.db(dbName) //assigning a value to a previously declared variable that contains the client info 
    })
    
    //middleware
app.set('view engine', 'ejs') //showing that we are using ejs to render out and view html
app.use(express.static('public')) // this states that anything in the "public" folder can be used by express. Specifically for "static" assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) //telling express to read json data. 


app.get('/', async (request, response)=>{ //read part of CRUD. SHows that the base route passed in, then sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //creates a variable and waits for all of the items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // createsd a variable and waits for the umber of documents in which the key:value pair is completed:false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // the response will be rendered through EJS. The variables initiated earlier will be represented in EJS as items, and left.    
    // db.collection('todos').find().toArray()          //same thing, but using promises instead of async/await
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a post method when the add route is passed in (coming from the form)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // we are inserting something new into the todos collection. It is specifying the key:value pairs from the request body(in ejs form) and the completion status, which is static. 
    .then(result => { //after the insertion is =succeful, someting happens
        console.log('Todo Added') //console.logging what happened
        response.redirect('/') //redirecting the browser to go to the main page, essentially a "refresh"
    }) //closing
    .catch(error => console.error(error)) //catching any errors that might occur. 
})

app.put('/markComplete', (request, response) => { //starts a put method that updates something when the /markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates something with a specific request, whatever the "itemfromJS" from the form is. Innertext of the span being clicked.
        $set: { //changing the completed key:value 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list. 
        upsert: false //prevents insertion if item does not already exist. 
    })
    .then(result => { //after the update is succesful, something happens
        console.log('Marked Complete') //logging to the console that it was complete.
        response.json('Marked Complete') //sending this so it can be logged by the client
    })
    .catch(error => console.error(error)) //catching any errors

})

app.put('/markUnComplete', (request, response) => { //this whole thing is the same as the above method, except that it changes an item in the dtabase to completed:false rather than the other way around.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates something with a specific request, whatever the "itemfromJS" from the form is. Innertext of the span being clicked.
        $set: { //changing the completed key:value
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list. 
        upsert: false //prevents insertion if item does not already exist. 
    })
    .then(result => { //after the update is succesful, something happens
        console.log('Marked Complete') //logging to the console that it was complete.
        response.json('Marked Complete') //sending this so it can be logged by the client
    })
    .catch(error => console.error(error)) //catching any errors

})

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete rout is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looking for the name that is passed in from EJS, looking for the ONE item in the collection
    .then(result => { //if delete succesfull
        console.log('Todo Deleted') //consoe.llog succes completion
        response.json('Todo Deleted') //sending the response back to clientside
    }) //closing then
    .catch(error => console.error(error)) //catching errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //settting up which port we'll be using. If there is no port in the ENV file, then we will be using the PORT variable from above.
    console.log(`Server running on port ${PORT}`) //console.log the running port. 
})