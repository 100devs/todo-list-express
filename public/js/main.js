const deleteBtn = document.querySelectorAll('.fa-trash')    //assigns delete button to all with class of .fa-trash
const item = document.querySelectorAll('.item span')        //assigns item to all span in class of .item
const itemCompleted = document.querySelectorAll('.item span.completed') //assigns itemCompleted to all span with completed inside of item class

Array.from(deleteBtn).forEach((element)=>{  //creates array from selection and starts loop
    element.addEventListener('click', deleteItem) //adds event listener to current item waits for click and calls function deleteItem
})

Array.from(item).forEach((element)=>{  //creates array from selection and starts loop
    element.addEventListener('click', markComplete)  //adds event listener to current item waits for click and calls function markComplete
})

Array.from(itemCompleted).forEach((element)=>{ //creates an array from selection and starts loop
    element.addEventListener('click', markUnComplete) //adds event listener to completed items waits for click on completed items and calls function markUnComplete
})

async function deleteItem(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //grabs inner text in the list
    try{ //we're gonna try the next thing coming
        const response = await fetch('deleteItem', { //assigns a response waits on a fetch to get data from result of deleteItem route
            method: 'delete', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //expects type of content to be JSON
            body: JSON.stringify({ //assigns content to body and stringifies that content
              'itemFromJS': itemText //names content itemFromJS and assigns the value to the inner text of the list item
            })
          })
        const data = await response.json() //waits for JSON from response to be converted
        console.log(data) //logs result to console
        location.reload() //reloads page to update what is shown

    }catch(err){    //catches errors and logs them to console
        console.log(err)
    }
}

async function markComplete(){ //declares asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //grabs inner text in the list item
    try{
        const response = await fetch('markComplete', { //assigns a response waits on fetch to get data from result of markComplete route
            method: 'put', //sets the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //expects JSON content type
            body: JSON.stringify({ //assigns content to body and stringifies that content
                'itemFromJS': itemText //names content itemFromJS and assigns the value to the inner text of the list item
            })
          })
        const data = await response.json() //waits for JSON from response to be converted
        console.log(data) //logs result to console
        location.reload() //reloads page to update what is shown

    }catch(err){ //catches errors and logs them to console
        console.log(err)
    }
}

async function markUnComplete(){ //declares asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //grabs inner text in the list item
    try{
        const response = await fetch('markUnComplete', { //assigns a response waits on fetch to get data from result of markUnComplete route
            method: 'put', //sets the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //expects JSON content type
            body: JSON.stringify({ //assigns content to body and stringifies that content
                'itemFromJS': itemText //names content itemFromJS and assigns the value to the inner text of the list item
            })
          })
        const data = await response.json() //waits for JSON from response to be converted
        console.log(data) //logs result to console
        location.reload() //reloads page to update what is shown


    }catch(err){    //catches errors and logs them to console
        console.log(err)
    }
}