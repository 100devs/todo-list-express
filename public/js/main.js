const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it to a selection of all elements with the fa-trash class
const item = document.querySelectorAll('.item span')// creating a variable and assigning it to a selection of spans with a parent class of item
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans within a parent class of item that are also "completed"

Array.from(deleteBtn).forEach((element)=>{//creates an array from the items assigned to deleteBtn and begins a forEach method on them
    element.addEventListener('click', deleteItem) // for current item in the array an eventlistener will be added and when clicked the deleteItem function will run
})// closes this function

Array.from(item).forEach((element)=>{//creates an array from our selection determined in line 2 and uses forEach to begin looping through it
    element.addEventListener('click', markComplete)//for current item adds an eventlistener and when clicked runs the markComplete function
})// closes this function

Array.from(itemCompleted).forEach((element)=>{//creates an array from our selection determined in line 3 and uses the forEach to begin looping through it
    element.addEventListener('click', markUnComplete)//for current item in the array adds an eventlistener and when clicked runs the markUnComplete function
})//closes the function

async function deleteItem(){//declares async function
    const itemText = this.parentNode.childNodes[1].innerText// checks list item to extract the text value of the specific list item and assigns it to the variable
    try{//starts a try block
        const response = await fetch('deleteItem', {//creates a variable and assigns to it the response from the fetch request to get data from the deleteItem
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},// declares the type of content that should be expected
            body: JSON.stringify({// declare the message being passed and stringify it
              'itemFromJS': itemText // setting content of the innerText of the li and names it
            })//closing the body
          })//closes object
        const data = await response.json()// waits on JSON response
        console.log(data)// displays data in the console
        location.reload()// refreshes page to display changes

    }catch(err){//starts catch block to catch errors
        console.log(err) // displays the err message in the console
    }
}//ends function

async function markComplete(){// declares async function
    const itemText = this.parentNode.childNodes[1].innerText//checks list item to extract the text value of the specific list item and assigns it to the variable
    try{ // starts a try block
        const response = await fetch('markComplete', {// creates a variable and assigns to it the response from the fetch request to get data from the markComplete route
            method: 'put',// sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//declares the type of content that should be expected
            body: JSON.stringify({// declare the message being passed and stringify it
                'itemFromJS': itemText// setting content of the innerText of the li and names it
            })//closes body
          })//closes object
        const data = await response.json()//waits on JSON response
        console.log(data)//displays data in the console
        location.reload()//refreshes page to display changes

    }catch(err){//starts catch block to catch errors
        console.log(err)// displays the err message in the console
    }
}//ends function

async function markUnComplete(){//declares async function
    const itemText = this.parentNode.childNodes[1].innerText//checks list item to extract the text value of the specific list item and assigns it to the variable 
    try{//starts a try block
        const response = await fetch('markUnComplete', {// creates a variable and assigns to it the response from the fetch request to get data from the markUnComplete route
            method: 'put',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//declares the type of content that should be expected 
            body: JSON.stringify({//declares the message being passed and stringify it
                'itemFromJS': itemText//setting content of the innerText of the li and names it
            })//closes body
          })//closes object
        const data = await response.json()//waits on JSON response
        console.log(data)//displays the data in the console
        location.reload()//refreshes page to display changes

    }catch(err){//starts catch block to catch errors
        console.log(err)//displays the err message in the console
    }
}//ends function