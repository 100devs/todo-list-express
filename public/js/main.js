const deleteBtn = document.querySelectorAll('.fa-trash') // selects all delte buttons
const item = document.querySelectorAll('.item span') // selects all "items" and saves them in an array
const itemCompleted = document.querySelectorAll('.item span.completed') //an array of all the completed items based on class complted

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which deletes the item

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which changes status completed

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which changes status to uncomplete

// this function is acalled when relevant button  is clicked
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //selects 
    // try catch block ensures the app will not break if ther is  a problem while executing
    try{
       /* use fetch api to send request to server  */ 
       const response = await fetch('deleteItem', { // save the response in a variable for 
            method: 'delete',
            headers: {'Content-Type': 'application/json'}, // specify that the request is sent in JSON format
            body: JSON.stringify({// JSON.stringify converts the object into JSON
              'itemFromJS': itemText //key value pair "item from JS is the key and vsalue is extracted from itemTesxt as shown above"
            })
          })
        const data = await response.json() // converts the response into  a readable object with only the information that we need
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
     // try catch block ensures the app will not break if ther is  a problem while executing
    try{
        /* use fetch api to send request to server  */
        const response = await fetch('markComplete', { // save the response in a variable for 
            method: 'put',
            headers: {'Content-Type': 'application/json'}, // specify that the request is sent in JSON format
            body: JSON.stringify({// JSON.stringify converts the object into JSON
                'itemFromJS': itemText //key value pair "item from JS is the key and vsalue is extracted from itemTesxt as shown above"
            })
          })
        const data = await response.json() // converts the response into  a readable object with only the information that we need
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
 // try catch block ensures the app will not break if ther is  a problem while executing
    try{
       /* use fetch api to send request to server  */
        const response = await fetch('markUnComplete', { // save the response in a variable for 
            method: 'put',
            headers: {'Content-Type': 'application/json'}, // specify that the request is sent in JSON format
            body: JSON.stringify({// JSON.stringify converts the object into JSON
                'itemFromJS': itemText //key value pair "item from JS is the key and vsalue is extracted from itemTesxt as shown above"
            })
          })
        const data = await response.json() // converts the response into  a readable object with only the information that we need
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}