/*
    npm init
    ( CREATES PACKAGE.JSON )
    npm install
    ( NODE MODULES )
    npm install --save-dev nodemon
    "start": "nodemon server.js"
*/

/* PREP
    P = PARAMETERS - (ONCLICK TEXTBOX, TRASHCAN, ITEMS SUBMIT BUTTON)
    R = RETURN - (NEW ITEM COMES BACK)
    E = EXAMPLES - (RETURN MARKED AS COMPLETE, REMOVE ITEM FROM LIST, COUNTER DECRAMENTS, INCREMENT TO ZERO AS BASE)
    P = PSUEDOCODE - (
            USER FACING FRONT END
                TYPE A NEW ITEM 
                SUBMIT NEW ITEM
                   CLICK EVENT LISTENER
                   SEND DATA TO AN API (SERVER)
                   NEW ITEM CREATED (DATABASE ENTRY)
                CLICK ON TRASHCAN (DELETE REQUEST)
                    CLICK EVENT LISTENER
                    SEND DATA WITH INFO TO SERVER
                CLICK ON AN ITEM 
                    CLICK EVENT LISTENER
                    UPDATE "PUT" FLAG CHANGE
            MONGODB BACKEND
                STORE DATA

    ) 
*/
/* CRUD 
    C = CREATE 
    R = READ 
    U = UPDATE
    D = DELETE
*/

// DECLARE VARIBLES
const express = require('express') // DECLARATION OF THE USE OF EXPRESS  
const app = express() // SETTING AND ASSIGNING EXPRESS AS A VARIABLE
const MongoClient = require('mongodb').MongoClient // DECLARATION OF THE USE OF MONGODB 
const PORT = 2121 // ASSIGNING THE PORT TO USE LOCALLY
require('dotenv').config() // ASSIGNING A A FILE (.env) WHERE PRIVATE VARIABLES CAN BE ASSIGNED 


// CONNECT TO MONGODB
let db, // DECLARING A VARIABLE (db) SO A VALUE CAN BE ASSIGNED TO IT
    dbConnectionStr = process.env.DB_STRING, // DECLARING A VARIABLE AND ASSIGNING A DATABASE CONNECTION STRING
    dbName = 'todo' // DECLARING A VARIABLE AND ASSIGNING A NAME OF THE DATABASE BEING USED

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // CREATING A CONNECTION TO MOGODB, AND PASSING IN OUR CONNECTIOIN STRING AND IT'S PROPERTY
    .then(client => { // WAITS FOR THE CONNECTION. PROCEDDING IF SUCCESFUL, AND POSTING ALL CLIENT INFO
        console.log(`Connected to ${dbName} Database`) // LOG TO CONSOLE A TEMPLATE LITERAL USING THE VARIABLE "dbName" 
        db = client.db(dbName) // ASSIGNING A VALUE TO PREVIOUSLYDECLARED db VARIABLE THAT CONTAINS A db CLIENT FACTORY METHOD
    }) // CLOSING THEN 
    
// MIDDLEWARE SET THE TEMPLATE ENGINE (USING EJS)
app.set('view engine', 'ejs') // SETTING ejs AS THE DEFAULT VIEW ENGINE 

// STORE STATIC FILES FOLDER
app.use(express.static('public')) // LOCATION FOR STATIC ASSETS FOLDER
app.use(express.urlencoded({ extended: true })) // TELLS EXPRESS TO DECODE AND ENCODE URLs WHERE THE HEADER MATCHES THE CONTENT.
app.use(express.json()) // PARSES INCOMING CONTENT FROM INCOMING REQUESTS


