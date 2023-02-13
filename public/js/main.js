const deleteBtn = document.querySelectorAll('.fa-trash')//creates a unchanging variable called deleteBtn that conatains the elements with the class fa-trash
const item = document.querySelectorAll('.item span')//crerates an unchanging variable called item that contains span elements with a parent class of item.
const itemCompleted = document.querySelectorAll('.item span.completed')//creates an unchanging variable called itemCompleted that is a span with a class of completed and whose parent has class of item
Array.from(deleteBtn).forEach((element)=>{//create an array from the items in the storage container called deleteBin and for item or element.....
    element.addEventListener('click', deleteItem) //for each element add and venet listener and upon clickin the item run the function called deleteItem.
})

Array.from(item).forEach((element)=>{//create an array from the elements in the item variable and for each element....
    element.addEventListener('click', markComplete)//add an event listener and upon clicking the element run the function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{//create an array with the item in the itemComplete variable and for each element.....
    element.addEventListener('click', markUnComplete)//add an event listener to the elements and upon clicking the element run the function called markUnComplete
})

async function deleteItem(){//creates an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs only the inner text within the list span and stores it in the variable itemText
    try{//starts a try block
        const response = await fetch('deleteItem', {//creates a response variable that awaits on a fetch to get data from the delete item route
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifies the type of content expected: json
            body: JSON.stringify({//declare the message content being passed and stringify it
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//close the body
          })//close the object
        const data = await response.json()// waiting for the server to respond with json that we'll call data
        console.log(data)//console log the json data
        location.reload()//refresh the page

    }catch(err){//close the  try block and start the catch block, if an error occurs pass it into the catch
        console.log(err)//console log the error
    }//close catch
}//close async function

async function markComplete(){//create an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText// looks inside the list item and grabs only the inner text within the list span and stores it in the variable itemText
    try{//starts a try block
        const response = await fetch('markComplete', {//creates a response variable that awaits a  fetch to get data from the put method route
            method: 'put',//sets the CRUD method as put or change something
            headers: {'Content-Type': 'application/json'}, //specifies the type of content expected as json
            body: JSON.stringify({//declare the message content being passed and turn into string
                'itemFromJS': itemText//setting the comtent of the body to the inner text of the list item and naming it itemFromJS
            })//close body
          })//close object
        const data = await response.json()//waits for server to respond with json that we'll call data
        console.log(data)// console log the data
        location.reload()//refresh the page

    }catch(err){//close try block and start catch block, if error occurs pass the error into the catch
        console.log(err)//console log the error
    }// close catch
}//close async function

async function markUnComplete(){//declare an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText//target and store the inner text of the list item span inside of itemText
    try{//start try block
        const response = await fetch('markUnComplete', {//create a response variable that awaits a fetch to get data from the put method route
            method: 'put',//set the CRUD method to put or change something
            headers: {'Content-Type': 'application/json'}, //specifies the type of content exprected back as json
            body: JSON.stringify({//declare the message content being passed and stringify it
                'itemFromJS': itemText//setting the comtent of the body to the inner text of the list item and naming it itemFromJS
            })//close body
          })//close object
        const data = await response.json()// waits  for the server to respond with json that we'll call data
        console.log(data)//console log the data
        location.reload()//refresh the page

    }catch(err){//close tryblock, begin catch block, and if theres an error pass in the error 
        console.log(err)// console log the error
    }// close the catch block
}//close the async function markUnComplete