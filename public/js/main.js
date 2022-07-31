//const variables cannot be reassigned
const deleteBtn = document.querySelectorAll('.fa-trash')         //Create var. Go through index.ejs & find the class fa-trash and define them as deleteBtn. This should be every item displayed.
const item = document.querySelectorAll('.item span')             //Create var. Go through index.ejs and find any span tag in the class of item and define them as item. Any span with parent of class item. See index li tag.
const itemCompleted = document.querySelectorAll('.item span.completed') //Create var. Find all class completed with parent of span that also has parent of class of item. 

Array.from(deleteBtn).forEach((element)=>{                   //From the items in this constant, make an array, then loop through the array. 
    element.addEventListener('click', deleteItem)            //Each element in the array receives an event listener that on click will delete the item by calling function deleteItem.   
})

Array.from(item).forEach((element)=>{                         //From the items in this constant, make an array, then loop through the array.
    element.addEventListener('click', markComplete)            //Each element in the array receives an event listener that on click will call the function markComplete and mark the item as complete.
})

Array.from(itemCompleted).forEach((element)=>{                  //From the items in this constant, make an array, then loop through the array.
    element.addEventListener('click', markUnComplete)          //Each element in the array receives an event listener that on click will call the function markUnComplete and switch the boolean.
})

async function deleteItem(){                                        //New function called by first event listener. asynchrynous allows other code to run while waiting for response
    const itemText = this.parentNode.childNodes[1].innerText        //New constant holding inner text of element. looks inside list to get text of the specified list item. parent of trashcan is li, then span, then elements are opening tag, then text, then closing tag.
     try{                                                           //Try and catch block.     
        const response = await fetch('deleteItem', {                //New variable to hold results of fetch (data). This function calls a function deleteItem from server.js.    
            method: 'delete',                                       //Sets the CRUD method to be used for the route.
            headers: {'Content-Type': 'application/json'},          //Expect the content to be JSON
            body: JSON.stringify({                                  // Declare the response to be string
              'itemFromJS': itemText                                //setting additional key itemFromJS: the itemText as defined above.
            })
          })
        const data = await response.json()                          //New var. We waited on response. Now have it and need to wait for JSON version.
        console.log(data)                                           //Log the data variable
        location.reload()                                           //When finished, reload the page to show updated information

    }catch(err){                                                       //catch block to console log the err
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText        //New function called by first event listener. asynchrynous allows other code to run while waiting for response
    try{                                                            //New constant holding inner text of element. looks inside list to get text of the specified list item. 
        const response = await fetch('markComplete', {              //New variable to hold results of fetch (data). This function calls a function markComplete from server.js.              
            method: 'put',                                          //CRUD method for route is update
            headers: {'Content-Type': 'application/json'},          //See above
            body: JSON.stringify({                                  //See above
                'itemFromJS': itemText                              //See above
            })
          })
        const data = await response.json()                          //See above
        console.log(data)                                           //See above
        location.reload()                                           //See above

    }catch(err){                                                       //See above
        console.log(err)
    }
}

async function markUnComplete(){                                        //See above
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {        
            method: 'put',                                              //CRUD method for route is Update
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}