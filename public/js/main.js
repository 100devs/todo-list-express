const deleteBtn = document.querySelectorAll('.fa-trash')                                //declare object variable for all items with class "fa-trash" 
const item = document.querySelectorAll('.item span')                                    //declare object variable for all items with class "item span"
const itemCompleted = document.querySelectorAll('.item span.completed')                 //declare object variable for all itemst with class "item span.completed"

Array.from(deleteBtn).forEach((element)=>{                                              //create array of Delete buttons and iterarte on them...
    element.addEventListener('click', deleteItem)                                       //adding a click event listener to all the individual buttons to run deleteItem function
})

Array.from(item).forEach((element)=>{                                                   //create array of all todo items and iterarte on them...
    element.addEventListener('click', markComplete)                                     //adding a click event listener to all the individual todos to run markComplete function
})

Array.from(itemCompleted).forEach((element)=>{                                          //create array of all completed items and iterarte on them...
    element.addEventListener('click', markUnComplete)                                   //adding a click event listener to all the individual completed items to run markUnComplete function
})

async function deleteItem(){                                                            //new async await function to Delete items
    const itemText = this.parentNode.childNodes[1].innerText                            //assign variable of innerText of the item clicked on
    try{
        const response = await fetch('deleteItem', {                                    //send an object to the server with the following info
            method: 'delete',                                                           // method of DELETE to tell server to run app.delete
            headers: {'Content-Type': 'application/json'},                              // send as a json file
            body: JSON.stringify({                                                      //??     send the itemtext
              'itemFromJS': itemText  
            })
          })
        const data = await response.json()                                              // wait for a response from the app.delete
        console.log(data)                                                               //log data received from server
        location.reload()                                                               //reload page

    }catch(err){                                                                        //catch errore
        console.log(err)                                                                // console log errors if found
    }
}

async function markComplete(){                                                          
    const itemText = this.parentNode.childNodes[1].innerText                            //assign variable of innerText of the item clicked on
    try{                                                                                //try the following and catch errors in catch block
        const response = await fetch('markComplete', {                                  //send object to the server
            method: 'put',                                                              //method PUT for app.put
            headers: {'Content-Type': 'application/json'},                              //send as a json file
            body: JSON.stringify({                                                      
                'itemFromJS': itemText
            })
          })
        const data = await response.json()                                              // wait for response from the app.put    
        console.log(data)                                                               //console log data from server
        location.reload()                                                               //reload page

    }catch(err){                                                                        //catch errors
        console.log(err)                                                                //console log errors found
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText                            //assign variable of innerText of the item clicked on
    try{                                                                                //try the following and catch errors in catch block
        const response = await fetch('markUnComplete', {                                // senf object to the server
            method: 'put',                                                              //method PUT for app.put
            headers: {'Content-Type': 'application/json'},                              //send as a JSON file
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()                                              // wait for response from the app.put    
        console.log(data)                                                               //console log data from server
        location.reload()                                                               //reload page

   }catch(err){                                                                        //catch errors
        console.log(err)                                                                //console log errors found
    }
}