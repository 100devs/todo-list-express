
const express = require('express') //makes us use express methods in the file
const app = express() //assigning express to a variable app
const MongoClient = require('mongodb').MongoClient //make it available to talk to database and use mongoDB methods 
const PORT = 2121 //sets up a port where our server will listen to  
require('dotenv').config() //allows to look for variables inside an env file


let db, //asign varaible db
    dbConnectionStr = process.env.DB_STRING, //find the variable DB_STRING in .env file and assign it to variable dbConnectionStr
    dbName = 'todo' //assign a name todo to the db Name. 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to the mongoDB and passing in connection string
    .then(client => {   //if promises resolves, then pass in all the client information
        console.log(`Connected to ${dbName} Database`) //to console log that the db is connected 
        db = client.db(dbName) //assigning mongodb objects to the 'db' variable
    })
    
app.set('view engine', 'ejs') //sets that ejs will be used for site rendering method
app.use(express.static('public')) //sets the location static assets 
app.use(express.urlencoded({ extended: true })) // method to parse the information
app.use(express.json()) //parse JSON content from incoming requests


app.get('/',async (request, response)=>{ //read information from the root using the GET method 
    const todoItems = await db.collection('todos').find().toArray() //awaits, access the db and find all the data of objects, convert it into an array and store it in todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //awaits, access db and counts that have property of completed:false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //send the response to render in the index.ejs file, having item as the objects of todoItems and left as count of itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create using the POST request and that came with the route of /addTodo 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // from the dbcollection of todos, insert item and manually putting completed:false 
    .then(result => { //if insert is successful, then 
        console.log('Todo Added') //console log that todo is added
        response.redirect('/') //respond to the browser by redirecting to the main page 
    })
    .catch(error => console.error(error)) //if insert is not successful, console log the error 
})

app.put('/markComplete', (request, response) => { //updating using the PUT method, with the route of /markComplete 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //from the todos collection of db, look for the item matching the name of the item passed in from the main.js file that was clicked
        $set: { //set completed to true 
            completed: true
          }
    },{
        sort: {_id: -1}, //sort the id in descending order (move to the botttom of the list)
        upsert: false //prevents item from inserting if there is no match 
    })
    .then(result => { //if update is successful
        console.log('Marked Complete') // console log complete
        response.json('Marked Complete') //and respond back to the client browser with a completed message
    })
    .catch(error => console.error(error)) //if any error occurs, display the error 

})

app.put('/markUnComplete', (request, response) => { //updating using the PUT method, with the route of /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //from the todos collection of db, look for the item matching the name of the item passed in from the main.js file that was clicked
        $set: { //set completed to false 
            completed: false
          }
    },{
        sort: {_id: -1}, //sort the id in descending order (move to the botttom of the list)
        upsert: false //prevents item from inserting if there is no match 
    })
    .then(result => { //if update is successful 
        console.log('Marked Complete') //console.log complete
        response.json('Marked Complete') //respond back to the client broswer with a complete message 
    })
    .catch(error => console.error(error)) //if error occurs, display the error 
 
})

app.delete('/deleteItem', (request, response) => { //delete item by the DELETE method with the route of /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //from the todos collection db, delete an item that matches the name of the item passed in from the main.js 
    .then(result => { //if the deleting was successful 
        console.log('Todo Deleted') //console log msg 
        response.json('Todo Deleted') //respond back to the client browser with a msg
    })
    .catch(error => console.error(error)) //if error occurs, display the error 

})

app.listen(process.env.PORT || PORT, ()=>{ //listen to the port with the env variable PORT 
    console.log(`Server running on port ${PORT}`) //console log the msg 
})
