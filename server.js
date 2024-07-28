const express = require('express') //creating the connection express app
const app = express() //storing the object/properties and methods of express into app to just when using methods
const MongoClient = require('mongodb').MongoClient //connection for application to mongoDB
const PORT = 2121 //setting up the port for local hosting as a variable
require('dotenv').config() //needed for the env file connection


let db, //instaitating  variable db(unkown), dbstring as variable to be found in env file, and dbName to console where what DB is being used
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //string to connect Mongodb specifically to corrent database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //redefining db and with the client.dbmethod
    })
    
app.set('view engine', 'ejs') //setting ejs as the template language thae is being used
app.use(express.static('public'))//letting express know that the static files are in the public folder in relation to the root
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) //converting the objects used in express to Json


app.get('/',async (request, response)=>{ //creating the root of the page using async infront of second param
    const todoItems = await db.collection('todos').find().toArray() //go to DB and go to collections then conver the collection of object into an array-store in variable itemas
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //store the amount of object in todo as items left variable 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //after you get all this info send it over to ejs to use to render html
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//the creation of new content 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //telling the db what objects/properties to add to the DB
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //queing the get request to update page with new db information
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // the update request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //telling the db what to update-int this case the 
        //maybe find the "thing" that matches name itemFromJs from client side js put which reflects the item that was clicked in the dom 
        $set: {
            completed: true //js is sending info to server side to say hey this is completed then updating in db
          }
    },{
        sort: {_id: -1},//sorting it in reverse order
        upsert: false //this means you do not want object to be instatiated if it not already apart od the DB
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')//sending to JS to notify it is completed--> leading to the location reload
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {//same as above but only for objects who were thing property is set true 
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

app.delete('/deleteItem', (request, response) => { //deleting the object from the db- clientside js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// the item from js isn the variable stored in the clientside js during the click event
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //use the port provided by the hosting site if not then use the port stored in the variable object
    console.log(`Server running on port ${PORT}`)
})