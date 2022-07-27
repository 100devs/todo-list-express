//Client-side stuff that wil work 
const deleteBtn = document.querySelectorAll('.fa-trash')
// variables for the trash can Icon
const item = document.querySelectorAll('.item span')
// will target both class item, and the spans inside the list element
const itemCompleted = document.querySelectorAll('.item span .completed')
// variables that will target the class item, spans insides the list, and class completed

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//making an array from the variable deleteBtn, iterates for element and adds an eventlister

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//making an array from the variable item, iterates for element and adds an eventlister

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//making an array from the variable itemCompleted, iterates for element and adds an eventlister

async function deleteItem(){// async function for every element in deleteBtn
    //this will run when we press/click the delete button
    const itemText = this.parentNode.childNodes[1].innerText
    // this takes the text from the delete button, or text that will be deleted
    try{ // will attempt to do the actions insdes 
        const response = await fetch('deleteItem', { 
            //applying the delete method to the current items
            // ??
            method: 'delete',
            // looks at the express delete function 
            headers: {'Content-Type': 'application/json'},
            // this tells the server5 that we are sending json data
            body: JSON.stringify({
                //the item we are sending is being sent as a json string due to JSON.stringify
              'itemFromJS': itemText
              // specific element name 
              //connects to the request for app.delete
            })
          })
        const data = await response.json() 
        // defines data and stores the response 
        console.log(data) //console logs the data 
        location.reload() // reloads the page
    }catch(err){ //if anything fails, we console log the error 
        console.log(err)
    }
}

async function markComplete(){
    //this will act as the function when we complete the task 
    const itemText = this.parentNode.childNodes[1].innerText
    // defines the variable item text for the current text in the index.ejs file under todo
    try{
        //will attempt to do the code inside
        const response = await fetch('markComplete', {
            //goes to the express function markComplete
            method: 'put', // looks for the express put method
            headers: {'Content-Type': 'application/json'}, 
            // tells the server that we are sending json data
            body: JSON.stringify({
                'itemFromJS': itemText
                // sends the body as a JSON data 
            })
          })
          
        const data = await response.json()
        // defines data as the response 
        console.log(data) // logs the data 
        location.reload()// reload the page

    }catch(err){ // 
        console.log(err)
    }
}

async function markUnComplete(){
    // function that marks anything uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    // looks at the text inside the incomplete section  
    try{
        const response = await fetch('markUnComplete', {
            // looks at the express function markUncomplete with the method of put
            method: 'put', 
            headers: {'Content-Type': 'application/json'},
            //sending json data
            body: JSON.stringify({
                'itemFromJS': itemText
            })// placing the request.body with the object with properties of itemFromJS: itemText
          })
        const data = await response.json()
        // defines data as the response 
        console.log(data)
        // logs the data 
        location.reload()
            // reload the page
    }catch(err){
        console.log(err)
    }
}