const express = require('express') //imports express in node.js
const app = express() //calls the express to create an app for application
const MongoClient = require('mongodb').MongoClient //imports mongodb in node.js
const PORT = 2121 //sets up port number for app to listen
require('dotenv').config() // command that loads environment variables from .env file into process.env. separate the sensitive data from code and stored them securely outside the source code


let db, //sets up a database variable
    dbConnectionStr = process.env.DB_STRING, //create a varialbe and set to database key from mongodb

    dbName = 'todo' //created database name and set it to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects tha database to mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //tells user that 'todo' is connected to the database
        db = client.db(dbName) //sets db to hold the collection of todos
    
    })
    
app.set('view engine', 'ejs') //sets ejs as templet language
app.use(express.static('public')) //connects to public folder and loads all the files that are inside 

app.use(express.urlencoded({ extended: true })) //secure data code 
app.use(express.json()) //goes to the data and gets the body text and convert it to JS object



app.get('/',async (request, response)=>{ //gets the path that is requesting
    const todoItems = await db.collection('todos').find().toArray() //Goes to the todos database, goes inside the collection, grabs all the documents and put them an a array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Goes to the todos database, goes inside the collection, and counts all the documents that has completed set in false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //data is put in the ejs templete and response them with ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //goes to the form that has the action of addTodo and gets the text that contains item and add it to the todos database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Goes to the todos database, goes inside the collection and adds a new todo item to the collection and set completed to false
    .then(result => {
        console.log('Todo Added') //lets user know that a new todo item is added to the database
        response.redirect('/') //Let user know that it went okay and reloads the page and makes a get request that grabs all the todo items including the new one that was just added
    })
    .catch(error => console.error(error))//notify an error if fail to procces a post request
})

app.put('/markComplete', (request, response) => {//updates an existing todo item 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Goes to the todos database, goes inside the collection and updates the todo item that is looking for
        $set: {
            completed: true//set completed from false to true
          }
    },{
        sort: {_id: -1},//sorts the todo items from top to bottom and finds the first item its looking for and update it
        upsert: false//does not create a new todo item if item does not exist
    })
    .then(result => {
        console.log('Marked Complete')//let user know that update has been complete
        response.json('Marked Complete')//response that everything went okay and todo item is completed
    })
    .catch(error => console.error(error))//notify an error if fail to update

})

app.put('/markUnComplete', (request, response) => {//updates an existing todo item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Goes to the todos database, goes inside the collection and updates the todo item that is looking for
        $set: {
            completed: false//update the status completed from true to false
          }
    },{
        sort: {_id: -1},//sorts the todo items from top to bottom and finds the first item its looking for and update it
        upsert: false//does not create a new todo item if item does not exist
    })
    .then(result => {
        console.log('Marked Complete') //let user know that update is complete
        response.json('Marked Complete') //response user that it went okay and updates the todo item
    })
    .catch(error => console.error(error)) //notify if an error occur if fail to update

})

app.delete('/deleteItem', (request, response) => {//deletes a todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//Goes to the todos database, goes inside the collection and deletes the item that is looking for
    .then(result => {
        console.log('Todo Deleted')//let user know that the todo item is deleted
        response.json('Todo Deleted')//response user that it went okay and deletes the todo item
    })
    .catch(error => console.error(error))//notify if an error occur if fail to delete

})

app.listen(process.env.PORT || PORT, ()=>{ //listen for the PORT number to run the server
    console.log(`Server running on port ${PORT}`) //let user know server is up and running
})