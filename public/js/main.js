// grab all the elements with the fa-trash class name and store them
const deleteBtn = document.querySelectorAll('.fa-trash')
// grab all the spans with the .item class name and store them
const item = document.querySelectorAll('.item span')
// grab all the spans with the completed class, under an element with the item class and store them
const itemCompleted = document.querySelectorAll('.item span.completed')

//put all the elements grabbed earlier , put them into an array, and loop through and give them each an event listener that will run the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//put all the elements grabbed earlier , put them into an array, and loop through and give them each an event listener that will run the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//put all the elements grabbed earlier , put them into an array, and loop through and give them each an event listenerthat will run the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// declare an asynchonronous function
async function deleteItem(){
    // go to where the click was heard, go up to its parentNode and from there grab the inner text of its childNode with an index of 1
    const itemText = this.parentNode.childNodes[1].innerText
    // enclose the requests in try catch blocks
    try{
        // await from the fetch's promise on the deleteItem route to resolve and store the response in the response variable
        const response = await fetch('deleteItem', {
            //make a delete request
            method: 'delete',
            //send info about what kind of doc the request is in
            headers: {'Content-Type': 'application/json'},
            // change the requestbody into JSON
            body: JSON.stringify({
                // send the text from itemText into body, and make it accessible with the var itemFromJS
              'itemFromJS': itemText
            })
          })
          // await for the data to be read and parsed into json and then store it in data if it resolves
        const data = await response.json()
        //console.log the response in json format on the client's broswer
        console.log(data)
          // reload the current page
        location.reload()

          //catch any errors and console.log them
    }catch(err){
        console.log(err)
    }
}

// declare an asynchonronous function
async function markComplete(){
     // go to where the click was heard, go up to its parentNode and from there grab the inner text of its childNode with an index of 1
     const itemText = this.parentNode.childNodes[1].innerText
       // enclose the requests in try catch blocks
    try{
         // await from the fetch's promise on the deleteItem route to resolve and store the response in the response variable
        const response = await fetch('markComplete', {
             //make a put request
            method: 'put',
            //send info about what kind of doc the request is in
            headers: {'Content-Type': 'application/json'},
            // change the requestbody into JSON
            body: JSON.stringify({
                 // send the text from itemText into body, and make it accessible with the var itemFromJS
                'itemFromJS': itemText
            })
          })
           // await for the data to be read and parsed into json and then store it in data if it resolves
        const data = await response.json()
         //console.log the response in json format on the client's broswer
        console.log(data)
         // reload the current page
        location.reload()

    }catch(err){
          //catch any errors and console.log them
        console.log(err)
    }
}

// declare an asynchonronous function
async function markUnComplete(){
    // go to where the click was heard, go up to its parentNode and from there grab the inner text of its childNode with an index of 1
    const itemText = this.parentNode.childNodes[1].innerText
      // enclose the requests in try catch blocks
    try{
          // await from the fetch's promise on the deleteItem route to resolve and store the response in the response variable
        const response = await fetch('markUnComplete', {
             //make a put request
            method: 'put',
            //send info about what kind of doc the request is in
            headers: {'Content-Type': 'application/json'},
             // change the requestbody into JSON
            body: JSON.stringify({
                // send the text from itemText into body, and make it accessible with the var itemFromJS
                'itemFromJS': itemText
            })
          })
           // await for the data to be read and parsed into json and then store it in data if it resolves
        const data = await response.json()
         //console.log the response in json format on the client's broswer
        console.log(data)
        // reload the current page
        location.reload()

    }catch(err){
        //catch any errors and console.log them
        console.log(err)
    }
}
