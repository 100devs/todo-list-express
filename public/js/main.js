const deleteBtn = document.querySelectorAll('.fa-trash') //setting a constant to select '.fa-trash' in the document
const item = document.querySelectorAll('.item span') //setting a constant item for all '.item span' in the doc
const itemCompleted = document.querySelectorAll('.item span.completed') //setting a const to select '.item span.completed'

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //adding an event listener for each element in deleteBtn, to listen on click and call deleteItem

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})//adding an event listener for each element in item, to listen on click, and call markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//adding an event listener for itemCompleted elements, on click, to call markUnComplete

//the function that runs for deleteItem calls, async await syntax
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText is the innerText of the first index of childNodes, in parentNode
    try{ //try this
        const response = await fetch('deleteItem', {//wait for a request to 'deleteItem'
            method: 'delete', //delete request
            headers: {'Content-Type': 'application/json'},//sending json content
            body: JSON.stringify({ //turn into a JSON string
              'itemFromJS': itemText//assign itemText to 'itemFromJS'
            })
          })
        const data = await response.json()//data parsed as json
        console.log(data)//console log the data that was returned
        location.reload()//reload page

    }catch(err){
        console.log(err)//catch and console log error
    }
}
//the function that runs for markComplete calls, async await syntax
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText is the innertext of the first index of childNodes, in parentNode
    try{ // try this
        const response = await fetch('markComplete', { //wait for a request to 'markComplete'
            method: 'put',//put request
            headers: {'Content-Type': 'application/json'},//json content
            body: JSON.stringify({//turn into json string
                'itemFromJS': itemText// assign itemText to 'itemsFromJS'
            })
          })
        const data = await response.json()// data parsed as json
        console.log(data)//console log the data that was returned
        location.reload()//reload page

    }catch(err){//catch and console.log error
        console.log(err)
    }
}
//function that runs for markUnComplete calls, async await syntax
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText is the innertext of the first index of childNodes, in parentNode
    try{
        const response = await fetch('markUnComplete', {//wait for request to 'markUnComplete'
            method: 'put',// put request
            headers: {'Content-Type': 'application/json'},//content is json
            body: JSON.stringify({ //turn into json string
                'itemFromJS': itemText //asign itemText to 'itemsFromJS'
            })
          })
        const data = await response.json()//data parsed as json
        console.log(data)// console log the data returned
        location.reload()//reload page

    }catch(err){
        console.log(err)//catch and console log error
    }
}