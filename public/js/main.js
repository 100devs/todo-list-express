const deleteBtn = document.querySelectorAll('.fa-trash')//create a variable that holds the selection of all elements with the .fa-trash (the trash can) class
const item = document.querySelectorAll('.item span')//create a variable that holds the selection of all span tags within the .item class
const itemCompleted = document.querySelectorAll('.item span.completed')//create a variable that holds the selection of all spans with a class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{//create an array from all of the elements inside the deleteBtn variable and start a loop
    element.addEventListener('click', deleteItem)//add an event listener that waits for a click and runs deleteItem on click to every element inside deleteBtn variable
})//close our loop

Array.from(item).forEach((element)=>{//create an array from all of the elements inside the item variable and start a loop
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls a function called markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{//create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//add an event listener to items that are completed
})//close loop

async function deleteItem(){//declaring async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the li to pull out the text of the span inside the li
    try{//declare a try block to do something
        const response = await fetch('deleteItem', { //starting an object and declare variable called response that holds an awaited fetch to get data from the result of deleteItem route
            method: 'delete',//CRUD method (delete) for the route
            headers: {'Content-Type': 'application/json'},//headers property holds an object with the content type property of JSON
            body: JSON.stringify({//property of body holds the JSON.stringify function called on itemText from itemFromJS. Its the innerText of the span.
              'itemFromJS': itemText//itemFromJS set to the innerText of the span, which is the variable declared earlier called itemText.
            })//closing the body
          })//closing the object
        const data = await response.json()//declaring a variable that holds the awaited function called response.json() that will send JSON back
        console.log(data)//log the responded JSON to the console
        location.reload()//reload the page to show the item has been deleted

    }catch(err){//close try block and handles error
        console.log(err)//logs error to the console
    }//close catch block
}//close deleteItem function

async function markComplete(){//declare async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the li to pull out the text of the span inside the li
    try{//starting a try block to do something
        const response = await fetch('markComplete', {//starting an object and declare variable called response that holds an awaited fetch to get data from the result of markComplete route
            method: 'put',//setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'},//headers property holds an object with the content type property of JSON
            body: JSON.stringify({//property of body holds the JSON.stringify function called on itemText named itemFromJS. Its the innerText of the span.
                'itemFromJS': itemText//itemFromJS set to the innerText of the span, which is the variable declared earlier called itemText.
            })//closing the body
          })//closing the object
        const data = await response.json()//declaring a variable that holds the awaited function called response.json() that will send JSON back
        console.log(data)//log the responded JSON to the console
        location.reload()//reload the page to show the item has been updated

    }catch(err){//close try block and catch error
        console.log(err)//logs error to the console
    }//close catch block
}//close markComplete function

async function markUnComplete(){//declare async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the li to pull out the text of the span inside the li
    try{//starting a try block to do something
        const response = await fetch('markUnComplete', {//starting an object and declare variable called response that holds an awaited fetch to get data from the result of markUnComplete route
            method: 'put',//setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'},//headers property holds an object with the content type property of JSON
            body: JSON.stringify({//property of body holds the JSON.stringify function called on itemText named itemFromJS. Its the innerText of the span.
                'itemFromJS': itemText//itemFromJS set to the innerText of the span, which is the variable declared earlier called itemText.
            })//closing the body
          })//closing the object
        const data = await response.json()//declaring a variable that holds the awaited function called response.json() that will send JSON back
        console.log(data)//log the responded JSON to the console
        location.reload()//reload the page to show the item has been updated

    }catch(err){//close try block and catch error
        console.log(err)//logs error to the console
    }//close catch block
}//close markUnComplete function