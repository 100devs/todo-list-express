const deleteBtn = document.querySelectorAll('.fa-trash') //creating var and assigning it to a selection of all elements with a class trash of can
const item = document.querySelectorAll('.item span') //creating var and assigning it to a selection of span tags inside a parent of class item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating var and assigning it to slection of spans with class of completed inside parent class of item

Array.from(deleteBtn).forEach((element)=>{ //create array from selection and starting a loop
    element.addEventListener('click', deleteItem) //add event listener to current item that waits for click and calls fn deleterItem
})//close loop

Array.from(item).forEach((element)=>{//create array from selection and starting a loop
    element.addEventListener('click', markComplete)//add event listener to current item that waits for click and calls fn markComplete
})

Array.from(itemCompleted).forEach((element)=>{//create array from selection and starting a loop
    element.addEventListener('click', markUnComplete) //add event listener to current item that waits for click and calls fn markUnComplete
})//close loop

async function deleteItem(){ //declare async func
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs oonly the inner text within the list span
    try{// starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response var that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specficying the type of conent expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and convert to string
              'itemFromJS': itemText //settting content of body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          })//closing the object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data)// log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if error occures pass to catch block
        console.log(err) //log error to console
    } //close catch
}//end the function

async function markComplete(){ //declare async func
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs oonly the inner text within the list span
    try{// starting a try block to do something
        const response = await fetch('markComplete', {//creates a response var that waits on a fetch to get data from the result of markComplete route
            method: 'put', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specficying the type of conent expected, which is JSON
            body: JSON.stringify({//declare the message content being passed and convert to string
                'itemFromJS': itemText //settting content of body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)// log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if error occures pass to catch block
        console.log(err) //log error to console
    } //close catch
}//end the function

async function markUnComplete(){ //declare async func
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item and grabs oonly the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response var that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specficying the type of conent expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and convert to string
                'itemFromJS': itemText //settting content of body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          })//closing the object
        const data = await response.json()
        console.log(data)// log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if error occures pass to catch block
        console.log(err) //log error to console
    } //close catch
}//end the function