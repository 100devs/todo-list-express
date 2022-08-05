const deleteBtn = document.querySelectorAll('.fa-trash') //grab all the trash items
const item = document.querySelectorAll('.item span') //grab all the items
const itemCompleted = document.querySelectorAll('.item span.completed') //grab all the completed spans

Array.from(deleteBtn).forEach((element)=>{ //for every delete button you grabbed
    element.addEventListener('click', deleteItem) //add the event listener that connects the delete item function
})

Array.from(item).forEach((element)=>{     //for every item you grabbed,
    element.addEventListener('click', markComplete)  //attach an event listener for the function to mark as completed
})

Array.from(itemCompleted).forEach((element)=>{ //for all the items you've marked as complete
    element.addEventListener('click', markUnComplete) //attach a listener for marking it as uncomplete
})

async function deleteItem(){  //da asynchronous function to delete an item
    const itemText = this.parentNode.childNodes[1].innerText  //pluck the name of the item from the html
    try{                             //do this stuff, and hopefully it works
        const response = await fetch('deleteItem', {   //use this deleteItem endpoint
            method: 'delete',                       //the method is DELETE
            headers: {'Content-Type': 'application/json'},  //Add metadata that you're sending JSON
            body: JSON.stringify({                  //the body should contain JSON as a string
              'itemFromJS': itemText                //Send the name of the item to delete as a property called itemFromJS
            })
          })                    //end da fetch lol
        const data = await response.json()  //set the result of the fetch request to data
        console.log(data)           //don't you want to log that result?
        location.reload()           //and how about reloading the page? so the data is updated front-end

    }catch(err){            //if something went wrong
        console.log(err)    //show us what!
    }
}

async function markComplete(){      //triggered when you click on the mark completed button for an item
    const itemText = this.parentNode.childNodes[1].innerText  //pluck the name of the item from the DOM
    try{                        //give dis a shot
        const response = await fetch('markComplete', {      //run a request on the endpoint markComplete
            method: 'put',          //i hope the server is picking up what we're puttin down
            headers: {'Content-Type': 'application/json'},      //tell the backend that we're sending json
            body: JSON.stringify({          //send a string of the object
                'itemFromJS': itemText      //the object has an itemFromJS property that contains the name of the item to mark complete
            })
          })
        const data = await response.json()  //whatever the server sends back, store in here
        console.log(data)       //now log that
        location.reload()       //and reload the page.

    }catch(err){            //if something went wrong, you can do stuff with this err variable
        console.log(err)    //log the error
    }
}

async function markUnComplete(){    //triggered when you mark something as incomplete
    const itemText = this.parentNode.childNodes[1].innerText //pluck the name of the item from the DOM
    try{                    //give this a shot
        const response = await fetch('markUnComplete', {    //try a request to the endpoint markUnComplete!
            method: 'put',          //this request will be sent as PUT
            headers: {'Content-Type': 'application/json'},  //metadata telling the backend we're sending JSON
            body: JSON.stringify({      //send the following object in the body as JSON
                'itemFromJS': itemText  //a property called itemFromJS containing the name of the item we plucked from the DOM
            })
          })
        const data = await response.json()  //store the server's response in data
        console.log(data)       //log that response in the front end
        location.reload()       //reload the page with the updated data

    }catch(err){            //if something went wrong
        console.log(err)    //log the error
    }
}