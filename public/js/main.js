const deleteBtn = document.querySelectorAll('.fa-trash')// seleting all elements with the class of trashcan and assigning them to deletebtn variable
const item = document.querySelectorAll('.item span')// creating a variable of item selecting span tags in the class of item and assigning them to the item variable
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of complete inside a parent with a class of item

Array.from(deleteBtn).forEach((element) => {// creating an array from out selecting and starting a loop
    element.addEventListener('click', deleteItem)// add an event listener to the current item for a click we then 
    //call the deleteitem function
})

Array.from(item).forEach((element) => {// creating an array from our selection and starting a loop        
    element.addEventListener('click', markComplete)// add an event listener to the current item for a click we then 
    //call the markcomplete function
})

Array.from(itemCompleted).forEach((element) => {// creating an array from our selection and starting a loop        
    element.addEventListener('click', markUnComplete)// add an event listener to the current item for a click we then 
    //call the markuncomplete function
})

async function deleteItem() { // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText// looks inside of the list item to extract the text value only of the specified list item
    try {// declaring a try block 
        const response = await fetch('deleteItem', {// creating a variable that waits on a fetch to get data from the result of deleteitem route
            method: 'delete',// sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' },//expecting JSON
            body: JSON.stringify({// Declare message content being passed and stringify the content
                'itemFromJS': itemText //setting content of body to the inner text of the list item and naming it to "itemfromJS"
            })//Closing the body
        })//closing the object
        const data = await response.json() // waiting on JSON response to be converted
        console.log(data) // log data
        location.reload() // reloads the page

    } catch (err) { //error handling , if error occurs pass it into block
        console.log(err) // logs error
    }// close
}// end function

async function markComplete() {// declare asynchronous function  
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item adn grabs innertext only
    try {//start block
        const response = await fetch('markComplete', {// creates variable response that waits on fetch to get fata from result of the markcomplete route
            method: 'put', //crud method update
            headers: { 'Content-Type': 'application/json' }, //expecting JSON
            body: JSON.stringify({// Declare message content being passed and stringify the content
                'itemFromJS': itemText //setting content of body to the inner text of the list item and naming it to "itemfromJS"
            })// close body
        })// close object
        const data = await response.json()// waits for json
        console.log(data)//logs data
        location.reload()//reloads page

    } catch (err) {//catch
        console.log(err)//log error
    }
}

async function markUnComplete() {// declare asynchronous function  
    const itemText = this.parentNode.childNodes[1].innerText// looks inside of the list item adn grabs innertext only
    try {
        const response = await fetch('markUnComplete', {// creates variable response that waits on fetch to get fata from result of the markuncomplete route
            method: 'put',//crud method update
            headers: { 'Content-Type': 'application/json' },//expecting JSON
            body: JSON.stringify({// Declare message content being passed and stringify the content
                'itemFromJS': itemText //setting content of body to the inner text of the list item and naming it to "itemfromJS"
            }) // close body
        })//close object
        const data = await response.json()// waits for json
        console.log(data)// logs data
        location.reload()//log error

    } catch (err) {//catch error
        console.log(err)//log error
    }
}