const express = require('express') //import the express library.
const app = express() //create an express application and call it app.
const MongoClient = require('mongodb').MongoClient //import the mongoClient library.
const PORT = 2121 //set the default port that the server will listen on.
require('dotenv').config() //import the dotenc library and run the config method.


let db, //declare a variable named db to represent our database.
    dbConnectionStr = process.env.DB_STRING, //declare a variable to hold our connection string. Assign it the value that is in our .env file.
    dbName = 'todo' //declare a variable to hold our database name and name it todo.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Make a connection to the mongoDB server. Use our connection string from '.env'.  UseUnifiedTypology - false by default. Set to true to opt in to using the MongoDB driver's new connection management engine. You should set this option to true, except for the unlikely case that it prevents you from maintaining a stable connection. 
    .then(client => {//If the connection is made log to server that we are connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //name our database the value in 'dbname'.
    })
    
app.set('view engine', 'ejs')//Tell our app to set the view engine to ejs
app.use(express.static('public'))//Tell our app to serve all the files in 'public' as static files.
app.use(express.urlencoded({ extended: true }))//Tell our app to use the express middleware urlencoded method to parse form data into the request body. The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(express.json())//tell our app to use the express middleware that parses json.


app.get('/',async (request, response)=>{//handle get request to root route
    const todoItems = await db.collection('todos').find().toArray()//get an array of the todos from the db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//get the count of items that are not complete from the db
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//respond by rendering the array of items and the items left count into the index.ejs file

    //Promise chain way of doing things
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//handle a post request to '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Insert the todo stored in 'todoItem' in the request body into the db
    .then(result => {//If successful log 'Todo Added' to the server console then respond with a redirect to root.
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //If our db query has an error run this method which prints the error to the console.
})

app.put('/markComplete', (request, response) => {//handle a put request to '/markComplete'.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Go to db and update a todo document. The thing to update is called itemFromJS in the request body.
        $set: { //Set that todo to complete
            completed: true
          }
    },{
        sort: {_id: -1}, //Sort the todo list by id in descending order.
        upsert: false //Don't make a new db document if no document is found.
    })
    .then(result => { //If we get a result return it to our client side fetch as json and log it to the server console. 
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //If we get an error log it to the server console.

})

app.put('/markUnComplete', (request, response) => {//handle a put request to '/markUncomplete'.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Go to db and update a todo document. The thing to update is called itemFromJS in the request body.
        $set: {//Set that todo to not complete
            completed: false
          }
    },{
        sort: {_id: -1},//Sort the todo list by id in descending order.
        upsert: false //Don't make a new db document if no document is found.
    })
    .then(result => {//If we get a result return it to our client side fetch as json and log it to the server console. 
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//If we get an error log it to the server console.

})

app.delete('/deleteItem', (request, response) => {//handle a delete request to '/deleteItem'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete the todo named itemFromJs in the request
    .then(result => {//If we get a result return 'Todo Deleted' to our client side fetch as json and log it to the server console. 
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))//If we get an error log it to the server console.

})

app.listen(process.env.PORT || PORT, ()=>{//tell the server/app to listen on the port listed in our .env file or the hardcoded port we declared earlier 
    console.log(`Server running on port ${PORT}`)//Log to server that our server is running on port 'PORT'
})