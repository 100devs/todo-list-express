//Dependencies required. This app needs express and dotenv. I
const express = require('express')                   //express is required for this to work
const app = express()                                //easy way to call express
const MongoClient = require('mongodb').MongoClient   //It will use MongoDB for data storage.
const PORT = 2121                                   //The port it will listen on.
require('dotenv').config()                          //let us use env file

//DB connection. The connection url with password will be stored in the .env file. The connection will go to the specific collection 'todo'
let db,                                                                //creates variables. First db
    dbConnectionStr = process.env.DB_STRING,                              //the connection url will be in .env file
    dbName = 'todo'                                                       //specific collection      

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //the app will connect to the MongoDB url
    .then(client => {                                                  //then it will connect to the specific collection 'todo'
        console.log(`Connected to ${dbName} Database`)                  //result if it connects successfully
        db = client.db(dbName)                                          //now defines the variable created above 'db' as the specific collection. Easier to use.
    })

//Variables    
app.set('view engine', 'ejs')         //the view engine will be ejs and not plain html
app.use(express.static('public'))     //the folder public will hold the css and js files to use to render the page. No need to id public folder as part of path for css and js.
app.use(express.urlencoded({ extended: true }))             //how to parse urls. tells express to parse urls where header matches contents. 
app.use(express.json())                                     //tells express to parse JSON

//The get request. What happens when the initial page is loaded - it sends a get (READ) to the db
app.get('/',async (request, response)=>{                                                          //async request lets other code run while it runs
    const todoItems = await db.collection('todos').find().toArray()                               //new var to hold results of request: all of the documents in the collection and display in array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})           //new var to hold results of request from the collection 'todos' the number of todos ie documents in the collection which are Not completed. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                         //render the response as ejs with these two data points from each document. 
    // db.collection('todos').find().toArray()                                                  //the rest looks like a traditional promise catch to do what is done above. 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//To post(Create) a new todo (document) to the collection todos. It is not async. Trad promise: do this and then. Function is called from index.ejs when submitting form.
app.post('/addTodo', (request, response) => {    //Called upon submitting form. When you use form it makes this a route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //insert an object with info from the request = name of todoItem comes from form html. It is inserted into the collection todos and the completed key is false.
    //Above: New object is created with two keys: thing and completed. Remember nothing exists in db yet. This creates the to do. So "thing" referenced in index comes from here. Value of thing is from req todoItem.
    .then(result => {                         //after, do this.
        console.log('Todo Added')            //success message
        response.redirect('/')               //then reload page to homepage because using form makes the route /addTodo. need to go back to home route
    })
    .catch(error => console.error(error))   //catch and display error if unsuccessful
})

app.put('/markComplete', (request, response) => {                                  //update. Function is called from main.js. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{            //It updates one item in the collection todos. ("thing" comes from above.) "itemFromJS" is from main.js. This identifies which item. This could be an issue if two items have same text.
        $set: {
            completed: true                                                         // Still part of update. Set the property to true
          }
    },{
        sort: {_id: -1},                                                            //Update: moves item to bottom of list [may not make any differnce or be needed]    
        upsert: false                                                               //Upsert is mix of update and insert. False prevents insertion if item doesn't already exist.    
    })
    .then(result => {                                                               //Update finished then do this:
        console.log('Marked Complete')                                              //console log success message
        response.json('Marked Complete')                                            //response is json form with content "Marked Complete" and sends. The function in main.js is await this response and will console.log it.
    })
    .catch(error => console.error(error))                                           //error

})

app.put('/markUnComplete', (request, response) => {                                  //Update but different route than Complete.        
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false                                                        //Set the property to false
          }
    },{
        sort: {_id: -1},                                                            //See above
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')                                          //Typo? Not Complete
        response.json('Marked Complete')                                        //Typo? Not Complete
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {                                              //Delete function called from main.js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})                          //Delete one item defined as innertext from thing from todos.
    .then(result => {                                                                           //after delete, do this.
        console.log('Todo Deleted')                                                            //Success message     
        response.json('Todo Deleted')                                                           //JSON response sent to deleteFunction in main js to be console.logged
    })
    .catch(error => console.error(error))                                                       //error message if needed

})

app.listen(process.env.PORT || PORT, ()=>{                                          //tells express to listen on this port as defined above or in the env file.
    console.log(`Server running on port ${PORT}`)                                   //success message
})