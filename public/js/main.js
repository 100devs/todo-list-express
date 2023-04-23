//identifies .fa-trash as deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//identifies .item span as item
const item = document.querySelectorAll('.item span')
// identifies .item span.completed as itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

//function that goes through each of the elements in order identify the choosen element for it to be deleted
Array.from(deleteBtn).forEach((element)=>{
    // deleteItem function on deleteBtn click
    element.addEventListener('click', deleteItem)
})
//function that on click calls the function markComplete
Array.from(item).forEach((element)=>{
    //markComplete function on item click 
    element.addEventListener('click', markComplete)
})
//function that on click calls the function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    //markUncomplete function on itemCompleted click
    element.addEventListener('click', markUnComplete)
})
//function deleteItem()
async function deleteItem(){
//goes to up tp thiss' parentNode then down to childNodes first childs' innertext
    const itemText = this.parentNode.childNodes[1].innerText
    try{
//sends a delete req with itemText as the data
        const response = await fetch('deleteItem', {
            //identifies method, delete
            method: 'delete',
            //identifies content type, json
            headers: {'Content-Type': 'application/json'},
            //turns json into text
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
//identifies response.json() as data
        const data = await response.json()
//console log the data
        console.log(data)
//reloads the page
        location.reload()
//catch any errors that may occur
    }catch(err){
        console.log(err)
    }
}
//function markComplete
async function markComplete(){
//goes to up tp thiss' parentNode then down to childNodes first childs' innertext
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// sends a put req with itemText as the parse data
        const response = await fetch('markComplete', {
            //identifies method
            method: 'put',
            //identifies the content type, application/json
            headers: {'Content-Type': 'application/json'},
            //turns json into text
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
//identifies response.json() as data 
        const data = await response.json()
//logs data
        console.log(data)
//reloads page
        location.reload()
//catches error
    }catch(err){
//logs error
        console.log(err)
    }
}
//function markUnComplete
async function markUnComplete(){
//goes to up tp thiss' parentNode then down to childNodes first childs' innertext
    const itemText = this.parentNode.childNodes[1].innerText
    try{
//sends put request with itemText as the data
        const response = await fetch('markUnComplete', {
            //identifies the method, put
            method: 'put',
            //identifies the content as json
            headers: {'Content-Type': 'application/json'},
            //turns json into readable text
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //identifies response.json() as data 
        const data = await response.json()
        //logs data
        console.log(data)
        //reloads page
        location.reload()
//catches error
    }catch(err){
        //logs error
        console.log(err)
    }
}