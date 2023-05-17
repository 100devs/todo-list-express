const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient //importing mongoDB 
const PORT = 2121
require('dotenv').config() //when hosting, tells the host we need this file


let db, //we need db variable from connection to access mongoDB
    dbConnectionStr = process.env.DB_STRING, //DB_STRING is that long string that contains my username and password to connect to mongoDB
    dbName = 'todo' //db's namer is todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //useunified to stop the long deprecation warning once connecting
    .then(client => { //asynch operations, mongo supports promises, connecting will take time, so once promise is fulfilled, we can console log that we connected to the right DB
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //db which was just a variable with no assignment to a variable is now reassigned to todo
    })
    
app.set('view engine', 'ejs')   //render ejs file
app.use(express.static('public')) //send along all the static files in public in response
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) //middleware helps parse the request


app.get('/',async (request, response)=>{    //default page get request, but asynch this time
    const todoItems = await db.collection('todos').find().toArray() //await so goes to todo db, finds all documents of the todo collection and returns it as an array, todoitems is now an array of all these docs
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //go to todo collection, but we assign itemsLeft to all the documents that have the property completed value as false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //after doing all the above, we render index.ejs with an object inputted which is the todoItems to items property and items left for the left property, we use objects because ejs works with objects

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //standard post express
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //go to todo DB, insert a new object/document, thing property value is the todoitem sent in the the request, and by default set to false, which makes sense since it's a todo item being added
    .then(result => { //again db supports promises so once above is done, we console log to say it was successful and trigger a redirect this is important as it'll do this chain of events
        console.log('Todo Added')
        response.redirect('/')         //get req -> server to db -> array of todo collection -> array inputted into ejs -> ejs generates html with new todo item included -> html sent in response
    })
    .catch(error => console.error(error))    //always need a catch that will run if the promise is rejected
})

app.put('/markComplete', (request, response) => {   //update request, there's probably an event listener client side that triggers the put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to todoDB, finds the appropriate document to update
        $set: {
            completed: true //$set is built in from mongo, it will set that specified document's completed property to true
          }
    },{
        sort: {_id: -1}, //sorts the order of the todo by id descending
        upsert: false
    })
    .then(result => {   //similar again, if promise was successful then runs, which informs that it was completed
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //like above but we do it in reverse
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find specified document
        $set: {
            completed: false    //set it to false this time
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

app.delete('/deleteItem', (request, response) => {  //standard express delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //go to todo db, delete specified document in that collection
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{  //need process.env.PORT if we host it on providers like Hiroku/cyclic etc
    console.log(`Server running on port ${PORT}`)
})