//grabs selectors with a class of 'fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
//grabs all spans with a class of 'item'
const item = document.querySelectorAll('.item span')
//grabs all spans with a direct class of 'completed' and a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')


//makes an array from deleteBtn, loops and executes following function on each element
Array.from(deleteBtn).forEach((element)=>{
    //adds an event listener to each element that runs the deleteItem function on click
    element.addEventListener('click', deleteItem)
})

//makes an array from item, loops and executes following function on each element
Array.from(item).forEach((element)=>{
    ///adds an event listener to each element that runs the markComplete function on click
    element.addEventListener('click', markComplete)
})

//makes an array from itemCompleted, loops and executes following function on each element
Array.from(itemCompleted).forEach((element)=>{
    //adds an event listener to each element that runs the itemCompleted function on click
    element.addEventListener('click', markUnComplete)
})

//async function that deletes an item
async function deleteItem(){
    //grabs text from span element (child) within the list element (parent), stored in variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try...catch blocks vv
    try{
        //fetch request sent to '/deleteItem' route and awaited response is stored in response variable
        const response = await fetch('deleteItem', {
            //sets CRUD request method
            method: 'delete',
            //sets expected content type
            headers: {'Content-Type': 'application/json'},
            //converts content into a JSON string
            body: JSON.stringify({
                //sets a key of 'itemFromJS and makes the inner text the value
              'itemFromJS': itemText
            })
          })
        //awaits response, converts to JSON, stores it in variable  
        const data = await response.json()
        //console log the response
        console.log(data)
        //reload the page
        location.reload()

    //catches any errors thrown from try
    }catch(err){
        //logs the error
        console.log(err)
    }
}

//async function that marks an item as complete
async function markComplete(){
    //grabs text from span element (child) within the list element (parent), stored in variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try...catch blocks vv
    try{
        //fetch request sent to '/markComplete' route and awaited response is stored in response variable
        const response = await fetch('markComplete', {
            //sets CRUD request method
            method: 'put',
            //sets expected content type
            headers: {'Content-Type': 'application/json'},
            //converts content into a JSON string
            body: JSON.stringify({
                //sets a key of 'itemFromJS and makes the inner text the value
                'itemFromJS': itemText
            })
          })
        //awaits response, converts to JSON, stores it in variable 
        const data = await response.json()
        //console log the response
        console.log(data)
        //reload the page
        location.reload()

    //catches any errors thrown from try
    }catch(err){
        //logs the error
        console.log(err)
    }
}

//async function that will undo marking an item as completed
async function markUnComplete(){
    //grabs text from span element (child) within the list element (parent), stored in variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try...catch blocks vv
    try{
        //fetch request sent to '/markUnComplete' route and awaited response is stored in response variable
        const response = await fetch('markUnComplete', {
            //sets CRUD request method
            method: 'put',
            //sets expected content type
            headers: {'Content-Type': 'application/json'},
            //converts content into a JSON string
            body: JSON.stringify({
                //sets a key of 'itemFromJS and makes the inner text the value
                'itemFromJS': itemText
            })
          })
        //awaits response, converts to JSON, stores it in variable 
        const data = await response.json()
        //console log the response
        console.log(data)
        //reload the page
        location.reload()

    //catches any errors thrown from try
    }catch(err){
        //logs the error
        console.log(err)
    }
}