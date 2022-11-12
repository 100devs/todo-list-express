
//These are the trash cans
const deleteBtn = document.querySelectorAll('.fa-trash')
//our client side event listeners are the only thing that can hear
//us clicking on the items
const item = document.querySelectorAll('.item span')
//This listens for a click on a span with the class completed 
//that is a child of an element with the class item
const itemCompleted = document.querySelectorAll('.item span.completed')

//this listens for a click on the trash cans and then runs deleteItem 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//when an item  element is clicked the function markUnComplete runs
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//when an itemCompleted element is clicked the function markUnComplete runs
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //this refers to the trash can 
    // the parent node as the li
    //The childNodes[1] is the span  
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //a fetch is sent to the server, the fetch has the route deleteItem
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //the fetch sends the innertext of the span to the server
            //that is the itemText 
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        //when our client side reseives the response from the server side
        //it reloads the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //this selects the text from the span that was clicked
    //Child node one is actually the text in the span itself
    //0 is like bullet points and things that take up space
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //once the code hears the click we want to fetch 
        //with the fetch we can describe what type of method we want
        //it to be
        // markComplete is our route
        const response = await fetch('markComplete', {
            //the fetch is a put method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                //the item that was clicked will be refered to as itemFromJS 
                //in the server request 
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        //once marked complete is sent from the server the page is reloaded
        //triggering another get request which sees the changed 
        //document in the database and so changes it in the DOM
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
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