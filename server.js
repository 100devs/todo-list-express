//Requires the server to use express
const express = require('express')
const app = express()
//Requires the server to use MongoDB
const MongoClient = require('mongodb').MongoClient
//This is the local port
const PORT = 2121
//Requires the server to use env and configures it.
require('dotenv').config()

//storing our database connection in a variable? 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Read - part of crud.
//This .get is express doing the heavy lifting. Getting everything it knows about the request. 
app.get('/',async (request, response)=>{
//.find = finding all of these objects from the database and turning them into an array
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
/*Pass the array of objects into our EJS template which spits out HTML that the server responds with that 
HTML and that is how we can see the objects on the client side. */
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
//Create part of CRUD. Runs after it hears the /addTodo form action in the index.ejs 
app.post('/addTodo', (request, response) => {
    //Goes to database and adds a new document to the todo collection. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //the request body comes from the form. The "thing" will be the new list item in the form of a document in our collection.
    .then(result => {
        console.log('Todo Added') // we can see in the console if adding the item from the form was successful.
        response.redirect('/') //respond with a refresh to trigger a new get which goes to our collection and shows the new document.
    })
    .catch(error => console.error(error))
})
//Update part of CRUD.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //the request body comes from the form. 
        $set: {
            completed: true
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
//Update part of CRUD
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, //sorting the uncompleted items on the list
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //tells us in the console log that the object was marked complete.
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//DE-LE-TE part of CRUD
//Smurf from our client side JavaScript Main.js listening here
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted') //tells us in the console log that the object was deleted. 
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//The process.env.PORT lets Heroku run our app on any server they want. The PORT is the local server defined above. 
app.listen(process.env.PORT || PORT, ()=>{
    //This console log message will let us know the server is working properly
    console.log(`Server running on port ${PORT}`)
})