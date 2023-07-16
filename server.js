const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
// Above, we require various dependencies - express, mongodb, dotenv - and assign variables to them. We assign a variable to the port we are going to use as well. 


let db,
    dbConnectionStr = process.env.DB_STRING,// The dbConnectionStr is saved to the .env file. If you have a .env file, you need to npm install dotenv and require dotenv.
    dbName = 'todo-list-db' // this is the name of the database that we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //The code above connects our server to the MongoDB database using our database connection string. 
    //useUnifiedTopology: true? "opt in to using the MongoDB driver's new connection management engine"(https://mongoosejs.com/docs/5.x/docs/connections.html).
    // Following this, we use a template literal to display the name of the database to the console and outline which database we are using.
    
app.set('view engine', 'ejs') // This line tells our app to use EJS as its view engine.
app.use(express.static('public')) //This line tells our app to use the public folder for static files.This means that all of the files in our public folder are served up automatically.
app.use(express.urlencoded({ extended: true })) // This line tells our app to use the body-parser middleware. This is how we can get the data from the text.
app.use(express.json()) //This line tells our app to use the body-parser middleware.
// What is body-parser middleware? "Body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body" (https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express)

// For app.get and all following types of requests, we are using promises (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to serve our data and catch any errors. 
app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})
// With the app.get method above, we go to the 'todos' collection in our database, find all the 'todos', then format them in an array. When we have the array the .then method starts, firstly counting the number of 'todos' which have not been completed {completed: false} and then those items are rendered via index.ejs to the DOM with the number of items which are 'left' to be completed. If there is an error, the .catch method will write the error to the console.

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
// When someone adds a Todo using the client-side form, the app.post method goes to the 'todos' collection, inserts the new Todo using the MongoDB .insertOne method and then refreshes the client-side (leading to a new app.get request) so that the new Todo is listed along with the previous Todos.

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
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
// The app.put method updates the data in the database. The above /markComplete update grabs the db.collection, uses the mongoDB updateOne method to grab the item which the user has clicked on and uses the mongoDB $set operator to change the 'completed' status to 'true'. 
// "An upsert performs one of the following actions: Updates documents that match your query filter,Inserts a new document if there are no matches to your query filter"(https://www.mongodb.com/docs/drivers/go/current/fundamentals/crud/write-operations/upsert/#std-label-golang-upsert-definition)

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
// The app.put method updates the data in the database. In the app.put, /markUnComplete, code above the 'completed' todo is set to 'false' which results in the /markUnComplete request to fire. 


app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// The app.delete method goes to the database collection, uses the .deleteOne method to delete the item which was clicked, then the page is refreshed with the deleted item not showing any longer. 

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
// The app.listen method listens to make sure the port is active and console.logs to say the server is running.