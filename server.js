const express = require('express') //Asking the server to require express 
const app = express() //Assigning express to the constant app
const MongoClient = require('mongodb').MongoClient //Asking the server to require Mongodb
const PORT = 2121 //Assigning a port to connect to the server. 
require('dotenv').config() //requiring dotenv configuration


let db,
    dbConnectionStr = process.env.DB_STRING, //assigning the connection string in the .env file to dbConnectionStr 
    dbName = 'todos'//assigning the collection in the database a name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect function
    .then(client => { //this function is performed after the connection has occured
        console.log(`Connected to ${dbName} Database`)//confirms successful connection to db in console log
        db = client.db(dbName) //assigning the connected database to db for ease of use
    })
    
app.set('view engine', 'ejs') //setting ejs as our view engine
app.use(express.static('public')) //servs static files from the public folder - css, js, images, ect.
app.use(express.urlencoded({ extended: true }))  //accept URL-encoded data
app.use(express.json()) //recognize incoming requests as JSON objects

//front page async get request, when visiting the url, this is the first thing to happen. 
app.get('/',async (request, response)=>{ 
    //get database collection 'todos', find everything, turn it into an array, wait for it to return the array, then assign the array to todo items 
    const todoItems = await db.collection('todos').find().toArray() 
    //get database collection todos, count how many entries are inside, wait until count is complete and assign that number to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the index.ejs files. items will contain the todoItems array, left will contain how many items are markedUncomplete in the database
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

//on post request from /addTodo, do the following:
app.post('/addTodo', (request, response) => {
    //go to database collection 'todos', insert an object, thing property set to the data entered in the addToDo form, completed property set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //then console log 'todo added' to confirm action. 
    .then(result => {
        console.log('Todo Added')
        //Redirect us to the original get request. 
        response.redirect('/')
    })
    //catch any errors, console log the error error
    .catch(error => console.error(error))
})

//on put request from /markComplete, do the following:
app.put('/markComplete', (request, response) => {
    //go to database collection 'todos', update one item that has property thing matching entry in itemFromJS form. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed property, of the previous object, to true
        $set: {
            completed: true
          }
    },{
        //sort in decending values, oldest change at the top, youngest at the bottom
        sort: {_id: -1},
        //if there's no match for the thing property, do not create and insert a new object. 
        upsert: false
    })
    //console log 'Marked Complete' to confirm action
    //send response.json 'marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch any errors, console log the error error
    .catch(error => console.error(error))

})

//on put request from /markUncomplete, do the following:
app.put('/markUnComplete', (request, response) => {
    //go to database collection 'todos' update property thing to itemFromJS entry
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed property to false
        $set: {
            completed: false
          }
    },{
        //sort in decending values, oldest change at the top, youngest at the bottom
        sort: {_id: -1},
        //if there's no match for the thing property, do not create and insert a new object. 
        upsert: false
    })
    .then(result => {
         //console log 'Marked Complete' to confirm action
        //respond with some JSON saying 'marked complete'
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //handle any errors and console log them
    .catch(error => console.error(error))

})
//on delete request from /deleteItem, do the following:
app.delete('/deleteItem', (request, response) => {
    //go to database collection 'todos' and delete the object with the thing property matching the input from itemFromJS form
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //then console log and respond with JSON saying 'todo Deleted' to confirm action
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //handle and console log any errors
    .catch(error => console.error(error))

})
//listen request to host server on the enviroment variable port, if there is none host it on PORT 
app.listen(process.env.PORT || PORT, ()=>{
    //console log server is running on the port assigned to confirm action
    console.log(`Server running on port ${PORT}`)
})