//Declare a deleteBtn variable and assign it the '.fa-trash' class from the index.ejs file
const deleteBtn = document.querySelectorAll('.fa-trash')
//Declare an item variable and assign it the span element with a class of item
const item = document.querySelectorAll('.item span')
//Declare the itemCompleted variable and assign it the span element with the classes of completed and item.
const itemCompleted = document.querySelectorAll('.item span.completed')

//Loop through deleteBtn elements
Array.from(deleteBtn).forEach((element)=>{
//Place a smurf on each deleteBtn element, on click 'deleteItem'    
    element.addEventListener('click', deleteItem)
})

//Loop through the item elements
Array.from(item).forEach((element)=>{
//Place a smurf on each element, on click 'markComplete'  
    element.addEventListener('click', markComplete)
})

//Loop through the itemCompleted elements
Array.from(itemCompleted).forEach((element)=>{
//Place a smurf on each element, on click 'markUncomplete'    
    element.addEventListener('click', markUnComplete)
})

//deleteItem function
async function deleteItem(){ 
//represents the first item in the li. li is the parentNode and item[i] is that first element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
    //Result of the fetch request from the app.delete request handler in server.js.    
        const response = await fetch('deleteItem', {
            //Specifies the type of method
            method: 'delete',
            //Specifies the content-type of the request
            headers: {'Content-Type': 'application/json'},
            //parses the data to a string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //response stored in the data variable
        const data = await response.json()
        console.log(data)
//reload page once the function is ran        
        location.reload()
//console log any errors
    }catch(err){
        console.log(err)
    }
}
//markComplete function
async function markComplete(){
//represents the first item in the li. li is the parentNode and item[i] is that first element    
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Result of the fetch request from the app.put request handler in server.js. 
        const response = await fetch('markComplete', {
            //Specifies the type of method
            method: 'put',
            //Specifies the content-type of the request
            headers: {'Content-Type': 'application/json'},
            //parses the data to a string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //response stored in the data variable
        const data = await response.json()
        console.log(data)
//reload page once the function is ran         
        location.reload()
//console log any errors
    }catch(err){
        console.log(err)
    }
}
//markUnComplete function
async function markUnComplete(){
//represents the first item in the li. li is the parentNode and item[i] is that first element    
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Result of the fetch request from the app.put request handler in server.js. 
        const response = await fetch('markUnComplete', {
            //Specifies the type of method
            method: 'put',
            //Specifies the content-type of the request
            headers: {'Content-Type': 'application/json'},
            //parses the data to a string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //response stored in the data variable
        const data = await response.json()
        console.log(data)
//reload page once the function is ran         
        location.reload()

    }catch(err){
//console log any errors        
        console.log(err)
    }
}