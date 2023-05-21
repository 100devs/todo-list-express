const deleteBtn = document.querySelectorAll('.fa-trash')    //assign all elements with class of trashcan to deleteBtn variable
const item = document.querySelectorAll('.item span')        //selects all the <span> elements that are descendants of elements with the class "item" in the current document, assigned to item variable.
const itemCompleted = document.querySelectorAll('.item span.completed') //select all elements with the class "completed" within <span> elements inside elements with the class "item"

Array.from(deleteBtn).forEach((element)=>{  //classic, adding a smurf onto each deletebtn element
    element.addEventListener('click', deleteItem)//Event handler/callback is the deleteItem function
})

Array.from(item).forEach((element)=>{   //array of all spans under item class parent have an event listener that once clicked runs mark complete, NOTE trashcan is also selected, clicking will call both deleteItem and markComplete
    element.addEventListener('click', markComplete) //click event listener, callback is markComplete
})

Array.from(itemCompleted).forEach((element)=>{  //array for all the spans that have the COMPLETED class descending from the parent with item class has the event listener that runs mark uncomplete
    element.addEventListener('click', markUnComplete) //only completed items has the markuncomplete event listener, we don't want an uncomplete req to be sent for uncompleted items, hence a more specific selection
})

async function deleteItem(){    //asynch function so has try catch blocks, this is useful because there can be many errors so we want to know where an error occurs. Allows us to change flow, wait for response to arrive whilst doing other operations
    const itemText = this.parentNode.childNodes[1].innerText    //looks into parentnode(li), item[0] is the indent, the variable <%= item[i].thing %> is item[1], extracts inner text from item[1]. this. refers to container item is in
    try{ //start try block to do asynch operations
        const response = await fetch('deleteItem', {//creates variable that waits on a fetch req to get data from a result of deleteItem route
            method: 'delete',   //starting an object, send CRUD method for the route, send the method of delete...so it knows that it's a delete req
            headers: {'Content-Type': 'application/json'},  //specify type of content expected which is JSON
            body: JSON.stringify({  //declare the message content being passed of the body, and stringify content 
              'itemFromJS': itemText //setting content of the body to the inner text of the list item and assigning it to a property of "itemFromJS"
            }) //closing body
          }) //closing object
        const data = await response.json() //awaiting for conversion/parsing of response to JSON
        console.log(data) //log data to console
        location.reload()   //refresh page

    }catch(err){ //catch block that's paired with the try block, runs if try block throws error, catch handles the error and do something else
        console.log(err) //just log error
    }
}

async function markComplete(){ //declare asynch function markComplete
    const itemText = this.parentNode.childNodes[1].innerText    //grab text from span
    try{ //try block initiation
        const response = await fetch('markComplete', {  //declare response, fetch is mark Complete route
            method: 'put', //CRUD method UPDATE/PUT HTTP method
            headers: {'Content-Type': 'application/json'}, //expect JSON
            body: JSON.stringify({ //set content of body object to a stringify of text from span
                'itemFromJS': itemText //set content of body object to a stringify of text from span, called itemFromJS
            }) //closing  the body object
          }) //closing body
        const data = await response.json() //await on JSON from response to be converted
        console.log(data) //console log JSON 
        location.reload() //refresh

    }catch(err){ //if error occurs in try block, catch block catches error
        console.log(err) //log error
    }
}

async function markUnComplete(){ //declare asynch function markUncomplete
    const itemText = this.parentNode.childNodes[1].innerText //grab innertext
    try{ //try block initiation
        const response = await fetch('markUnComplete', { //mark complete route
            method: 'put', //another put request, but to a different route this time, a good example to show how different changes can hit different parts of the server
            headers: {'Content-Type': 'application/json'}, //json content expected
            body: JSON.stringify({ 
                'itemFromJS': itemText  //things getting marked complete/uncomplete is server.js, how does it know what to style? it was a class assigned to the span based on the completed property
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//main.js basically a launch pad for reqs to server, server does more
//nothing for the form is here, by their nature have built in functionality that allows you to handle routes, they just post or get to the server, but can't put
