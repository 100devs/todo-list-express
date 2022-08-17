const deleteBtn = document.querySelectorAll('.fa-trash')//creating var and selecting elements with class fa-trash
const item = document.querySelectorAll('.item span')//creating var selecting class item span elements (all spans with parent class of item)
const itemCompleted = document.querySelectorAll('.item span.completed')//creating var and assigning it to selection of spans with class of completed and parent with class of item ***span .completed***

Array.from(deleteBtn).forEach((element)=>{//creating arr from selection and starting loop
    element.addEventListener('click', deleteItem)//adding event listener for click to run function deleteItem
})//close loop

Array.from(item).forEach((element)=>{//creating arr from selection and starting loop
    element.addEventListener('click', markComplete)//adding event listener for click to run function markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{//creating arr from selection and starting loop
    element.addEventListener('click', markUnComplete)//adding event listener for click to run function markUnComplete
})//close loop

async function deleteItem(){//declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//declaring var that looks inside list item and grabs inner text within list span
    
    try{ // starting try block
        const response = await fetch('deleteItem', { // response var starting object that waits for fetch to get result from deleteItem
            method: 'delete', // sets CRUD method
            headers: {'Content-Type': 'application/json'}, //sets json as type of expected content
            body: JSON.stringify({ // declares message content and stringify content
              'itemFromJS': itemText // setting body content as inner content of list item and naming it itemFromJS
            }) // closing body
          }) // closing object
        const data = await response.json() //waits for response being parsed and converted from json to Js object
        console.log(data) // log result to console
        location.reload() // refresh page to update display

    }catch(err){ // Error handler to catch error. Pass error into catch error block
        console.log(err) // log error to console
    } // close catch block
} //end function

async function markComplete(){ //declaring async function
    const itemText = this.parentNode.childNodes[1].innerText //declaring var that looks inside list item and grabs inner text within list span
    try{ //starting try block
        const response = await fetch('markComplete', { // creates response var that waits on fetch to get data from markComplete route
            method: 'put', // sets update CRUD method
            headers: {'Content-Type': 'application/json'}, // sets json as type of expected content
            body: JSON.stringify({ //declares passed message content & stringifies
                'itemFromJS': itemText // sets body content as inner text of list item and names it
            }) //closing body
          }) // closing try block object
        const data = await response.json() //waits for response being parsed and converted from json to Js object
        console.log(data)//log result to console
        location.reload()//refresh page

    }catch(err){// Error handler to catch error. Pass error into catch error block
        console.log(err)// log error to console
    }//close catch block
}//close object

async function markUnComplete(){// declare async function
    const itemText = this.parentNode.childNodes[1].innerText //declares var that looks inside list item and grabs inner txt within list span
    try{ //initialize try block
        const response = await fetch('markUnComplete', { //creates resp var that wait for fetch to get data from markUnComplete route
            method: 'put',// sets put CRUD method
            headers: {'Content-Type': 'application/json'}, // sets json as type of expected content
            body: JSON.stringify({ // declares passed message content & stringifies 
                'itemFromJS': itemText // sets body content as inner text of list item and names it
            }) //closes body 
          }) // closes try block
        const data = await response.json() //waits for response being parsed and converted from json to Js object
        console.log(data) //log result to console
        location.reload() //refresh da page

    }catch(err){// Error handler to catch error. Pass error into catch error block
        console.log(err)// log error to console
    } // close catch
} // close object
// This file assigns vars to event listeners and sends to server and waits to hear back from server for complete, uncomplete, and delete tasks. Form handles the other aspects