
//set  address of the express dependcies
const express = require('express')
//initialize express, returns pointer to express object 
const app = express()
//same requirement language as before
const MongoClient = require('mongodb').MongoClient
//sets default port if we don't name a particular one
const PORT = 2121
//sets the location of the .env file for later use
require('dotenv').config()

//declares variable name db to the  db object
let db,
// dbConnectionStr pulls the .env and db database
    dbConnectionStr = process.env.DB_STRING,
//names the database
    dbName = 'todo'

//Mongoclient connects to the function
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//passes in the connection string, it uses a then is the return from the promises
    .then(client => {
//then returns the console log string
        console.log(`Connected to ${dbName} Database`)
//sets the db variable to the address we get from MongoDB
        db = client.db(dbName)
    })
 
//tells express to use the ejs in the view engine
app.set('view engine', 'ejs')
//tells express to use public folder for css, js
app.use(express.static('public'))
// //lets us set up external files, our code knows where to go
app.use(express.urlencoded({ extended: true }))
//json => returns objects
app.use(express.json())

//this use tells express to get a new page to use the / at the end of the url link
app.get('/',async (request, response)=>{
    //this responds to the constant variable todoItems to wait untill the database finds the objects (aka documents from the database)
    const todoItems = await db.collection('todos').find().toArray()
    //this constant variable items left it set to pull the # of documents, if the list is completed this code will not run (hence the false)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //this renders the index ejs to show the items on the to do list.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
            //* this line finds the documents in the database and puts it in an array */
    // db.collection('todos').find().toArray()
            //**this line is a promise that returns the then handle  */
    // .then(data => {
        //** the then handle will give the number of documents (the # of actions still left on the todo list) */
    //     db.collection('todos').countDocuments({completed: false})
        //**this is a then handle that responds to the index ejs and **
    //     .then(itemsLeft => {
        //* puts that info in there so the client can see the to do lists that still need to be actioned */
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
     //** this is the catch handler that will give the client an error message if the above code doesn't work */
    // .catch(error => console.error(error))
})
//this line tells the server to do respond when the url /addTodo
app.post('/addTodo', (request, response) => {
    //the response is to add one document to the db collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //this line is the then catch and it is a function of the results if the db collection adds a new document
    .then(result => {
        //this will console log in the terminal when the document is added the database
        console.log('Todo Added')
        //after the document is added to the database it will refresh the page to main url
        response.redirect('/')
    })
    //if the add document to the database or refreshing the main url link doesn't work, the client will get an error
    .catch(error => console.error(error))
})
// this request will respond and will go to the /markComplete url
app.put('/markComplete', (request, response) => {
    //the database will update  by marking the task complete in the body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
    //this sets the completed task to true
        $set: {
    //this makes it true
            completed: true
          }
    },{
    //this sorts in descending order
        sort: {_id: -1},
        //by default its always false..I'm not sure what upsert means
        upsert: false
    })
    //then handle is giving a function
    .then(result => {
        //it will console log marked complete when the document item is marked 
        console.log('Marked Complete')
        //this responds an object saying Marked complete
        response.json('Marked Complete')
    })
    //if none of the stuff above works, the client will get an error and it will tell you what the error is.
    .catch(error => console.error(error))

})
//this request is done when the url has /markUnComplete it will respond to the following
app.put('/markUnComplete', (request, response) => {
    //this updates the documents in the database that this task isn't complete. Theres a click event in the main js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //by default its always false..I'm not sure what upsert means
        $set: {
            //this makes it false since the task isn't complete
            completed: false
          }
    },{
        // this sorts the to do list by dessending order
        sort: {_id: -1},
        //I'm not sure what upsert means, but its set to false
        upsert: false
    })//then catch will do the following below
    .then(result => {
        //if it works then Marked complete will show in the console log
        console.log('Marked Complete')
        //responsed with the object marked complete
        response.json('Marked Complete')
    })//if the code above fails, this will give the client the error
    .catch(error => console.error(error))

})
//this is url link for delete item and its response
app.delete('/deleteItem', (request, response) => {
    //this tells the database to delete the document that was clicked on
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //when you click on the document/task to delete it will respond with the following...
    .then(result => {
        //it will console log TOdo deleted
        console.log('Todo Deleted')
        //send a jason object to the server to delete it and show the results in the ejs
        response.json('Todo Deleted')
    })//catch handler that gives an error when it doesn't work
    .catch(error => console.error(error))

})
//this tells the server where to listen to for the port
app.listen(process.env.PORT || PORT, ()=>{
    //if the results work it will console log server running on port ZYX
    console.log(`Server running on port ${PORT}`)
})