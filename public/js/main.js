const deleteBtn = document.querySelectorAll('.fa-trash') //all elements with the class fa-trash will be selected into a new variable deleteBtn
const item = document.querySelectorAll('.item span') //all elements with the parent class item and is a span will be selected into a new variable item
const itemCompleted = document.querySelectorAll('.item span.completed') //all elements with the parent item and span with the class completed will be selected into a new variable 'itemCompleted'

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})//close of our loop
//for each element in the deleteBTn array, the click event listener is added attached to the deleteItem function through for each item in the selection
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})//close of our loop
//for each element in the item array, the click event listener is added attached to the markComplete function through for each item in the selection
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//close of our loop
//for each element in the itemCompleted array, the click event listener is added attached to the markUncomplete function through for each item in the selection

async function deleteItem(){//declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{
        const response = await fetch('deleteItem', { //creating a variable where the response data from the address will be stored
            method: 'delete', //sets the CRUD method for the route, in this case its DELETE
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({ //declare the message content and convert the content into a json string
              'itemFromJS': itemText //settijng the content of the body to the innertext of the list item and naming it 'itemFromJS'
            })//closing the body
          })//closing the fetch
        const data = await response.json() //wairing for the server to respond with some JSON
        console.log(data) //log the results to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs parse the errr into the catch block
        console.log(err) //log the error to the console
    }//end of catch block
} //end of function
//the function above is used to delete items from the todolist after they have been entered in the database
// once the async function is initiated a new const called ItemText
//the next operation will fetch the deleteItem from the server and using the delete method it will delete the itemText selected frm the innerText(from the index.ejs file selection)
//the selected item will be turned into a json string itemFromJs will have the itemText assigned into it
//after the respons executed, the results will be parsed into json and assigned to the data variable then the location on the ejs file will be reloaded.
// in the event of an error, the error will be caught in the catch block and displayed on the console

async function markComplete(){//declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{
        const response = await fetch('markComplete', {//creating a variable where the response data from the address will be stored
            method: 'put',//sets the CRUD method for the route, in this case its PUT
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({ //declare the message content and convert the content into a json string
                'itemFromJS': itemText //settijng the content of the body to the innertext of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the fetch
        const data = await response.json() //wairing for the server to respond with some JSON
        console.log(data) //log the results to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs parse the errr into the catch block
        console.log(err) //log the error to the console
    } //end of catch block
} //end of function

//the function above is initiated when a markComplete action is executed on the index.ejs file for each item
//the element selected is assigned into the variable itemText after which the markComplete fetch is initiated
//the put method which will upadete the status of the file into the database on the field itemFromJS
// the response will be parsed into json and asssigned into the data const and location on the index.ejs will be reloaded to show the 
// in the event of an error, the error will be caught in the catch block and displayed on the console

async function markUnComplete(){//declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{
        const response = await fetch('markUnComplete', {//creating a variable where the response data from the address will be stored
            method: 'put',//sets the CRUD method for the route, in this case its PUT
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({ //declare the message content and convert the content into a json string
                'itemFromJS': itemText //settijng the content of the body to the innertext of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the fetch
        const data = await response.json() //wairing for the server to respond with some JSON
        console.log(data) //log the results to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs parse the errr into the catch block
        console.log(err)//log the error to the console
    } //end of catch block
} //end of function