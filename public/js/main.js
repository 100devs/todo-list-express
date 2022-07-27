//looks for the classes and elements specified in parentheses
const deleteBtn = document.querySelectorAll('.fa-trash')
//item will be identified with item span
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//call deleteItem() function on 'click', will look at the array and each element will deleted
//Array is from fa-trash class, anytime a user clicks, it will go
//through each element to find what to delete
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//if someone clicks on .item span, then element will be marked completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//if someone clicks on .item span.completed, then element will be marked uncomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//async function where deleteItem()(method or function) that won't run in the same loop
//function that can wait for info to come in before running the rest of the function
async function deleteItem(){
    //reference to mongodb or database of some sort that has nodes that it uses
    //will probably look at parentNode and childNode on the other side
    //innerText is whatever the user entered beforehand
    //this is what we clicked to run function (trash icon), parentNode is a list item
    //childNodes of parentItems -grab 2nd one in the array and get the item to put in 
    //to body in response to show that's what we want to delete from database
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block, await until fetch is done until it's done then run rest of code
    //try is attempting to do this thing in the try block
    //try is asking to fetch deleteItem to delete text
    try{
        //identifying specific todo list item to delete
        const response = await fetch('deleteItem', {
            //we want to delete
            method: 'delete',
            //something that is in json form
            headers: {'Content-Type': 'application/json'},
            //item that will be deleted
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //data will wait for all of items in response.json() to return
        const data = await response.json()
        //log data
        console.log(data)
        location.reload()
    //if you can't get through try then it comes to catch to return an error
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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