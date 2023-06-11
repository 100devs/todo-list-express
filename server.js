//- Add express moduke
const express = require('express')
//- Initialize express
const app = express()
//- Add mongodb module
const { MongoClient } = require('mongodb')
//- Define listen port
const PORT = 2121
//- Import .env file that contains densitive information
require('dotenv').config()

//- Declare db variable to store database
let db
//- Initialize dbConnectionStr with the value from .env file that contains the mongodb uri
let dbConnectionStr = process.env.DB_STRING
//- initialize dbName with a string of todo
let dbName = 'todo'

//- Instantiate a new client
const client = new MongoClient(dbConnectionStr, { useUnifiedTopology: true })

//- async connect function to connect to mongo
async function connect(){
    //- try catch block
    try {
        //- await a client connect
        await client.connect();
        //- set database
        db = client.db(dbName)
        //- console log the connection confirmation
        console.log("Connected to MongoDB");
    }
    //- catch error
    catch (error) {
        //- console log the error
        console.error(error);
    }
}

//- call the connect function
connect();

//- used to set configurations; view engine in this case
app.set('view engine', 'ejs')
//- tells the app to use the public folder for static files
app.use(express.static('public'))
//- middleway that parses requests from forms
app.use(express.urlencoded({ extended: true }))
//- parses requests to allow server to handle JSON data
app.use(express.json())

//- makes a read request to the root
app.get('/', async (req, res) => {
    //- try catch block
    try {
        //- stores all the todo items in an array in the todoItems variable
        const todoItems = await db.collection('todos').find().toArray()
        //- stores the count of incomplete todos and stores the value in itemsLeft
        const itemsLeft = await db.collection('todos').countDocuments({completed: false})
        //- renders the ejs file and passes the items and left queries
        res.render('index.ejs', { items: todoItems, left: itemsLeft })
    //- catch the error
    } catch (error) {
        //- display error on console
        console.error(error)
    }
})

//- this is a create request. the path is the form from the ejs file.
app.post('/addTodo', async (req, res) => {
    //- try catch block
    try {
        //- adds the item inserted into the form into the todos collection
        await db.collection('todos').insertOne({thing: req.body.todoItem, completed: false})
        //- logs that todo was added
        console.log('Todo Added')
        //- redirects to the root again aka refresh
        res.redirect('/')
    //- catch the error
    } catch (error) {
        //- display error on console
        console.error(error)
    }
})

//- update request to mark a todo as complete
app.put('/markComplete', async (req, res) => {
    //- try catch block
    try {
        //- update one value in the database. In this case, the update is to set the completed field to true
        await db.collection('todos').updateOne({thing: req.body.itemFromJS}, {
            //- set completed field to true
            $set: {completed: true}
        },{
            //- sorts opposite (last to first)
            sort: {_id: -1},
            //- upsert is a combination of update + insert. It is used when using update or updateOne. When false, if no combination is found, it doesn't update anything. When true, if no combination is found, a new field/document is added
            upsert: false
        })
        //- logs that mark was complete
        console.log('Marked Complete')
        //- used to send a json response to the client. The purposed of this repsonse is just to assure to the client that the todo is marked as complete
        res.json('Marked Complete')
    //- catch the error
    } catch (error) {
        //- display error on console
        console.error(error)
    }
})

//- update to remove the mark as complete from the todo
app.put('/markUnComplete', async (req, res) => {
    //- try catch block
    try {
        //- update one value in the database. In this case, the update is to set the completed field to false
        await db.collection('todos').updateOne({thing: req.body.itemFromJS}, {
            //- set completed field to true
            $set: {completed: false}
        },{
            //- sorts opposite (last to first)
            sort: {_id: -1},
            //- upsert is a combination of update + insert. It is used when using update or updateOne. When false, if no combination is found, it doesn't update anything. When true, if no combination is found, a new field/document is added
            upsert: false
        })
        //- logs that mark was incomplete
        console.log('Marked Incomplete')
        //- used to send a json response to the client. The purposed of this repsonse is just to assure to the client that the todo is marked as incomplete
        res.json('Marked Incomplete')
    //- catch the error
    } catch (error) {
        //- display error on console
        console.error(error)
    }
})

//- delete method to delete an item from the list of todos
app.delete('/deleteItem', async (req, res) => {
    //- try catch block
    try {
        //- delete one value in the database
        await db.collection('todos').deleteOne({thing: req.body.itemFromJS})
        //- logs that dodo was deleted
        console.log('Todo Deleted')
        //- used to send a json response to the client. The purposed of this repsonse is just to assure to the client that the todo is deleted
        res.json('Todo Deleted')
    //- catch the error
    } catch (error) {
        //- display error on console
        console.error(error)
    }
})

//- listens to the server on the port set
app.listen(process.env.PORT || PORT, () => {
    //- console logs that the server is running
    console.log(`Server running on port ${PORT}`)
})