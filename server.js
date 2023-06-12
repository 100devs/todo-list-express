const express = require('express') //lets this file use express
const app = express() // app variable that calls express
const MongoClient = require('mongodb').MongoClient //use methods with MongoClient and talks to database
const PORT = 2121 //port variable set to 2121
require('dotenv').config() //looks for variables in the .env file


let db, //variable called db
    dbConnectionStr = process.env.DB_STRING, //variable assigned to database connection string in .env file
    dbName = 'todo' //variable for the name of database - 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creates a MongoDB connection using the connection string
    .then(client => { //waits for database connection to pass in client information
        console.log(`Connected to ${dbName} Database`) //logs to console a connection message
        db = client.db(dbName) //assigns the previous db variable to db method
    })
    
app.set('view engine', 'ejs') //uses EJS for template engine
app.use(express.static('public')) //finds static assets in the public folder - images, css, etc.
app.use(express.urlencoded({ extended: true })) //express will decode/encode URLs 
app.use(express.json()) //parse JSON from requests


app.get('/',async (request, response)=>{ //GET method when root page is called
    const todoItems = await db.collection('todos').find().toArray() //variable for all items from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //variable for items that aren't completed yet in 'todos' collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //uses EJS to render the todo items and counts how many are remaining
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //POST method when addTodo page is called
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds a new item into the 'todos' collection and gives it a false value for the completed property
    .then(result => { //waits for new item to successfully be added
        console.log('Todo Added') //logs the message 'Todo Added'
        response.redirect('/') //redirects back to the home page
    })
    .catch(error => console.error(error)) //catches errors and logs any error message
})

app.put('/markComplete', (request, response) => { //PUT method when markComplete is called
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //checks in the 'todos' collection for the item that was clicked on
        $set: {
            completed: true //updates the completed value from false to true
          }
    },{
        sort: {_id: -1}, //sorts the todo items, moves the new item to the bottom of the list
        upsert: false //makes sure item doesn't already exist in the database
    })
    .then(result => { //waits for update item to be successful
        console.log('Marked Complete') //logs 'Marked Complete' message to console
        response.json('Marked Complete') //sends a response back to sender
    })
    .catch(error => console.error(error)) //catches errors and logs any error message

})

app.put('/markUnComplete', (request, response) => { //PUT method for calling markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //checks in the 'todos' collection for the item that was clicked on
        $set: {
            completed: false //updates the completed value from true to false
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false //makes sure the item doesn't already exist
    })
    .then(result => { //waits for update item to be successful
        console.log('Marked Complete') //logs 'Marked Complete' message to console
        response.json('Marked Complete') //sends a response back to sender
    })
    .catch(error => console.error(error)) //catches errors and logs any error message

})

app.delete('/deleteItem', (request, response) => { //DELETE method when deleteItem is called
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // checks 'todos' collection for item that was clicked on
    .then(result => { //waits for delete item to be successful
        console.log('Todo Deleted') //logs 'Todo Deleted' message to console
        response.json('Todo Deleted') //sends response back to sender
    })
    .catch(error => console.error(error)) //catches errors and logs any error message

})

app.listen(process.env.PORT || PORT, ()=>{ //uses either declared port variable in ENV file or port set
    console.log(`Server running on port ${PORT}`) //logs console message with port value
})