//gets all elements with class of 'fa-trash' and assigns the NodeList to deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//gets all elements in a span with class of 'item' and assigns list to variable item
const item = document.querySelectorAll('.item span')
//gets all items with in span of class 'item' and 'completed' and stores them in this variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates array from deleteBtn variable and starts a forEach loop
Array.from(deleteBtn).forEach((element)=>{
    //adds event listener on each item from deleteBtn that calls deleteItem function on click
    element.addEventListener('click', deleteItem)
})

//creates array from item variable and starts a forEach loop
Array.from(item).forEach((element)=>{
    //adds event listener on each item in array that calls markComplete function on click 
    element.addEventListener('click', markComplete)
})

//creates array from itemCompleted variable and starts a forEach loop
Array.from(itemCompleted).forEach((element)=>{
    //adds event listener on each item in array that calls markUnComplete function on click 
    element.addEventListener('click', markUnComplete)
})

//creates async function called deleteItem
async function deleteItem(){
    //targets a child node of the parent node which is the span, pulls the innerText from child node
    const itemText = this.parentNode.childNodes[1].innerText
    //starts try block, error prevention
    try{
        //makes deleteItem fetch from server
        const response = await fetch('deleteItem', {
            //sets request method to delete
            method: 'delete',
            //sets content type to json
            headers: {'Content-Type': 'application/json'},
            //sends the object with a property of itemFromJS and value of the itemText variable assigned above as string of JSON
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //awaits response as JSON and assigns it to data variable
        const data = await response.json()
        //data is logged to console
        console.log(data)
        //reloads page
        location.reload()
    //catches errors and logs to console
    }catch(err){
        console.log(err)
    }
}

//creates async function called markComplete
async function markComplete(){
    //takes text from targeted span
    const itemText = this.parentNode.childNodes[1].innerText
    //starts try block, error prevention
    try{
        //makes markComplete fetch from server
        const response = await fetch('markComplete', {
            //sets request method to put
            method: 'put',
            //sets content type to json
            headers: {'Content-Type': 'application/json'},
            //sends the object with a property of itemFromJS and value of the itemText variable assigned above as string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //awaits response as JSON and assigns it to data variable
        const data = await response.json()
        //logs data
        console.log(data)
        //reloads page
        location.reload()
    //catches errors and logs them
    }catch(err){
        console.log(err)
    }
}

//creates async function called markUnComplete
async function markUnComplete(){
    //takes text from targeted span
    const itemText = this.parentNode.childNodes[1].innerText
    //starts try block, error prevention
    try{
        //makes markUnComplete fetch from server
        const response = await fetch('markUnComplete', {
            //sets request method to put
            method: 'put',
            //sets content type to json
            headers: {'Content-Type': 'application/json'},
             //sends the object with a property of itemFromJS and value of the itemText variable assigned above as string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
         //awaits response as JSON and assigns it to data variable
        const data = await response.json()
        //logs data
        console.log(data)
        //reloads page
        location.reload()
 //catches errors and logs them
    }catch(err){
        console.log(err)
    }
}