const express = require('express') // brings in express into node after installing it
const app = express()  // creating express application, when we use app were talking about express
const MongoClient = require('mongodb').MongoClient // requires mongdo client library be brought in 
const PORT = 2121   // establishing your port, this is the localtion or number your app runs on, and creates a server for app to run
require('dotenv').config()   // allow you to import your your private varialbes in dotenv and keep it private, when uploading to github put it in gitignore file


let db,
    dbConnectionStr = process.env.DB_STRING,  //puts connection string in a varialbe and allows us to put it in dotenv and find it in there
    dbName = 'todo'    // saves our data base from mongo into a varialbe for us to reference

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //defines how we connect to mongodata base and unified typology, 
    .then(client => {                                                    // then respond on client side
        console.log(`Connected to ${dbName} Database`)                  // and say were connected to 'todo' database
        db = client.db(dbName)                                          // sets db to 'todo' database in the client so connect to database on client side and store it in variable
    })

    //Middle ware
app.set('view engine', 'ejs')   //were using ejs template to convey our info
app.use(express.static('public')) // tells express to look into the static forder called public for server side files (js, css, html), so express knows to use it when we call it 
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLSs where the header matches the content.Supports array and objects
app.use(express.json())   // telling our app to use json method to convert things we ask it to show us into json


app.get('/',async (request, response)=>{          // get the root , async funtion so things happen all at the same time, and bring back 2 objects req, res
    const todoItems = await db.collection('todos').find().toArray()  // set a varialbe and awaits go into database 'todos' collection find the documents in it and turn them into an array and store it into a varialbe (todoItems)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // go into the 'todos' collection and count the documents, using countDocuments call back method, and get all the items that have a query param completed that set to false 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // respond back to server and tell it to  render the page in index.ejs, and update the items (which come from the todoItems variable ) and the left (whcih comes for itemsleft variable) so tells us how much items we have and how much we dont have completed and putting it into ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  // this is telling app, to allow people to create new things (tasks) using a path of '/addTodo (mathces action in form in ejs) and then takes 2 objects (req, res)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // go into db collection ('todos) and use the insetOne call back to insert 2 things that meet the query parameters or property, which are a thing, and completed, the thing which comes from the request input, go into the body Object and look for the todoItem property, and the items that have a value of false
    .then(result => {  // then take the results of this 
        console.log('Todo Added') // print on the ocnsole that it was added
        response.redirect('/')   // then respond back to the server and tell it to redirect to the root page
    })
    .catch(error => console.error(error)) // if theres an error catch it and print what's wrong with it 
})

app.put('/markComplete', (request, response) => {   //telling app to update when we click the markComplete thing 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into the 'todos' collection and use the updateOne to update any thing (it's called thing) that meets the name criteria which will be the requested input that's written into the body object with a property name of itemFromJs
        $set: {
            completed: true // it will change the compledted from false to true 
          }
    },{
        sort: {_id: -1}, // and it will then sort the array and once something has been marked completed, it says if theres more one of the same thing give us the first one and will sort the array in decending order
        upsert: false // doesnt create a new item it's the query does not get met
    })
    .then(result => { //then take the result of that and 
        console.log('Marked Complete')  //then print it into console
        response.json('Marked Complete') // and return marked completed and convert it to json which is going back to our fetch in the main js file
    })
    .catch(error => console.error(error)) // if theres an error catch it and let us know

})

app.put('/markUnComplete', (request, response) => { // again were updating this time were marking things as UNcomplete by starting a post method when the mark uncomplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into collection and use update method. update the thing param which comes from the requested body input with property name itemfromJs 
        $set: {             // set the completed status to false, which will undo what we did with mark com[plete]
            completed: false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list 
        upsert: false  // upsert is a mixture of insert and update,  it's set to false becuse it prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')  // tells you thing thing has been uncompleted 
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {   // now were deleting, tell app to delte with our delete item method found in main.js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go in db collection and use delete one method, delete the stuff that match the query params, 
    .then(result => { // return result 
        console.log('Todo Deleted') // console.log(it's been deleted)
        response.json('Todo Deleted') // if everything is full ok it will return the the result in json format
    })
    .catch(error => console.error(error)) // if theres an error it will show

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})