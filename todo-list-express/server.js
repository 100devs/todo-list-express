//install express to the server
const express = require('express')
//create a var to hold the express functions
const app = express()
//install your MongoDB to the server
const MongoClient = require('mongodb').MongoClient
//create a var of PORT then install dotenv to access your .env var
const PORT = 2121
require('dotenv').config()

//hold your connection string and db name in a var
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'API_EXPRESS'

//connect your mongodbclient by linking the connection string, using the db namr and console logging it as well
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
   //set the app use the ejs file as the viewing agent 
app.set('view engine', 'ejs')
//the app will use the puplic folder to access files like js and css
app.use(express.static('public'))
//replaced the bodyParse function
app.use(express.urlencoded({ extended: true }))
//app will use express json
app.use(express.json())


//from the main route if a get request is requested by the user, then async the function will create var of todoItems which will go to the db, collections of todos and find all the objects in the collection then set it to an array and hold it in the var. the itemsLeft will go to the db. collections labelled todos and count the documents with the completed property of false. then render a response using the index.ejs and replace the todoItems and itemsLeft found above to items and left
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//if theres a post request.from the addTodo route from the submit button and form from the ejs and complete the function by going to the db then a collection labelled todos, then insert one document with a property of thing which will come from the req body that has a property of todoItem and force the completed property to be false. then console log "todo added" and response by refreshing the page. if theres an error, console log the error
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//if theres a put request, from the markComplete route, run the function where it will go to the db and in the db itll go to the collection labelled todos and updateOne the obkect with a property of thing that has the value of the req body with the property of itemFromJs. and set it to complete = true instead of false. then sort the objects from descending order and if there is no object there, dont create one if there is no match. then console.log with marked complete and respond with json of marked completed. if theres an error, console log the error.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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

//if theres a put request,from the markUncomplete route, run the function where it will go to the db and in the db itll go to the collection labelled todos and updateOne the obkect with a property of thing that has the value of the req body with the property of itemFromJs. and set it to complete = false instead of true. then sort the objects from descending order and if there is no object there, dont create one if there is no match. then console.log with marked complete and respond with json of marked completed. if theres an error, console log the error.
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
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

////if theres a delete request, from the deleteItem route, run the function where it will go to the db and in the db itll go to the collection labelled todos and deleteOne the object with a property of thing that has the value of the req body with the property of itemFromJs. then console.log with todo deleted and respond with json of todo deleted. if theres an error, console log the error.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//the app will listen on the PORT created a=or the port dictated by the env file or third party deployment service and then console log that the server is  running on port specified
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})