const deleteBtn = document.querySelectorAll('.fa-trash')
//assigns the unchanging variable of deleteBtn to select all elements in the DOM with the class of fa-trash
const item = document.querySelectorAll('.item span')
//assigns the unchanging variable of item to select all of the html elements in the DOM with the class of item and all of the elements span 

const itemCompleted = document.querySelectorAll('.item span.completed')
// assigns the unchanging variable itemCompleted to select all of the html elements with the class of item and all of the spans with the class of completed 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Converts the elements of deleteBtn to an array and than iterates through the elements from that array and listens for a click event on each of those elements. If it hears a click it runs the function of deleteItem

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Converts the elements from the variable item to an array and then iterates through all of those elements and listens for the event of click. If it hears a click it runs the function of markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Converts the elements from the variable of itemCompleted to an array and then iterates through those elements listening for the event of click. If it hears a clikc it runs markUnComplete on that element. 

async function deleteItem(){
    //this is the asyncronous function called deletItem
    const itemText = this.parentNode.childNodes[1].innerText
    //this is the unchanging variable called itemText with is set equal to the text that is inside the (parentNode <li>) and the (childNode[1]<span>)
    try{
        //tryyyy
        const response = await fetch('deleteItem', {
            //make a fetch with the url path of deleteItem
            method: 'delete',
            //send the delete method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
              //send the object property of itemFromJS and the value of the variable itemText
            })
          })
        const data = await response.json()
        //wait for the response from the  and assign it to data
        console.log(data)
        //log the data in the console
        location.reload()
        //refresh the webpage

    }catch(err){
        console.log(err)
    }
    // if there is an err log the err to the console. 
}

async function markComplete(){
    //asychronous function call markComplete
    const itemText = this.parentNode.childNodes[1].innerText
    //this is the unchanging variable called itemText with is set equal to the text that is inside the (parentNode <li>) and the (childNode[1]<span>)
    try{
        const response = await fetch('markComplete', {
        //make a fetch through the path of markComplete
            method: 'put',
        //send the method of put
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
        //send the object property of itemFromJS and the value of the variable itemText
            })
          })
        const data = await response.json()
        //wait for the response and store it in the variable data
        console.log(data)
        //log to the console the variable data
        location.reload()
        //refresh the webpage

    }catch(err){
        console.log(err)
        //log to the console an error if there is an error
    }
}

async function markUnComplete(){
    //asychronous function call markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText
    //this is the unchanging variable called itemText with is set equal to the text that is inside the (parentNode <li>) and the (childNode[1]<span>)
    try{
        const response = await fetch('markUnComplete', {
        //make a fetch through the path of markComplete
            method: 'put',
        //send method of put
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
        //send the object property of itemFromJS and the value of the variable itemText
            })
          })
        const data = await response.json()
        //wait for the response and store it in the variable data
        console.log(data)
        //log to the console the variable data
        location.reload()
        //refresh the webpage

    }catch(err){
        console.log(err)
        //log to the console an error if there is an error
    }
}