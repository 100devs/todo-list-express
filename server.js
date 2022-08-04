const express = require('express') // use express 
const app = express() // create an instance of express
const MongoClient = require('mongodb').MongoClient // use mongodb 
const PORT = 2121 // set the port to 2121
require('dotenv').config() // use dotenv configuration


let db, 
    dbConnectionStr = process.env.DB_STRING, // set the db connection string to the DB_STRING environment variable
    dbName = 'todo' // set the db name to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to the database using the dbConnectionStr variable and set the useUnifiedTopology to true
    .then(client => { // if there is no error
        console.log(`Connected to ${dbName} Database`) // log the connection to the database
        db = client.db(dbName) // set the db variable to the client database
    })
    
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(express.static('public')) // use the public folder
app.use(express.urlencoded({ extended: true })) // use the extended option for the urlencoded function
app.use(express.json())


app.get('/',async (request, response)=>{ // create a get route that waits for a request and a response
    const todoItems = await db.collection('todos').find().toArray() // create a variable and assign it to the todos collection and find all the items and convert them to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create a variable and assign it to the todos collection and count the number of items that are not completed and convert them to an array
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the index.ejs file and pass the items and left variables to the ejs file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // create a post route that waits for a request and a response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert the todo item into the todos collection
    .then(result => { // if there is no error
        console.log('Todo Added') // log the todo added
        response.redirect('/') // redirect to the home page
    })
    .catch(error => console.error(error)) // if there is an error
})

app.put('/markComplete', (request, response) => { // create a put route that waits for a request and a response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the todo item in the todos collection
        $set: { // set the completed field to true
            completed: true // set the completed field to true
          }
    },{
        sort: {_id: -1}, // sort the items by the id in descending order
        upsert: false // do not create a new item if one does not exist
    })
    .then(result => { // if there is no error
        console.log('Marked Complete') // log the marked complete
        response.json('Marked Complete') // return the marked complete
    })
    .catch(error => console.error(error)) // if there is an error

})

app.put('/markUnComplete', (request, response) => { // create a put route that waits for a request and a response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the todo item in the todos collection
        $set: { // set the completed field to false
            completed: false // set the completed field to false
          }
    },{
        sort: {_id: -1}, // sort the items by the id in descending order
        upsert: false // do not create a new item if one does not exist
    })
    .then(result => { // if there is no error
        console.log('Marked Complete') // log the marked complete
        response.json('Marked Complete') // return the marked complete
    }) 
    .catch(error => console.error(error)) // if there is an error

})

app.delete('/deleteItem', (request, response) => { // create a delete route that waits for a request and a response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete the todo item from the todos collection
    .then(result => { // if there is no error
        console.log('Todo Deleted') // log the todo deleted
        response.json('Todo Deleted') // return the todo deleted
    })
    .catch(error => console.error(error)) // if there is an error

})

app.listen(process.env.PORT || PORT, ()=>{ // listen for requests on the port specified by the PORT environment variable or on the port 2121
    console.log(`Server running on port ${PORT}`) // log the server running on the port specified by the PORT environment variable or on the port 2121
})