//using queryselectorall to select all elements containing the specified classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//selectorall returns a nodelist, so you have to use Array.from to turn the nodelists into arrays, so that then you can call the foreach method on them to then add a click event listener to each element
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//the click events trigger the functions deleteitem, markcomplete and markuncomplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//delete item - variable item text is set from 'this' which is the object that is being clicked on and triggering the event, so in this case, the span that is clicked. The way it is chained, it will grab the parent node, and then the child node, and then grab the inner text. This allows the function to work with both the task span and the FA trash icon
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    //try, catch block to try the following fetch request, and if there is an err with the request, the catch block will log the err in the terminal
    try{
//fetch request to deleteitem on the server side, method delete - the body sends a json object with the key of itemFromJs, and the value of itemText, which will be the task text
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //then the response is rec'd and stored in the variable data, it is logged in the console, and the page is reloaded
        const data = await response.json()
        console.log(data)
        location.reload()


//err will be logged if one is caught
    }catch(err){
        console.log(err)
    }
}
//variable item text is set from 'this' which is the object that is being clicked on and triggering the event, so in this case, the span that is clicked. The way it is chained, it will grab the parent node, and then the child node, and then grab the inner text. This allows the function to work with both the task span and the FA trash icon
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    console.log(this.innerText)
    // console.log(itemText)
        //try, catch block to try the following fetch request, and if there is an err with the request, the catch block will log the err in the terminal
    try{
        //fetch request to markComplete on the server side, method delete - the body sends a json object with the key of itemFromJs, and the value of itemText, which will be the task text
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
                    //then the response is rec'd and stored in the variable data, it is logged in the console, and the page is reloaded
        const data = await response.json()
        console.log(data)
        location.reload()



    }catch(err){
        console.log(err)
    }
}
//variable item text is set from 'this' which is the object that is being clicked on and triggering the event, so in this case, the span that is clicked. The way it is chained, it will grab the parent node, and then the child node, and then grab the inner text. This allows the function to work with both the task span and the FA trash icon
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
        //try, catch block to try the following fetch request, and if there is an err with the request, the catch block will log the err in the terminal
    try{
        //fetch request to markUnComplete on the server side, method delete - the body sends a json object with the key of itemFromJs, and the value of itemText, which will be the task text
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
                    //then the response is rec'd and stored in the variable data, it is logged in the console, and the page is reloaded
        const data = await response.json()
        console.log(data)
        location.reload()



    }catch(err){
        console.log(err)
    }
}