// GET METHOD
app.get('/',async (request, response)=>{ // STARTS A get METHOD WHEN THE ROUTE IS PASSED IN, SETS UP REQUEST, AND RESPONSE PARAMETERS
    const todoItems = await db.collection('todos').find().toArray() // SETS A VARIABLE AND AWAITS  ALL ITEMS FROM THE todos COLLECTION
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // SETS A VARIABLE AND AWAITS A COUNT OF UNCOMPLETED ITEMS TO LATER DISPLAY IN EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // RENDERS EJS FILES AND PASSING THRU THE db ITEMS AND THE COUNT REMAINING INSIDE OF AN OBJECT
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // CLOSES THE GET METHOD

// POST METHOD
app.post('/addTodo', (request, response) => { // STARTS A POST METHOD WHEN THE ADD ROUTE IS PASSED 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // INSERTS AN ITEM INTO todos COLLECTION WITH COMPLETED VALUE OF FALSE BY DEFAULT
    .then(result => { // IF SUCCESSFUL DO SOMETHING 
        console.log('Todo Added') // CONSOLE LOG ACTION 
        response.redirect('/') // GETS RID OF THE ADD addTodo ROUTE 
    }) // CLOSING THE  THEN
    .catch(error => console.error(error)) // CATCHING ERRORS
}) // SENDING THE POST

// PUT METHOD
app.put('/markComplete', (request, response) => { // STARTS A PUT METHOD WHEN THE MARKCOMPLETE ROUTE IS PASSED 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // LOOKS IN THE DATABASE FOR ONE ITEM MATCHING THE NAME OF THE ITEM PASSED IN FROM THE MAIN.JS THAT WAS CLICKED ON
        $set: { // 
            completed: true // SETS COMPLETED STATUS TO TRUE 
          }
    },{
        sort: {_id: -1}, // MOVES ITEM TO THE BOTTOM OF THE LIST
        upsert: false // PREVENTS INSERTION IF ITEM DOES NOT ALREADY EXIST
    })
    .then(result => { // STARTS A THEN IF UPDATE WAS SUCCESSFUL
        console.log('Marked Complete') // CONSOLE LOGGING SUCCESS

        response.json('Marked Complete') // SENDING A RESPONSE BACK TO SENDER
    }) // CLOSING THE TRHEN STATEMENT
    .catch(error => console.error(error)) // CATCH ERRORS

}) // CLOSING THE PUT METHOD

app.put('/markUnComplete', (request, response) => { // STARTS A PUT METHOD WHEN THE MARKCOMPLETE ROUTE IS PASSED 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // LOOKS IN THE DATABASE FOR ONE ITEM MATCHING THE NAME OF THE ITEM PASSED IN FROM THE MAIN.JS THAT WAS CLICKED ON
        $set: { // SETS COMPLETED STATUS TO FALSE
            completed: false // SETS COMPLETED STATUS TO FLASE
          } 
    },{
        sort: {_id: -1}, // MOVES ITEM TO THE BOTTOM OF THE LIST
        upsert: false // PREVENTS INSERTION IF ITEM DOES NOT ALREADY EXIST
    })
    .then(result => { // STARTS A THEN IF UPDATE WAS SUCCESSFUL
        console.log('Marked Complete') // CONSOLE LOGGING SUCCESS
        response.json('Marked Complete') // SENDING A RESPONSE BACK TO SENDER
    })
    .catch(error => console.error(error)) // CATCH ERRORS

}) // CLOSING THE PUT METHOD

// DELETE METHOD
app.delete('/deleteItem', (request, response) => { // STARTS A DELETE METHOD WHEN THE DELETE ROUTE IS PASSED 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // LOOKLS INSIDE THE todos COLLECTION FOR THE ONE ITEM THAT HAS A MATCHING NAME FROM OUR JS FILE
    .then(result => { // STARTS A THEN IF UPDATE WAS SUCCESSFUL
        console.log('Todo Deleted') // CONSOLE LOGGING SUCCESS
        response.json('Todo Deleted') // SENDING A RESPONSE BACK TO SENDER
    })
    .catch(error => console.error(error))  // CATCH ERRORS

}) // CLOSING THE DELETE METHOD

// START SERVER LISTENING ON PORT 2121
app.listen(process.env.PORT || PORT, ()=>{ // SETTING UP WHICH PORT WE WILL BE LISTENING ON - EITHER THE PORT DROM THE .env FILE OR THE PORT VARIABLE SET ABOVE
    console.log(`Server running on port ${PORT} You Betta go and catch it!`) // CONSOLE LOG THE RUNNING PORT 
}) // CLOSING THE LISTEN METHOD