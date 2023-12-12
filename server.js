//1
//require express framework stored in express function
const express = require('express')
//create variable assigned to express function
const app = express()
//require mongodb connection
const MongoClient = require('mongodb').MongoClient
//default port to run on local server
const PORT = 2121
//require environment file
require('dotenv').config()

//2
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todos'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 
//3
//express uses ejs for client view, can be anything - React
app.set('view engine', 'ejs')
//express uses public folder for static files - css & client side JS
app.use(express.static('public'))
//express uses parser to grab parts (strings) from URL
app.use(express.urlencoded({ extended: true }))
//express passes back json 
app.use(express.json())

//4
// code for read (get) request
app.get('/', async (request, response) => {
    //sends get request when root link submitted
    const todoItems = await db.collection('todos').find().toArray(); //searches for all todo objects in db and turns it to array holding these todo objects
    const itemsLeft = await db
      .collection('todos')
      .countDocuments({ completed: false }); // counts the number of todo objects which are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }); // renders HTML index.ejs with variables todoItems and itemsLeft. Then sends rendered HTML to client.
  
    //   same code but with promise chain instead of async function.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
  });

//5
//express post method (create)
//client submits form -> post is executed
//form with action addTodo, passes in a request and response parameter
app.post('/addTodo', (request, response) => {
    //goes to database (db), checks db 'todos' collection of objects
    //inserts (insertOne) string taken from input 
    //db creates new todos object with properties (thing, completed) and assigns values (string from input, false)
    //thing property is taken from views/index.ejs/input with name of todoItem
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //if promise is successful .then method runs
    .then(result => {
        //console logs
        console.log('Todo Added')
        //server redirects clients to root, where client side code will do something
        response.redirect('/')
    })
    //if promise fails, an error will be logged in console
    .catch(error => console.error(error))
})

//6
//express put method (update)
//root markComplete page, passes in a request and response parameter
app.put('/markComplete', (request, response) => {
     //goes to database (db), looks for collection 'todos'
    //updates object property (thing) and 
    db.collection('todos')
    .updateOne(
         //sorts collection documents by id in desc order
         //if matching document is not found, a new document will not be inserted.
        { thing: request.body.itemFromJS },
        { $set: { completed: true, }, },
        { sort: { _id: -1 }, 
        upsert: false, }
    )
    //if successful console logs and responds with json
      .then((result) => {
        console.log('Marked Complete');
        response.json('Marked Complete'); 
      })
      //if fails logs error
      .catch((error) => console.error(error));
  });

//7
//express put method (update)
//root markUncomplete page, passes in a request and response parameter
app.put('/markUnComplete', (request, response) => {
    //goes to database (db), looks for collection 'todos'
    //updates object property (thing) and 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets completed property to false
        $set: {
            completed: false
          }
    },{
        //sorts collection documents by id in desc order
        sort: {_id: -1},
        //if matching document is not found, a new document will not be inserted.
        upsert: false
    })
    //if successful console logs and responds with json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if fails logs error
    .catch(error => console.error(error))

})

//8
// deletion method
app.delete('/deleteItem', (request, response) => {
    // sends delete request to route /deleteItem
    db.collection('todos') // the collection which document will be deleted
      .deleteOne({ thing: request.body.itemFromJS }) //assigns client request to a key 'thing'
      .then((result) => {
        console.log('Todo Deleted'); //logs success msg
        response.json('Todo Deleted'); // responds with success json
      })
      .catch((error) => console.error(error)); //logs error if it persist
  });

//9
//express listens for port from host or local port assigned to connect
app.listen(process.env.PORT || PORT, ()=>{
    //if connected, logs to console
    console.log(`Server running on port ${PORT}`)
})
