const express = require('express')  //get the function for express
const app = express()       //instantiate express and assign app to it
const MongoClient = require('mongodb').MongoClient  //get the mongoclient object and assign it to MongoClient
const PORT = 2121           //choose a port number, you chose 2121
require('dotenv').config()  //Grab the .env file containing secret data you didn't want to share/push publically


let db,                                         //db will be set to the database later
    dbConnectionStr = process.env.DB_STRING,    //dbConnectionStr is the secret string used to connect to the database, stored in .env
    dbName = 'todo'                             //your database name is 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //connect to your mongo database with the secret string. the topology setting removes support for several connection options that aren't relevant any more, clearing up deprecation warnings
    .then(client => {           //with the result of the connection (called client),
        console.log(`Connected to ${dbName} Database`)  //log that we're connected to the database
        db = client.db(dbName)  //and set db to the collection in question by accessing it through the client object using the db name value
    })
    
app.set('view engine', 'ejs')               //this sets it up so when we cast render() it will expect ejs format
app.use(express.static('public'))           //middleware that makes files in the public folder usable
app.use(express.urlencoded({ extended: true }))     //converts request body to JSON and some other functionalities like converting form data to JSON
app.use(express.json())         //converts request body to JSON


app.get('/',async (request, response)=>{        //when the home page is hit up, we trigger this.
    const todoItems = await db.collection('todos').find().toArray()     //Find all the items in the database, put them in the array toDoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //itemsLeft is the number of items in the database that were marked false in the completed property
    response.render('index.ejs', { items: todoItems, left: itemsLeft })     //render dat stuff
    // db.collection('todos').find().toArray()         //get all the items from the database again
    // .then(data => {                          //and then, with those items,
    //     db.collection('todos').countDocuments({completed: false})    //count how many are incomplete again
    //     .then(itemsLeft => {                         //and with that number,
    //         response.render('index.ejs', { items: data, left: itemsLeft })       //render the data and the number using EJS to the client
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {           //when you're sent to the addTodo endpoint as a POST
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //add an item marked as incomplete, the item's content is found in body.toDoItem
    .then(result => {           //and theennnnnnnnn
        console.log('Todo Added')       //log it in the backend that you added it
        response.redirect('/')      //and refresh the client
    })
    .catch(error => console.error(error))   //if something went wrong, log it in the back
})

app.put('/markComplete', (request, response) => {       //triggered when the markComplete endpoint is hit as a put
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     //we're going to alter the item in the database whose thing property contains body.itemFromJS, this is the filter parameter
        $set: {                 //$set is a mongoDB operator that means you'll be REPLACING the value specified ahead:
            completed: true             //so the value of the completed property will be REPLACED with true
          }             //btw this $set chunk is the update parameter
    },{
        sort: {_id: -1},        //sort the items in the database in reverse order by the _id property, i think
        upsert: false       //upsert = false means if it didn't find an existing document, it won't make one. (default)
    })
    .then(result => {       //afterward, 
        console.log('Marked Complete')      //log that you marked the item as completed
        response.json('Marked Complete')    //and send the completion note back to the place that ran the request (as JSON, weirdly)
    })
    .catch(error => console.error(error))   //log an error if it happened

})

app.put('/markUnComplete', (request, response) => {     //triggered when the markUnComplete endpoint is hit via put
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     //we're gonna alter the item in the database whose thing property contains body.itemFromJS
        $set: {     //this whole chunk is the same as last chunk btw.  $set is a mongoDB operator that means you'll REPLACE the value specified ahead.
            completed: false        //so the value of the completed property will be REPLACED, but this time with false.
          }
    },{
        sort: {_id: -1},        //sort the documents in reverse order
        upsert: false       //don't add this item if you can't find an existing version (it's the default behavior anyway)
    })
    .then(result => {       //and then
        console.log('Marked Complete')  //log that you marked it as complete (leon obviously was supposed to write mark uncomplete but CTRL Ved it)
        response.json('Marked Complete')    //send the notice back to the requester that you marked it as complete (again, he means uncomplete)
    })
    .catch(error => console.error(error))   //and log any error

})

app.delete('/deleteItem', (request, response) => {      //when you hit the deleteItem endpoint (as a DELETE request)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})      //delete the item from the db whose thing property is body.itemFromJS
    .then(result => {       //and THENNNNNNN
        console.log('Todo Deleted')     //log that you did that
        response.json('Todo Deleted')       //and send a reply to the request, also saying you deleted the entry
    })
    .catch(error => console.error(error))       //and log any errors

})

app.listen(process.env.PORT || PORT, ()=>{      //This line tells the express object to start the server listening on the port from the .env file, or from the PORT value you chose on line 4 if the .env file isn't there
    console.log(`Server running on port ${PORT}`)   //when it's running, log this to let us know!
})