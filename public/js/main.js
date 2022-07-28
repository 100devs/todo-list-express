// creates a nodelist named deleteBtn with every element with the class of fa-trash 
const deleteBtn = document.querySelectorAll('.fa-trash')
// creates a nodelist named item with every span with a parent of item class 
const item = document.querySelectorAll('.item span')
// creates a nodelist named itemCompleted with every span with completed class with a parent of item class 
const itemCompleted = document.querySelectorAll('.item span.completed')
// turns the nodelist from deleteBtn into an array and adds an event listener of click that activates the deleteItem function to each element when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// turns the nodelist from item into an array and adds an event listener of click that activates the markComplete function to each element when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// turns the nodelist from itemCompleted into an array and adds an event listener of click that activates the markUnComplete function to each element when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//declares an asynchronous function named deleteItem
async function deleteItem(){
    //looks at the text of inside of the parent
    const itemText = this.parentNode.childNodes[1].innerText
    //starts a try block to try the code underneath it
    try{
        //creates a response variable that gets a promise from the delete item route, with a delete method, expects a json
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //declares the message content being passed and stringifying it
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item and making it 'itemFromJS'
              'itemFromJS': itemText
            })
          })
        //waits the json from the reponse
        const data = await response.json()
        //console logs the data
        console.log(data)
        //refreshes the page
        location.reload()
          //if error occurs, passes error into the catch block
    }catch(err){
        //console logs the error
        console.log(err)
    }
}
//declares and anonymous function
async function markComplete(){
    //looks inside and grab the inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //starts the try block
    try{
        //awaits a promise that waits from the result of the markComplete route
        const response = await fetch('markComplete', {
            //sets the crud method to update
            method: 'put',
            //setting the expection that the returned content is json
            headers: {'Content-Type': 'application/json'},
            //stringifying the content 
            body: JSON.stringify({
                 //setting the content of the body to the inner text of the list item and making it 'itemFromJS'
                'itemFromJS': itemText
            })
          })
          //awaiting a promise from json
        const data = await response.json()
        //console logging the data
        console.log(data)
        //refreshing the page
        location.reload()
          //if an error occurs passes it into the catch block
    }catch(err){
        //console the logs error
        console.log(err)
    }
}

//declares and anonymous function
async function markUnComplete(){
        //looks inside and grab the inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //starts the try block
    try{
        //awaits a promise that waits from the result of the markUnComplete route
        const response = await fetch('markUnComplete', {
            //sets the crud method to update
            method: 'put',
            //setting the expection that the returned content is json
            headers: {'Content-Type': 'application/json'},
            //stringifying the content
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item and making it 'itemFromJS'
                'itemFromJS': itemText
            })
          })
          //waits the json from the reponse
        const data = await response.json()
        //console logs the data
        console.log(data)
        //refreshing the page
        location.reload()
//if an error occurs passes it into the catch block
    }catch(err){
        //console the logs error
        console.log(err)
    }
}