const express = require('express')  //adds express module
const app = express()   //instantiation of express framework into app variable
const MongoClient = require('mongodb').MongoClient  //adds mongodb module
const PORT = 2121 //localhost:2121 port
require('dotenv').config()  //allows for the .env file to contain DB_STRING 


let db,
    dbConnectionStr = process.env.DB_STRING,    //defines the mongodb hosting port within the .env file
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //connects to mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')   //allows for the use of index.ejs template
app.use(express.static('public'))   //adds middleware for serving static files to express app (in this case the style.css and main.js files)
app.use(express.urlencoded({ extended: true }))     //body parser functionality without having to use body parser package
app.use(express.json())     //parses incoming JSON requests and puts parsed data in req. body


app.get('/',async (request, response)=>{    //get request for the main route. 
    const todoItems = await db.collection('todos').find().toArray() //Puts documents in mongodb into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //Counts all documents with completed property of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders an HTML file from index.ejs template. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {       //post request from form with the action of '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})     //adds a document with thing property from user input ('thing') and completed property of false by default
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')  //refreshes the page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {   //put request from markComplete function in main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     //Sets completed property of clicked span inner text to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},    //sort descending
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {     //put request from markUnComplete function in main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     //Sets completed property of clicked span inner text to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},    //sort descending
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {      //delete request from deleteItem function in main.js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //Deletes document in mongodb
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{      //listens for connections in specified ports
    console.log(`Server running on port ${PORT}`)
})