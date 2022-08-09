const deleteBtn = document.querySelectorAll('.fa-trash') //delete button
const item = document.querySelectorAll('.item span')    //item text
const itemCompleted = document.querySelectorAll('.item span.completed') //item text

Array.from(deleteBtn).forEach((element)=>{ //for each delete button
    element.addEventListener('click', deleteItem) //add event listener
}) //end for each delete button

Array.from(item).forEach((element)=>{ //for each item
    element.addEventListener('click', markComplete) //add event listener
}) //end for each item

Array.from(itemCompleted).forEach((element)=>{  //for each item
    element.addEventListener('click', markUnComplete) //add event listener
}) //end for each item

async function deleteItem(){ //delete item
    const itemText = this.parentNode.childNodes[1].innerText //get item text
    try{ //try to delete item
        const response = await fetch('deleteItem', { //fetch delete item
            method: 'delete', //set method to delete
            headers: {'Content-Type': 'application/json'}, //set headers
            body: JSON.stringify({ //set body
              'itemFromJS': itemText //set item text
            }) //end body
          }) //end fetch
        const data = await response.json() //get response
        console.log(data) //log response
        location.reload() //reload page

    }catch(err){ //catch error
        console.log(err) //log error
    } //end try
} //end delete item

async function markComplete(){ //mark item as complete
    const itemText = this.parentNode.childNodes[1].innerText //get item text
    try{ //try to mark item as complete
        const response = await fetch('markComplete', { //fetch mark item as complete
            method: 'put', //set method to put
            headers: {'Content-Type': 'application/json'}, //set headers
            body: JSON.stringify({ //set body
                'itemFromJS': itemText //set item text
            }) //end body
          }) //end fetch
        const data = await response.json() //get response
        console.log(data) //log response
        location.reload() //reload page

    }catch(err){ //catch error
        console.log(err) //log error
    } //end try
} //end mark item as complete

async function markUnComplete(){ //mark item as uncomplete
    const itemText = this.parentNode.childNodes[1].innerText    //get item text
    try{  //try to mark item as uncomplete
        const response = await fetch('markUnComplete', { //fetch mark item as uncomplete
            method: 'put', //set method to put
            headers: {'Content-Type': 'application/json'}, //set headers
            body: JSON.stringify({ //set body
                'itemFromJS': itemText //set item text
            }) //end body
          }) //end fetch
        const data = await response.json() //get response
        console.log(data)   //log response
        location.reload() //reload page

    }catch(err){ //catch error
        console.log(err) //log error
    } //end try
} //end mark item as uncomplete