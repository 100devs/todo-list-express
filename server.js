const express = require('express') //allows us to use express dependency
const app = express() //stores the method in a variable
const MongoClient = require('mongodb').MongoClient //allows us to use mongodb dependency
const PORT = 2121 //storing the port number in a variable
require('dotenv').config() //connect to db using by using the .env file without putting the credentials in the files


let db, //find db
    dbConnectionStr = process.env.DB_STRING, //find connecting sting db
    dbName = 'todo' //find db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongodb using connection string variable which holds the db string, useUnified to opt in to using the MongoDB driver's connection management engine. Should be set to true but its false by default.
    .then(client => { //then
        console.log(`Connected to ${dbName} Database`) //print to console that we're connected to db
        db = client.db(dbName) //create variable to hold db name
    })

//middleware
app.set('view engine', 'ejs') //choosing what view engine we want to use to push the data to, in this case ejs
app.use(express.static('public')) //anything in the public folder, use it and it serves them up
app.use(express.urlencoded({ extended: true })) //read URLs
app.use(express.json()) //parse json

//Read method
app.get('/',async (request, response)=>{ //wait for a request for the root route, when heard, run the API which is this get request.
    const todoItems = await db.collection('todos').find().toArray() //await and find the db collection 'todos' and turn it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //await and find the db collection 'todos' and counts the number of documents that matches to the selection criteria
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //respond with the HTML file as an array of objects, giving the values above a property name
    
    //THIS IS USING OLDER SCHOOL WAY (PROMISE CHAINS)
    // db.collection('todos').find().toArray()
    // .then(data => { DATA IS HOLDING THE ARRAY
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) PASSING ARRAY INTO EJS TEMPLATE, GAVE DATA (ARRAY OF DOCUMENTS) THE NAME OF ITEMS 
    //     })
    // })
    // .catch(error => console.error(error))
})
//Create method
app.post('/addTodo', (request, response) => { //wait for a request for the /addTodo action on the form, when heard, run the API which is this post request.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //go to the collection 'todos' and create a new document with the object property: value structure
    .then(result => { //then
        console.log('Todo Added') //print to console 'Todo added'
        response.redirect('/') //run app.get method and to refresh page
    })
    .catch(error => console.error(error))
})
//Update method
app.put('/markComplete', (request, response) => { //wait for a request for the /markComplete route, when heard, run the API which is this get request.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to the collection 'todos' and update the item taken from the main.js file that stored the item requested from the ejs file
        $set: { //replaces the value of a field with the specified value.
            completed: true //change to true
          }
    },{
        sort: {_id: -1}, //sort by id
        upsert: false //combination of update and insert
    })
    .then(result => { //then
        console.log('Marked Complete') //print to console
        response.json('Marked Complete') //respond as json
    })
    .catch(error => console.error(error)) //if the above does not work, print the error in the console

})
//Update method
app.put('/markUnComplete', (request, response) => { //wait for a request for the /markUnComplete route, when heard, run the API which is this get request.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to the collection 'todos' and update the item taken from the main.js file that stored the item requested from the ejs file
        $set: { //replaces the value of a field with the specified value.
            completed: false //change to false
          }
    },{
        sort: {_id: -1}, //sort by id
        upsert: false //combination of update and insert
    })
    .then(result => { //then
        console.log('Marked Complete') //print to console
        response.json('Marked Complete') //respond as json
    })
    .catch(error => console.error(error)) //if the above does not work, print the error in the console

})
//Delete method
app.delete('/deleteItem', (request, response) => { //wait for a request for the deleteItem route, when heard, run the API which is this get request.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go to the collection 'todos' and delete the item taken from the main.js 
    .then(result => { //then
        console.log('Todo Deleted') //print to console
        response.json('Todo Deleted') //respond as json
    })
    .catch(error => console.error(error)) //if the above does not work, print the error in the console

})

app.listen(process.env.PORT || PORT, ()=>{ //specifies the port on which we want our app to listen to. In this case either use the PORT in the env file or the PORT stated above
    console.log(`Server running on port ${PORT}`) //if the port hears the request, it will respond with the template literal stated
})