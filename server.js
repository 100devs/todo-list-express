const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//connects to the mongoDB
//keep the mongoDB sting in the .env file and have it in the .gitignore
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 
//using EJS as our language
app.set('view engine', 'ejs')
//using the public folder to hold our static files such as CSS and JS files 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//when someone refreses the page or puts the url in, the browser (client side) sends a GET request to the server
//the server then goes into the database and goes in the collection called 'todo', then it counts the documents in that collection
//those documents are really objects, and we can use an array to old all of those objects with toArray()
app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    //data is the array that is holding the objects/doucments from the collection
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        //pass the data array into the ejs template - the array of objects is now called items
        //so when looking in the ejs template we will now be looking for items to respresent the array
        .then(itemsLeft => {
            //the render creates the HTML file bascially and the server responds with it
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

//triggered when people submit the form, comes from the action on the form that makes the POST request; the request body comes with the the submit, and what was typed into the form
//goes into the request body then to toDoItem and grabs the value, then it adds that value to the database
//then we'll respond saying everything went ok and that we should refresh
//once the browser refreshes, it triggers the GET request and it runs the usual loop but now has an additional item
//we are insertting an object into the database, with thing and comopleted properties, and todoItem and false values
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //response is to refresh
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//the mark complete route came from client side JS
app.put('/markComplete', (request, response) => {
    //going to the database, going to the todos collection, and then updating the first document that has a thing property matching the text that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //when it finds the thing, it sets the completed property to true
            completed: true
          }
    },{
        //here we are sorting from top to bottom and saying to update the one that came first if there are two of the same
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        //after updating the value in the database, we respond saying it was marked complete, which is then sent back to to the client side
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//works the same as the above put request but changes the completed to false in the database
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
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


//route from delete matches the client side js
app.delete('/deleteItem', (request, response) => {
    //goes into the database, finds the todo collection and deletes the thing that has the request body itemsFromJs which willl be the one you clicked on
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        //responds saying it was deleted
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})