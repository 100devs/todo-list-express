const deleteBtn = document.querySelectorAll('.fa-trash')//declaring a constant variable that assigns the selection of all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span')//declaring a constant variable that assigns the selection of all span elements with a parent class of .item
const itemCompleted = document.querySelectorAll('.item span.completed')//declaring a constant variable that assigns the selection of span elements with a class of 'completed', that have a parent class of .item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from the selection and starting a for each loop
    element.addEventListener('click', deleteItem)//adding an event listener for current item that listens for a 'click' then calls a function called deleteItem
})//closing for each loop

Array.from(item).forEach((element)=>{//creating an array from the selection and starting a for each loop
    element.addEventListener('click', markComplete)//adding an event listener for current item that listens for a 'click' then calls a function called markComplete
})//closing for each loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from the selection and starting a for each loop
    element.addEventListener('click', markUnComplete)//adding an event listener that listens for 'click' only on completed items
})//closing for each loop

async function deleteItem(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item and grabs the innertext of the list span
        try{ //opening try block
        const response = await fetch('deleteItem', { //declares a variable holding a fetch which will wait to get data from the result of deleteItem route
            method: 'delete', //sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of contect exptected, JSON
            body: JSON.stringify({  //declare the message contect being passed, and stringify it
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            }) //closing body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response assigning to variable
        console.log(data) //log result to console
        location.reload() //reload page to view new results

    }catch(err){  //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close catch block
}//close function block

async function markComplete(){//declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item and grabs the innertext of the list span
    try{ //opening try block
        const response = await fetch('markComplete', {  //declares a variable holding a fetch which will wait to get data from the result of markComplete route
            method: 'put', //setting crud method to update for route
            headers: {'Content-Type': 'application/json'}, //specifying the type of contect exptected, JSON
            body: JSON.stringify({ //declare the message contect being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            })//closing body
          })//closing the object
        const data = await response.json()//waiting on JSON from the response assigning to variable
        console.log(data) //log result to console
        location.reload() //reload page to view updated results

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//close catch block
}//close function block

async function markUnComplete(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item and grabs the innertext of the list span
    try{//opening try block
        const response = await fetch('markUnComplete', { //declares a variable holding a fetch which will wait to get data from the result of markUnComplete route
            method: 'put', //setting crud method to update for route
            headers: {'Content-Type': 'application/json'}, //specifying the type of contect exptected, JSON
            body: JSON.stringify({ //declare the message contect being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            })//closing body
          })//closing object
        const data = await response.json() //waiting on JSON from the response assigning to variable
        console.log(data) //log result to console
        location.reload() //reload to view updated results

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }//close catch block
}//close function block