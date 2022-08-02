//start VOD at 4:36:08  

const express = require('express') //requiring express package that we installed
const app = express()//initializing the package so we can use it, this call to express we are saving to a variable called app
const MongoClient = require('mongodb').MongoClient//requiring the MongoDB and client in a variable so we can access it
const PORT = 2121//PORT runs here which is ;compatible with heroku
require('dotenv').config()//holds secret thingies like variable keys (need to put them in heroku as enviromental variables)


let db,//shorten up variables so less typing (empty)
    dbConnectionStr = process.env.DB_STRING,//look here for the enviromental variable connection string    
    dbName = 'todo'//variable assignmentnpm 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connect to the db using string above
//unifiedTypology - opt in for a new version of MongoDB connection (stays alive), better performance
    .then(client => { //after connecting then do: (function)
        console.log(`Connected to ${dbName} Database`)//let us know we connected correctly
        db = client.db(dbName)// asssign the db variable from line8
    })
    
app.set('view engine', 'ejs')//set the options for the express app we assigned earlier
app.use(express.static('public'))//middleware, called after request and before response, look in public folder for routes we call up later, comes between the request and response
app.use(express.urlencoded({ extended: true }))//settings
app.use(express.json())//settings


app.get('/',async (request, response)=>{ //client requests the route page => we send back these or errors
    const todoItems = await db.collection('todos').find().toArray()//wait for the db to reply, convert the documents from the db into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//wait for the db to reply, grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//show us the stuff, send us the index.js and data that are todo items

    //below commented code, counting the documents that are false and responding with the items that are left. Benefit of using the above code opposed to below code, in the above code we only have one connection, we don't need the below code opening a second connection filtering for false values?? Is this correct. The one connection above allows for faster parsing. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //2nd part of try/catch, if error found let us know
})

app.post('/addTodo', (request, response) => { //update & create of CRUD. with every request you must have a response (lookup I'm a little teapot) 404 error and such
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//add a new item ot our todo list on db, insert in the body of the todoItem and automatically set it to false for completed
    .then(result => { //
        console.log('Todo Added')//let us know that we successfully added a todo
        response.redirect('/')//go back to the route screen or homepage
    })
    .catch(error => console.error(error))//here is your error

app.put('/markComplete', (request, response) => {//difference between put & post, put updaetes a piece of data & post adds new 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//change the todo. filter and update 
        $set: {
            completed: true//mark it as complete
          }
    },{
        sort: {_id: -1},//modifier, sorting by ID, setting the order by decending. Going from the biggest ID to lowest ID. Biggest ID first would mean newest ID first?Sorting newest to oldest? This is not updating the id, just changing their order. 
        upsert: false//update + insert = upsert.  It won't update and upsert at the same time??
    })
    .then(result => {//
        console.log('Marked Complete')//let us know it worked
        response.json('Marked Complete')// let the client iknow it worked
    })
    .catch(error => console.error(error))//if error show it is console.log

})

app.put('/markUnComplete', (request, response) => {//put method is update, 2nd round of updating our document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//change this one todo
        $set: {
            completed: false//we didn't actually do this todo so it's undone 
          }
    },{
        sort: {_id: -1},// sorting by id again
        upsert: false//don't add a double
    })
    .then(result => { //result is declared, but we're not using it, doesn't need to be there, it's there just in case we need it later
        console.log('Marked Complete')// typo, one of these should be incomplete,  let us know it worked
        response.json('Marked Complete')// let client know it worked
    })
    .catch(error => console.error(error))//let us know there is error

})

app.delete('/deleteItem', (request, response) => {//delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete 
    .then(result => {//says the delete is done
        console.log('Todo Deleted')//delete worked, to server
        response.json('Todo Deleted')//it worked to client
    })
    .catch(error => console.error(error))// error,something broke

})

app.listen(process.env.PORT || PORT, ()=>{// this is where we listen to the PORT, first one is for heroku's set one or else use the one we declared, use the one we declared on line4 (pipe?)
    console.log(`Server running on port ${PORT}`)//server let's us know we are connected 
}
)})