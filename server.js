//Setting up express requiring express
const express = require('express')
//Setting express to the variable app
const app = express()
//Setting up the database
const MongoClient = require('mongodb').MongoClient
//Setting the local host port
const PORT = 2121
//Setting up the environment configuration
require('dotenv').config()

//Setting up the database name and connecting the string
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //Console logging to verify successful connection to database
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //Express is setting the Views EJS template
app.set('view engine', 'ejs')
//Express is handling the public folder with client side js and css
app.use(express.static('public'))
//Express is using the urlencoded method
app.use(express.urlencoded({ extended: true }))
//Express is handling the js object notation
app.use(express.json())

//express handling a get request to the main route. its saying go to the database and find an the 'todos' collection and put the data in an array
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    //Setting the uncompleted todos in a variable called itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render the response in the views which will be the completed and the items left to do.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//Express is handling a post request on the addTodo route
app.post('/addTodo', (request, response) => {
//The request says go to the collection 'todos' and insertOne to do Item in the body in the 'thing' category of the todos collection. Its false because its not completed yet.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
//Console log 'Todo Added' once todo is posted.
        console.log('Todo Added')
//Refresh the page
        response.redirect('/')
    })
//Let us know if theres an error
    .catch(error => console.error(error))
})
//Express is handling a put (update) request.
app.put('/markComplete', (request, response) => {
//Go to the database, find the 'todos' collection and from the body of data Update 'thing:' using .itemFromJS to set the value to completed. (line through)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //console log marked complete and respond with javascript object notation.
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Let us know if there is an error
    .catch(error => console.error(error))

})
//Express handling a put (update) request of markedUncomplete
app.put('/markUnComplete', (request, response) => {
//go to the database find a collection called todos and update one "thing:" using .itemFromJS(line through) to change the body of data to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
    //Console log if it was successful
    //Respond with a json object
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
//Let us know if theres an error
    .catch(error => console.error(error))

})
//Express handling delete request.
app.delete('/deleteItem', (request, response) => {
    //go to the database, find the collection todos and delete one "thing:" in the body of data using the itemFromJS (trashcan)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
    //console log if the todo was completed
        console.log('Todo Deleted')
    //respond back with a json object
        response.json('Todo Deleted')
    })
    //let us know if there was an error
    .catch(error => console.error(error))

})
//Express is listening for the server
app.listen(process.env.PORT || PORT, ()=>{
//console logging if the server is running and what port its on
    console.log(`Server running on port ${PORT}`)
})