const express = require('express') //using imported express packages express is the name of the module
const app = express()  
const MongoClient = require('mongodb').MongoClient // importing mongodb and saving it in mongoclient
const PORT = 2121 //assigning a port number
require('dotenv').config() //requiring an environment variable


let db,  //defining three variables related to the database
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'  //the mongodb collection is called 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //
    .then(client => {
        console.log(`Connected to ${dbName} Database`)//verifying it worked
        db = client.db(dbName)  //
    })
    
app.set('view engine', 'ejs')  //setting it so ejs can be used to render html
app.use(express.static('public'))  //allows the public folder to be accessed without pathways only client-side files go in here

//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object. now this object can be sent to a database
app.use(express.urlencoded({ extended: true })) // a built-in middleware function in express that parses incoming requests with urlencoded payloads and is based on body-parser
app.use(express.json()) // It parses incoming JSON requests and puts the parsed data in req.body. without this line, request.body will be undefined

//next line sends back a function that has no name.  async and await is a promise that we use instead of a callback
//async keyword 
// the'/' is the route to the index page
app.get('/',async (request, response)=>{ //READ.  when someone access the root page, this function is started. async allows the program to continue while this executes
    const todoItems = await db.collection('todos').find().toArray()  //makes an array called todoItems. returns a promise object . await forces it to wait for a returned response
    //find() function finds all the documents in the collection and puts them into a giant array
        const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //returns the count of documents that have completed:false in the collection. we think it is just returning the 
        //number of tasks that haven't been completed.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  //rendering index.ejs html file (telling our view engine ejs to render an html file.
    //it is passing in an object file with property of todoItems and property itemsLeft.  this ties to the index.ejs file to build a list of incomplete items
    //
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})  //
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //same as previous block
    //     })
    // })
    // .catch(error => console.error(error))  //tells us if there is an error
})

app.post('/addTodo', (request, response) => {  //the route by hitting a form in the ejs that action is /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//todoItem is the name of the input in the ejs file. we put in property value false
    //the {thing: ... is the object that we are inserting into the database.  
        
        .then(result => {                 //.then tells us that insertOne function is a promise        //express.json allows us to put the item in request.body
        console.log('Todo Added') //lets us know insertOne function worked
        response.redirect('/')  //resets the 'home' page (reloads with new list with added item )
    })
    .catch(error => console.error(error)) //if insertOne function didnt work, it gives an error message
})

app.put('/markComplete', (request, response) => {  // this is an update in Crud.  the /markComplete has an event listener and a function in the main.js in public/js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //update the item with property thing: requst.body... from main.js
        $set: {  //$means its a mongodb requirement
            completed: true  //change the specified task to completed
          }
    },{
        sort: {_id: -1}, //this sorts the list  most recent id number will be first item
        upsert: false   //upsert will insert an object it can't find.  set it to false to stop the database from doing this.
    })
    .then(result => {
        console.log('Marked Complete')  //let us know that it worked
        response.json('Marked Complete') //  response.json is required by the client.  the client side fetch is waiting for a response to it's request. the wordsdon't matter
    }) //it will give an error if the fetch never gets a response
    .catch(error => console.error(error)) //error

})

app.put('/markUnComplete', (request, response) => {   //when someone hits button and main.js requests path /markUnComlete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //this is passed from main.js
        $set: {                 //$set is mongo command
            completed: false   //changes the value of this property in the database
          }
    },{
        sort: {_id: -1},   //sort the tasks by most recent on top
        upsert: false    //if the task is not found, don't add it to the database
    })
    .then(result => {     //send success messages to console and back to main.js
        console.log('Marked Complete')
        response.json('Marked Complete')  //to satisfy fetch in main.js
    })
    .catch(error => console.error(error))  //if it didn't work, notify of error

})

app.delete('/deleteItem', (request, response) => {  //this is very similar to markComplete function
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go to database and delete the item that has property specified that came from main.js 
    //the text of the actual task like do laundry
    .then(result => {  //if we see a .then and a .catch, we know its a promise object.  we go into then if the promise is successful
        console.log('Todo Deleted')  //tell us it worked
        response.json('Todo Deleted') //send response to main.js so the fetch is completed
    })
    .catch(error => console.error(error))  //tells if we got an error

})

app.listen(process.env.PORT || PORT, ()=>{  //uses our host site port or ours
    console.log(`Server running on port ${PORT}`)// tells us the server is running okay
})
