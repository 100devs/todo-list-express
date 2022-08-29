const express = require('express') // tells application that express will be used
const app = express() // app variable is created to tell computer when to use express 
const MongoClient = require('mongodb').MongoClient // connects app to mongo database
const PORT = 2121 // port variable created for local server
require('dotenv').config() // using the dotenv module to store configuration in environments separate from code (used to hold DB string)

let db, // declare db variable but assign nothing to it
    dbConnectionStr = process.env.DB_STRING, // dbConnectionStr variable to store the DB string within the dotenv file
    dbName = 'todo' // dbName variable assigned todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // promise syntax asking to connect using mongo client using the connection string, using unified topology design as node driver
    .then(client => { //what to do when promise is fulfulled 
        console.log(`Connected to ${dbName} Database`) // console log the name of the DB connected
        db = client.db(dbName) // assign something to database variable
    })

// middleware
app.set('view engine', 'ejs') // allowing for use of ejs
app.use(express.static('public')) // telling app/express to use public folder to serve any static files
app.use(express.urlencoded({ extended: true })) // telling app/express how to understand incoming queries that are formatted as URL
app.use(express.json()) // telling app/express to format objects as JSON


app.get('/',async (request, response)=>{ // promise syntax for a request form the root route
    const todoItems = await db.collection('todos').find().toArray() // todoItems variable that awaits finding the items in the database collection and creates an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // itemsLeft variable that acounts the items in the database with completed set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // once promise is fulfilled use ejs to render a page using todoItems and itemsLeft

    // a longer way to say the above 
    // db.collection('todos').find().toArray() // find a database collection labelled todos and create an array
    // .then(data => { // what to do if promise is fulfilled
    //     db.collection('todos').countDocuments({completed: false}) // if an object has a completed component that is set to false, count how many there are
    //     .then(itemsLeft => { 
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // once promise is fulfilled use ejs to render a page that includes the items that are left as well as how many items are left
    //     })
    // })
    // .catch(error => console.error(error)) // if promise is not fulfilled, console log the error
})

app.post('/addTodo', (request, response) => { // promise syubntax for creating new todos
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // look for a database collection with a name of todos and insert/create a document with thing from ejs with id of todoItem and with the completed set to false
    .then(result => { // if promise is fulfilled
        console.log('Todo Added') // console log that it has been added
        response.redirect('/') // refresh page
    })
    .catch(error => console.error(error)) // if promise is not fulfilled, console log the error
})

app.put('/markComplete', (request, response) => { // promise syntax for updating todos
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the todos collection and update the thing with what follows
        $set: { //$set operator that allows updating of specific fields
            completed: true //set completed to true
          }
    },{
        sort: {_id: -1}, //sort list with todos 
        upsert: false // prevents creating/adding new documents if queried document is not found
    })
    .then(result => { // if primise is fulfilled
        console.log('Marked Complete') //console log that it has been completed
        response.json('Marked Complete') //provide a JSON object telling us marked complete is sent back to client JS as part of fetch
    })
    .catch(error => console.error(error)) // if promise is not fulfilled console log the error

})

app.put('/markUnComplete', (request, response) => { // promise syntax for updating todos
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in todos collection and update the thing with what follows
        $set: { // $set operator that allows updating of specific fields 
            completed: false // set completed to false
          }
    },{
        sort: {_id: -1}, // sort list with todos
        upsert: false // prevents creating/adding new documents if queried document is not found
    })
    .then(result => { // if promise is fulfilled 
        console.log('Marked Complete') // console log it has been completed 
        response.json('Marked Complete') // provide a JSON object telling us marked complete is sent back to client JS as part of fetch
    })
    .catch(error => console.error(error)) // if promise is not fulfilled console log the error

})

app.delete('/deleteItem', (request, response) => { // promise syntax for deleting todos
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in todos section and delete the thing that matches 
    .then(result => { // if promise is fulfilled
        console.log('Todo Deleted') //console log that it is deleted
        response.json('Todo Deleted') // provide a JSON object telling us that the todo was deleted and send it back to client JS as part of fetch
    })
    .catch(error => console.error(error)) // if promise is not fulfilled, console log the error

})

app.listen(process.env.PORT || PORT, ()=>{ // listen for server on the port within the dotenv file or PORt method provided by hosting service
    console.log(`Server running on port ${PORT}`) //console log that server is running and on which port (if concealed port in dotenv, would not want to do this)
})