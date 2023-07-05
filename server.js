const express = require('express') // making it possible to use express
const app = express() // saving express call to app var
const MongoClient = require('mongodb').MongoClient // making it possible to use mongodb
const PORT = 2121 // setting the var to the port number
require('dotenv').config() //allows us to look for variables in the env file 


let db, // declares a var called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a var and assigning it to hte DB string in the env file 
    dbName = 'todo' // declaring a var todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongodb and passsing in cstring and passing in addition property
    .then(client => { // waiting for the connection and proceeding if successful
        console.log(`Connected to ${dbName} Database`) // logs to console connected to todo
        db = client.db(dbName) // assigning a value to db variable containing a db client factory method
    })
    
    //middleware
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLS when the header matches the content 
app.use(express.json()) // helps parse JSON content 


app.get('/',async (request, response)=>{ // starts a GET request when the root route is passed in it sets up a req and res 
    const todoItems = await db.collection('todos').find().toArray() // find things from the todos collection and makes them an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a var and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the ejs file and passing in the items and the count that comes from the db 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a post request that has a route of addTodo and has a req and res
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // creates item for the todos collection and inserts the item and gives it a thing and completed property
    .then(result => { // waits for the insert then delivers the result
        console.log('Todo Added') // logs string 
        response.redirect('/') // then gets rid of apptodo route and redirects to root route 
    })
    .catch(error => console.error(error)) // catches errors and logs error message
})

app.put('/markComplete', (request, response) => { // starts a PUT method when the mark complete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //  updates one of the items that match the itemFromJS in the todos collection
        $set: { // starts a set
            completed: true // sets the completed to true 
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist 
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logs it as complete
        response.json('Marked Complete') // render the JSON amd marks it as complete
    })
    .catch(error => console.error(error)) // catching errors

})

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the mark Uncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //  updates one of the items that match the itemFromJS in the todos collection
        $set: {  // starts a set
            completed: false // sets the completed to true 
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist 
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // logs it as complete
        response.json('Marked Complete')   // render the JSON amd marks it as complete
    })
    .catch(error => console.error(error)) // catches error

})

app.delete('/deleteItem', (request, response) => {  // starts a DELETE method when the delete ITEm route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection to find the item with matching JS
    .then(result => {// Starts a then if delete was successful 
        console.log('Todo Deleted') // logs deleted
        response.json('Todo Deleted') // responds to sender that wit deleted
    })
    .catch(error => console.error(error)) /// logs error

})

app.listen(process.env.PORT || PORT, ()=>{ // sets up to listen on which port either in the ENV file or PORT
    console.log(`Server running on port ${PORT}`) // logs where its listening
})