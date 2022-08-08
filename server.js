const express = require('express')//require express to be used
const app = express()// set app to be express so I don't need to write express out each time
const MongoClient = require('mongodb').MongoClient //require mongodb
const PORT = 2121 // set the port to be 2121
require('dotenv').config() //require the .env file that will contain my mongodb config string


let db,
    dbConnectionStr = process.env.DB_STRING, // this pulls the mongodb string from the .env file
    dbName = 'todo' // this is the name of the mongodb collection

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to mongodb collection
    .then(client => { // once connected, do the following
        console.log(`Connected to ${dbName} Database`) //console log that we're connected to the todo database
        db = client.db(dbName) // sets db to the database name
    })
    
app.set('view engine', 'ejs') // 
app.use(express.static('public')) // if there is a public folder, just give those files out
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{ // listen for a get request on main
    const todoItems = await db.collection('todos').find().toArray() // go to the db todos, find all the objects and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// go to the db todos, and count how many objects have the completed attribute set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// render the ejs with the items, todoItems and the items left and respond with the html

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {// listen for a post request to add something to the to do list db
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// go to the db todos and create a new object from the body and give it a completed state of false
    .then(result => { // once the above code is done, do this
        console.log('Todo Added')// console log todo added
        response.redirect('/')// after the new item has been added, redirect them back to the main page and force a new get request
    })
    .catch(error => console.error(error))// if there is an error, console log it
})

app.put('/markComplete', (request, response) => {// listen for a different put request to mark an item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go to the db collection of todos, and update the item that gets pulled from the body
        $set: { // change an attribute
            completed: true // change the completed attribute to true
          }
    },{
        sort: {_id: -1}, // sort the array in descending order
        upsert: false // this will not create a new document since it is just updating
    })
    .then(result => { // once the above code is done, do this next
        console.log('Marked Complete') // console log that the item is marked as completed
        response.json('Marked Complete') // send json that says marked complete
    })
    .catch(error => console.error(error)) // if there is an error, console log it

})

app.put('/markUnComplete', (request, response) => { // listen for a put request to mark something as uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go to the db todos and update the item from the body that was sent with the request in the itemFromJS
        $set: { // change the attribute of the object
            completed: false // change the completed attribute to false
          }
    },{
        sort: {_id: -1}, // sort the array in descending order
        upsert: false //this will not create a new document since it is just updating
    })
    .then(result => { // was the above code is done, run this
        console.log('Marked Complete') // console log that the item is marked complete
        response.json('Marked Complete') // respond with json that says it is marked complete
    })
    .catch(error => console.error(error)) // if there is an error, console log the error

})

app.delete('/deleteItem', (request, response) => { // listen for a delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go to the collection of todos, and delete the object with the itemFromJS in the body of the response
    .then(result => { // once the above code is complete, do this next
        console.log('Todo Deleted') // console log todo deleted
        response.json('Todo Deleted') // respond with json that the todo was deleted
    })
    .catch(error => console.error(error)) // if there was an error, console log the error

})

app.listen(process.env.PORT || PORT, ()=>{ // have the server listen for requests on the port given by the environment its hosted on, or by the provided PORT variable
    console.log(`Server running on port ${PORT}`) // once the server is running, console log Server is running on port (whatever port is given)
})