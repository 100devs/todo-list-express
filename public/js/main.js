//buttons  that if clicked will call functions that refers to stuff from server.js
const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it to a selection of  all element with class of trash can icons
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of span tags inside of a parent
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of span tags inside of a parent and class of completed
//
Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and start new loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click and then calls a function called deleteitem
})//close loop

Array.from(item).forEach((element)=>{//creating an array from our selection and start new loop
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls a function called markcomplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and start new loop
    element.addEventListener('click', markUnComplete)//add an event listener to the completed item that waits for a click and then calls a function called markuncomplete
})//close loop
//middleware
async function deleteItem(){// declaring aync function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and gets item
    try{//declaring try block
        const response = await fetch('deleteItem', {//create variable that waits on a fatch that gets data from the result of the deleteItem route
            method: 'delete',//set CRUD method for the route
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({//body is the message are getting, declare message content being passed and put it into a JSON string
              'itemFromJS': itemText 
            })//close body  
          })// closing our object
        const data = await response.json()//waiting  on JSON from reponse to be converted
        console.log(data)//log the result to the console
        location.reload()//reload the page

    }catch(err){//if an error occurs pass error
        console.log(err)// print error
    }//close catch
}//close asyn

async function markComplete(){// declaring aync function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of list item and gets item
    try{//starting try 
        const response = await fetch('markComplete', {//create variable that waits on a fatch that gets data from the result of the markcomplete route
            method: 'put',// CRUD for put
            headers: {'Content-Type': 'application/json'},//we expect content type JSON
            body: JSON.stringify({//body is the message are getting, declare message content being passed and put it into a JSON string
                'itemFromJS': itemText//setting content of body to the text of the list item and naming it itemfromJS
            })//close body  
          })//closing our objecgt
        const data = await response.json()//waiting on JSON from response to be converted
        console.log(data)//console log result
        location.reload()//reloads

    }catch(err){//if an error occurs pass error
        console.log(err)// print error
    }//close catch
}//close asyn

async function markUnComplete(){// declaring aync function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of list item and gets item
    try{//starting try 
        const response = await fetch('markUnComplete', {//create variable that waits on a fatch that gets data from the result of the markUncomplete route
            method: 'put',//update route
            headers: {'Content-Type': 'application/json'},//waiting on JSON from response to be converted
            body: JSON.stringify({//body is the message are getting, declare message content being passed and put it into a JSON string
                'itemFromJS': itemText//setting content of body to the text of the list item and naming it itemfromJS
            })//console log result
          })//reloads
          const data = await response.json()//waiting on JSON from response to be converted
          console.log(data)//console log result
          location.reload()//reloa


    }catch(err){//if an error occurs pass error
        console.log(err)// print error
    }//close catch
}//close asyn