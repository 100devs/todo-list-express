const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//We are defining specific variables to select the defined classes. These are essentially are pointers that look at all their respective attributes and say we are looking at these attriubtes in the DOM

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Since deleteBtn is a large selection of attributes, we make an array and use forEach to iterate to every single one and create an EventListener as a click and link it to a specifc function down below that will delete something 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Similarly, we create another array for each item and iterate. And create an EventListener and link it with markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Again we iterate over the array of itemCompleted and link it to the function of markUnComplete and use a click as the Event Listener

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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
//The first function we see is the DeleteItems and that is linked to the first array of EventListeners
    //We use an Async function and inside is a variable itemText, that looks for a specific location of parentNode. Childnode[1] and grab the text
        //Where we then use a try/catch
            //inside the try we fetch deleteItem which is the CRUD method of delete in our server.js and connects it and does the specific API task
            //Then we reload the webpage 


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
//The next function is another async function markComplete
    //We define a const variable itemText that locates the text inside the DOM
        //we use a try/catch
            //inside try: theres a fetch that gets the markComplete method from server.js that does some magic API stuff and updates something
            //we then reload the page 
        //Catch has a simple err log 

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
//the last function is a similar process. We fetch the markUnComplete from server.js and Update something and reload the page 