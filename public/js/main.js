const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all class of fa-trash 
const item = document.querySelectorAll('.item span') //creating variable and assignning  it to a selection of all span tags inside a parent with class item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning to a selection of all span with class completed inside a parent with class item

Array.from(deleteBtn).forEach((element)=>{ // creating an array from selection an starting loop
    element.addEventListener('click', deleteItem) // add an event listener to the current items thats wiats for click then calls function deletItem
}) //closing loop

Array.from(item).forEach((element)=>{ // creating an array from selection an starting loop
    element.addEventListener('click', markComplete)  // add an event listener to the current items thats wiats for click then calls function markComplete
}) //closing loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from selection an starting loop
    element.addEventListener('click', markUnComplete) // add an event listener to only completed items thats wiats for click then calls function markUnComplete
}) //closing loop

async function deleteItem(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //declaring variable that waits fecth the data from the result of deleteitem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //pecifying the type of content expected is JSON
            body: JSON.stringify({ //declaring message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body tothe inner text of the list item and naming it 'itemFromJs
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the resposne to be converted
        console.log(data) //console the result
        location.reload() //reloads the page 

    }catch(err){ //if an error occurse,pass it to the catch block
        console.log(err) //log the error to console
    }//close catch block
} //end function

async function markComplete(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //declaring variable that waits fecth the data from the result of deleteitem route
            method: 'put', //sets the CRUD method to "update " for the route
            headers: {'Content-Type': 'application/json'}, //declaring message content being passed and stringify that conetent
            body: JSON.stringify({ //declaring message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body tothe inner text of the list item and naming it 'itemFromJs
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the resposne to be converted
        console.log(data) //console the result
        location.reload() //reloads the page

    }catch(err){ //if an error occurse,pass it to the catch block
        console.log(err) //log the error to console
    }//close catch block
}//end function

async function markUnComplete(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //declaring variable that waits fecth the data from the result of deleteitem route
            method: 'put', //sets the CRUD method to "update " for the route
            headers: {'Content-Type': 'application/json'},//declaring message content being passed and stringify that conetent
            body: JSON.stringify({ //declaring message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body tothe inner text of the list item and naming it 'itemFromJs
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the resposne to be converted
        console.log(data)//console the result
        location.reload()//reloads the page

    }catch(err){ //if an error occurse,pass it to the catch block
        console.log(err) //log the error to console
    } //close catch block
} //end function