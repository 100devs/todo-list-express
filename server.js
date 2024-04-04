//import express
const express = require('express')
//variable === invoking express === server
const app = express()
//mongoclient imports and uses the mongoclient property
const MongoClient = require('mongodb').MongoClient
//variable for preferred port #
const PORT = 2121
//import dotenv which allows us to not give specific keys/values that are access related
require('dotenv').config()

//declare variables, one which is === db connection string for mongo, that will be pulled out of the .env file, another a variable which holds the collection name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connect to mongo database, using your connection string variable, i believe useUnifiedTopolgy is deprecated, unsure what to use now but have omitted it previously and no errors reported ;/ , after connection log a string to the console, and assign a value to the db variable which is symbolic of our database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//set the templating language
app.set('view engine', 'ejs')
//initalize our public folder to be automatically provided to all files that get rendered, allowing them to pull clientside css and js
app.use(express.static('public'))
//instead of using bodyParser because it's deprecated, we'll use these two trailing use()'s to be able to access the request object
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//root route express method for http get '/'
app.get('/',async (request, response)=>{
    //create 2 variables, first is an array of items in the todo collection, second is a # of the documents in the collection with a completed key that has a value of false
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //after creating those 2 variables render an html file via ejs and passing it both of thsoe variables, items gets used in the ejs for loop, left is used to display the number of documents that don't have a completed key value of true
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

//using express' post method we declare the operation for when a user creates a new 'thing to do' and hits the submit button
app.post('/addTodo', (request, response) => {
    //we call insertOne method from the collection and pass it an object built of a thing key value === what the user typed into the 'thing to do' input element field and give a key completed value of false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //then console.log 'todo added' and redidrenct the user back to the '/' route swhich pretty much uses app.get('/)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//using express' put method we declare the operation for when a use wants to update a todo item, here by marking it as completed, by using the markComplete route
app.put('/markComplete', (request, response) => {
    //invoke the updateOne method and pass it an object that tells it to look for a(query argument) document that has a thing key value of the text that resided in the rendered list item they clicked on (itemFromJs=>itemText variable), and use the set update method to change the completed key in the document to true, and sort the order of documents in descending order; aka completed first via options argument.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //after running console.log 'marked complete' and make a response object back to the client of json format 'Marked Complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


// using express put method we define the operation for when route markUnComplete is requested.
app.put('/markUnComplete', (request, response) => {
    //use the updateOne method on the collection to look for a document via query argument that has a key of thing value of reqeust.body.itemFromJS which is ===pulling out the text from the sibling node (this.parentNode.childNodes[]) of the span you clicked on, and to change the value to the completed key to false via the update argument. Finally useing the options argument we tell it to sort in descending order aka the documents that have true value to completed key are shown above the false completed key value documents.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //once that has been successful we return the result and log marked completed, also return that same string via response.json()
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//using express delete method we define the operation when route 'deleteItem' is requested.
app.delete('/deleteItem', (request, response) => {
    //we call the deleteOne method on the collection and tell it to focus on the document that has a thing key value === request.body.itemFromJS, again which is equivalent to this.parentNode.childNodes[1].innerText value which again refers to the sibling node's text to the node you clicked on which in this instance was the trash can span node
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //after that is complete take the result and console.log it and return it via response.json()
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//listen for activity for this project on a specific port, either use the enviornements port # or use our port variable above
app.listen(process.env.PORT || PORT, ()=>{
    //each time the server runs console.log this which includes the port number
    console.log(`Server running on port ${PORT}`)
})
