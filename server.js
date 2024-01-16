const express = require('express')//to access after express after installing it
const app = express()//place in app the contents of express
const MongoClient = require('mongodb').MongoClient//importing info from mongodb to MongoClient
const PORT = 2121//to which port were hosting our server
require('dotenv').config()//to be able to use .env


let db,//declare db
    dbConnectionStr = process.env.DB_STRING,//place connection string of database to variable
    dbName = 'todo'//initialize database name labeled as todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//function to establish connection to database
    .then(client => {//to promopt connection
        console.log(`Connected to ${dbName} Database`)//display to console if connected to database
        db = client.db(dbName)//storing to db the reference to the database
    })
    
app.set('view engine', 'ejs')//tell express that we will be using ejs as view engine
app.use(express.static('public'))//in the public folder make connections to all inside it
app.use(express.urlencoded({ extended: true }))//to handle form submissions
app.use(express.json())//to tell the express to use json


app.get('/',async (request, response)=>{//async function for the landing page
    const todoItems = await db.collection('todos').find().toArray()//to find the database and turn the information to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//count the documents inside the db that is not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//to render the data to ejs format
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//post/create method from the form in index.ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//create one that is not completed yet in the db
    .then(result => {//check if data is added
        console.log('Todo Added')//print to the console that data was added
        response.redirect('/')//refresh the page
    })
    .catch(error => console.error(error))//catch the error then print to the console if there is one
})

app.put('/markComplete', (request, response) => {//update method from the client js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//to update one data in the db
        $set: {
            completed: true//mark it true meaning in the index.ejs the class completed will take action
          }
    },{
        sort: {_id: -1},//sort by id in descending order
        upsert: false//if the criteria isnt matched then no data will be inserted in the db
    })
    .then(result => {//to check if it completed
        console.log('Marked Complete')//log the message
        response.json('Marked Complete')//respond in json the message
    })
    .catch(error => console.error(error))//catch an error and then log it

})

app.put('/markUnComplete', (request, response) => {//update mmethod from the client js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update one that satisfies the condition
        $set: {
            completed: false//set it to false meaning in the index.ejs it returns it to normal or uncomplete
          }
    },{
        sort: {_id: -1},//sort it by id in descending order
        upsert: false//if condition isnt found dont update any data.
    })
    .then(result => {//if found and everything ran
        console.log('Marked Complete')//log the message in the console
        response.json('Marked Complete')//sending marked complete as message to the client
    })
    .catch(error => console.error(error))//catch an error and then log it

})

app.delete('/deleteItem', (request, response) => {//delete method from the client js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete one that satisfies and finds the request
    .then(result => {//if the request was found and satisfied   
        console.log('Todo Deleted')//log todo deleted
        response.json('Todo Deleted')//send todo delete as message to the client
    })
    .catch(error => console.error(error))//catch an error and then log it

})

app.listen(process.env.PORT || PORT, ()=>{// binds the port for the server to listen in the cloud host or the PORT that was assigned
    console.log(`Server running on port ${PORT}`)// log the message if server was successfully connected
})