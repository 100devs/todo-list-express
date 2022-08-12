
// labels the icon from font awesome with the class name .fa-trash as the delete button
const deleteBtn = document.querySelectorAll('.fa-trash')

// labels the class .item and spans as item
const item = document.querySelectorAll('.item span')

// labels the spans from the items list with the class of completed as itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array and starts a loop
Array.from(deleteBtn).forEach((element)=>{
    //adds an event listener to run the function deleteItem on each deleteBtn that is generated with each deleteBtn 
    element.addEventListener('click', deleteItem)
})

//creates an array and starts a loop
Array.from(item).forEach((element)=>{
//adds event listener to run the function markComplete on each generated item
    element.addEventListener('click', markComplete)
})

//creates an array and starts a loop
Array.from(itemCompleted).forEach((element)=>{
//adds event listener to run the function to un-complete a completed item
    element.addEventListener('click', markUnComplete)
})

//async because it interacts with a backend and you want to keep the app running while communication happens
async function deleteItem(){

    //looks in the parentNode for childNode[1] to target the innertext
    const itemText = this.parentNode.childNodes[1].innerText
    //try-catch because you are dealing with a database and it might not go through
    try{
        //labels our communication with the backend to run our function from our 'deleteItem' route as response
        const response = await fetch('deleteItem', {
            //method of interaction with the thing is 'delete'
            method: 'delete',
            //content type is the original media type which is json
            headers: {'Content-Type': 'application/json'},
            //body is like the message being passed which we are turning to string from json
            body: JSON.stringify({
                //labels the body: shows itemText
              'itemFromJS': itemText
            })//closing the stringify
          })//closing the fetch and object
          //need to await our fetch request and function and get it as json data which we are calling data
        const data = await response.json()
        //console logging the data
        console.log(data)
        //refreshes the page
        location.reload()

        //when dealing with async functions you need to see whatever errors may pop up so you can fix them
    }catch(err){
        //console logging the error
        console.log(err)
    }
}

//async because it interacts with a backend and you want to keep the app running while communication happens
async function markComplete(){
    //finds the innerText of the childNode at the [1] spot in the parentNode and labels it itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //need a try-catch with async functions because maybe things go wrong and you need to see errors
    try{
        //labeling our fetch request the to backend response, which will run the function from the 'markComplete' route
        const response = await fetch('markComplete', {
            //method of interaction is 'put' which is modify
            method: 'put',
            //showing our original media type which is json
            headers: {'Content-Type': 'application/json'},
            //body is like the message being passed which we are turning to string from json
            body: JSON.stringify({
                //labels the body: shows itemText
                'itemFromJS': itemText
            })//closing the stringify
          })//closing the fetch and object
        //need to await our fetch request and function and get it as json data which we are calling data
        const data = await response.json()
        //console logging the data
        console.log(data)
        //refreshes the page
        location.reload()
        //when dealing with async functions you need to see whatever errors may pop up so you can fix them  
    }catch(err){
        //console logging the error
        console.log(err)
    }
}

//async because it interacts with a backend and you want to keep the app running while communication happens
async function markUnComplete(){
    //finds the innerText of the childNode at the [1] spot in the parentNode and labels it itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //need a try-catch with async functions because maybe things go wrong and you need to see errors
    try{
        //labeling our fetch request the to backend response, which will run the function from the 'markUnComplete' route
        const response = await fetch('markUnComplete', {
            //labels the method which is 'put' which is to modify
            method: 'put',
            //shows the original media type which is json
            headers: {'Content-Type': 'application/json'},
            //body is the message we send which we turn to string
            body: JSON.stringify({
                //labels the body and shows itemText
                'itemFromJS': itemText
            })//closes the stringify
          })//closes the fetch and object
        //need to await our fetch request and function and get it as json data which we are calling data
        const data = await response.json()
        //console logging the data
        console.log(data)
        //refreshes the page
        location.reload()

        //this will show errors if we have any
    }catch(err){
        //this will console log the error
        console.log(err)
    }
}