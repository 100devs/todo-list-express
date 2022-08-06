//Import express library, setting the result to the express variable
const express = require('express')
//Execute the express function, saving its result to the app variable 
const app = express()
//Import the mongoclient from mongodb library, setting the result to the mongoclient variable.
const MongoClient = require('mongodb').MongoClient
//Declare a variable named PORT with the value 2121
const PORT = 2121
//Import the dotenv library and call its config function. This reads the .env file and exposes the environment variables to this program.

require('dotenv').config()

//Declare a variable named db.
//Declare a variable named dbConnectionStr whose value is the value from the DB_String environment.
//Delcare a variable named dbName with the value todo. This is the mongoDB database we will store todo items in.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Call the MongoClient connect method to connect to our MongoDb database. The useUniface option uses the new unified topolgy layer.. 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//MongoClient.connect returns a promise, which will resolve with .then 
    .then(client => {
        //Log the connected database.
        console.log(`Connected to ${dbName} Database`)
        //Tell the MongoClient to use the dbName database. Store the returned Db class in the db variable.
        db = client.db(dbName)
    })
// Set the express applicaiton view engine setting to use ejs as its rendering engine.
app.set('view engine', 'ejs')
//Tell the express applicaiton to serve static files from the public directory. 
app.use(express.static('public'))
//Tell the express application to automatically parse urlcoded payload. 
app.use(express.urlencoded({ extended: true }))
//Tell the express applicaiton to automatically parse JSON payloads and make that available in the request.body.
app.use(express.json())

//Listen for HTTP GET requests on the '/' route and execute the handler (req / res). It must be async is because we have await within the function. If we don't have it, then we get an error.
app.get('/',async (request, response)=>{
    // Find all documents within the todos collection and return them as an arrary. Store the results in the todoItems variable. Since a promise is returned, we await the promise to resolve or reject. 
    const todoItems = await db.collection('todos').find().toArray()
    // Count the number of documents within the todos collection where the completed field is false. Store the results in the itemsLeft variable. Since a promise is returned we await.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render the index.ejs file with the passed in object. Respond to the client with the rendered content. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

//Listen for HTTP post requests on the '/addTodo' route and executes the handler
app.post('/addTodo', async (request, response) => {
    //This inserts a new document into the todos collection with the fileds thing and completed set. 
    try {
        await db.collection('todos').insertOne({thing: request.body.todoItem, completed: fasle})
        // Log that todo was
        console.log('Todo Added')
        //Redirect the client back to (`/`).
        response.redirect('/')
    } catch(err){
    console.log(err)
} 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
        //Since the above returns a promise, we handle the resolve promise here.
        .then(result => {
            //Log that a todo was added.
            console.log('Todo Added')
            //Redirect the client back to (`/`).
            response.redirect('/')
        })
        //Handle the rejected promise by logging the error.
        .catch(error => console.error(error))
})
//Listen for HTTP PUT requests on the `/markComplete` route and executres the handler.
app.put('/markComplete', (request, response) => {
//Find a document whose thing field matches request.body.itemFromJS and set its completed field to true. When finding a document, sort the documents by object ID in descending order. If no document was found, do not insert a new one.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //If a document was found, set it's completed field to true.
        $set: {
            completed: true
          }
    },{
        //When finding a doucment, sort the documents by object ID in ascending order.
        sort: {_id: -1},
        //If we don't find a document to update, do not create one.
        upsert: false
    })
    //Handle the resolved promise.
    .then(result => {
        //Log that the update was complete.
        console.log('Marked Complete')
        //Response to the client, letting them know the update wasc ompleted.
        response.json('Marked Complete')
    })
        //Handle the rejected promise by logging the error.
    .catch(error => console.error(error))

})
//Listen for HTTP PUT requests on the `/markuncomplete`1 route and executres the handlere. 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Find a document whose thing field matches request.body.itemFromJS and set its completed field to true. When finding a document, sort the documents by object ID in descending order. If no document was found, do not insert a new one.
        //When finding a doucment, sort the documents by object ID in ascending order.
        //If we don't find a document to update, do not create one.
        $set: {
            //If a document was not found, then mark it's false. 
            completed: false
          }
    },{
        sort: {_id: -1},
            //If we don't find a document to update, do not create one.

        upsert: false
    })
    //Handle the resolved promise 
    .then(result => {
        //Log that the update was completed
        console.log('Marked Complete')
        //Response to the client, letting them know the update was completed.
        response.json('Marked Complete')
    })
    //Handle the rejected promise by logging the error.
    .catch(error => console.error(error))

})

//Listen for HTTP DELETE requests on the `/markuncomplete`1 route and executres the handlere. 

app.delete('/deleteItem', (request, response) => {
    //Find a document in the todos collection whose thing field matches request.body.itemFromJs and delete if found.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //Log that the delete was complete
        console.log('Todo Deleted')
        //Resonse to the client, letting them know the delete was complete.
        response.json('Todo Deleted')
    })
    //Handle the rejected promise by logging the error. 
    .catch(error => console.error(error))

})
//Start the express web server, listening on port PORT. PORT is retrieved from the PORT environment variable or the PORT variable if not found.
app.listen(process.env.PORT || PORT, ()=>{
    //Log which port the web server is running on.
    console.log(`Server running on port ${PORT}`)
})

//Completed