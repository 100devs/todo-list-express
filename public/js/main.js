const deleteBtn = document.querySelectorAll('.fa-trash')
// gets all elements with the class ".fa-trash" and assigns it to the deleteBtn variable
const item = document.querySelectorAll('.item span')
// gets all elements with the class "span" that have a ".item" parent and assign them to the item variable
const itemCompleted = document.querySelectorAll('.item span.completed')
// gets all elements with the class "span.completed" within a ".item" parent and assign them to the itemCompleted variable

Array.from(deleteBtn).forEach((element)=>{
// loops through each element in the deleteBtn array
    element.addEventListener('click', deleteItem)
    // listens to anytime the deleteItem variable is clicked
})

Array.from(item).forEach((element)=>{
// loops through each element in the item array
    element.addEventListener('click', markComplete)
    // listens to anytime the markComplete variable is clicked
})

Array.from(itemCompleted).forEach((element)=>{
// loops through each element in the itemCompleted array
    element.addEventListener('click', markUnComplete)
    // listens to anytime the markUnComplete variable is clicked
})

async function deleteItem(){
// creates an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText
    // creates an variable thats called itemText that grabs the text out of the childNode of a parentNode
    try{
    // creates a try catch
        const response = await fetch('deleteItem', {
        // creates a variable called response which fetches the deleteItem route
            method: 'delete',
            // deletes the item
            headers: {'Content-Type': 'application/json'},
            // specifies the content type is json
            body: JSON.stringify({
            // converts the json data to a string
              'itemFromJS': itemText
                // sends the items text
            })
          })
        const data = await response.json()
        // creates a variable called data that waits for the response from the server and changes the data to json then assigns it to the variable data
        console.log(data)
        // logs the data variable in the console
        location.reload()
        // reloads the current page

    }catch(err){
    // catches any errors
        console.log(err)
        // logs those errors
    }
}

async function markComplete(){
// creates an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText
    // creates a variable called itemText that grabs the inner text from the childNode within the parentNode
    try{
    // creates a try catch
        const response = await fetch('markComplete', {
        // creates a variable called response that waits for the markComplete route to be fetched
            method: 'put',
            // puts the item in the relative nodes
            headers: {'Content-Type': 'application/json'},
            // specifies the content type is json
            body: JSON.stringify({
                // converts the json content to a string
                'itemFromJS': itemText
                // sends the items text
            })
        })
        const data = await response.json()
        // creates a variable called data that waits for the response from the server and changes the data to json then assigns it to the variable data
        console.log(data)
        // logs the data to the console
        location.reload()
        // reloads the current browser page

    }catch(err){
        // catches any error
        console.log(err)
        // logs that error
    }
}

async function markUnComplete(){
    // creates an asynchronous function called "markUnComplete"
    const itemText = this.parentNode.childNodes[1].innerText
    // creates a variable called itemText that grabs the inner text from the childNode within the parentNode
    try{
        // creates a try catch
        const response = await fetch('markUnComplete', {
            // creates a variable called response which fetches the markUnComplete route
            method: 'put',
            // puts them in the relative nodes
            headers: {'Content-Type': 'application/json'},
            // specifies the content type is json
            body: JSON.stringify({
                // converts the json content to a string
                'itemFromJS': itemText
                // sends the items text
            })
        })
        const data = await response.json()
        // creates a variable called data that waits for the response from the server and changes the data to json then assigns it to the variable data
        console.log(data)
        // logs the data
        location.reload()
        // reloads the current page

    }catch(err){
    // catches any errors
        console.log(err)
        // logs those errors
    }
}
