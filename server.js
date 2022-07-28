const express = require('express') // sets the name express to the express modules from node.
const app = express() //assigns app to the express module for quicker reference. 
const MongoClient = require('mongodb').MongoClient // assigns mongoclient to the mongodb module 
const PORT = 2121 //assigns the name PORT to the server 2121
require('dotenv').config() //allows us to use the dotenv module to store sensitive information we dont want others to have access to.


let db, //assigns the variable db to nothing so far. since let is used, db may be later equal to something else.
    dbConnectionStr = process.env.DB_STRING, //assigns dbConnectinoStr to the mongodb string needed to access the cloud database via Mongo atlas. Will be stored in the .env folder.
    dbName = 'todo'//assigns dbName to the string todo which will be the name of the database being accessed via mongodb

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connects to Mongodb via dbConnectionStr 
    .then(client => {//instructions on what to do after MongoClient.connect is connected to MongoDB string
        console.log(`Connected to ${dbName} Database`)//will state that the connection to the database was made in the console.
        db = client.db(dbName)//variable db will now be assigned to the database that we're connected to in the Mongodb database
    })//closes the then block
    //lines 17 through 21 are all middlewares
app.set('view engine', 'ejs') //will tell express module to see index.ejs as the default page to place data
app.use(express.static('public'))//will tell express module to look for files that arent going to change but will be shown to the client using the app
app.use(express.urlencoded({ extended: true }))//will tell express module to decode and encode given URLS so that they can support arrays and objects.
app.use(express.json())// will tell express module to parse json data


app.get('/',async (request, response)=>{ //sends an asynchronous get request via express  to the main page(index.ejs). will have two parameters 
    const todoItems = await db.collection('todos').find().toArray()//todoItems will be assigned as a variable to find the collection named todos from mongodb, and put whatever is in it into any array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//itemsLeft will be assigned as a variable to go to the collection named todos from mongodb and count how may documents are there that have a key value pair of completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//once item from line 25 and 26 are found, this will show up on the index.ejs page respectively
    //lines 28 through 36 are doing the same things lines 27 are doing. However it is using a then/catch block or promise method to acheive it
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//closes the get request function

app.post('/addTodo', (request, response) => {//sends an asynchronous post request to the addTodo page. will have two parameters added in.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// something will be added to the collection in the mongodb database named todos 
    .then(result => {//represents what the function needs to do after line 39 is found
        console.log('Todo Added') //text will appear in the console to let us know the process was completed
        response.redirect('/')//will be rerouted back to the main page(index.ejs)
    })//closes the then block
    .catch(error => console.error(error))//will catch if something goes wrong and will put exactly what went wrong in the console.
})//closes the post request function. 

app.put('/markComplete', (request, response) => {//sends a put request to the route called markComplete. will have two parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//will go to the collection in mongodb called todos and update it with something
        $set: {//creating or setting something 
            completed: true//setting the completed key/property to be true
          }//closing the set 
    },{
        sort: {_id: -1},//moves updated item to the bottom of the list or 'end of array'
        upsert: false //an update/insert that wont allow a non existing item to be displayed 
    })//closing the updateOne function
    .then(result => {//represents what the function needs to do after lines 48-55 are completed
        console.log('Marked Complete')//will show the process above was completed by placing text in the console.
        response.json('Marked Complete')//will send a response in json format to the markComplete page stating the process above was complete
    })//closes the then block
    .catch(error => console.error(error))//will catch if something goes wrong and will put exactly what went wrong inside the console.

})//closes the post  function

app.put('/markUnComplete', (request, response) => {//sends a put request to the route called markUnComplete. will have two parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//will go to the collection in mongodb called todos and update it with something
        $set: {//creating or setting something 
            completed: false//setting the completed key/property to be false
          }//closing the set
    },{
        sort: {_id: -1},//moves updated item to the bottom of list or 'end of array'.
        upsert: false //an update/insert that wont allow a non existing item to be displayed 
    })//closing the updateOne function
    .then(result => {//represents what the function needs to do after lines 65-72 are completed
        console.log('Marked Complete')//will show the process above was completed by placing text in the console.
        response.json('Marked Complete')//will send a response in json format to the markComplete page stating the process above was complete
    })//closes put function
    .catch(error => console.error(error))//will catch if something goes wrong and will put exactly what went wrong inside the console.

})//closes the put function

app.delete('/deleteItem', (request, response) => {// sends a delete request to the deleteItem page. will have two parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//will go to the mongodb to the database named todos and delete something
    .then(result => {//represents what the function needs to do after line 82 is completed
        console.log('Todo Deleted')//will show the process above was completed by placing text in the console.
        response.json('Todo Deleted')//will send a response in json format to the markComplete page stating the process above was complete
    })//closes then function/block
    .catch(error => console.error(error))//will catch if something goes wrong and will put exactly what went wrong inside the console.

})//closes the delete 

app.listen(process.env.PORT || PORT, ()=>{//will place an item on the variable PORT that will listen to data that's being sent to it. will trigger a function once this happens
    console.log(`Server running on port ${PORT}`)//when data sent to the server/PORT is successful, it will send text saying it was completed to the console.
})//closes the listen function