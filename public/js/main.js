const deleteBtn = document.querySelectorAll('.fa-trash') //class in ejs for fa.trash - dlt  a variable  all trsh icons are classified as a delete button // any queries // 
const item = document.querySelectorAll('.item span') //all the spans in the li are selected an classified as an item in ejs. all classes of item 
const itemCompleted = document.querySelectorAll('.item span.completed')
// variable of itemCompleted and every class item also with the class of completed is targeted by this selector
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// array from will create an array from the variable of delete button the each time the deletebtn is clicked with the event listenter. click > deleted item  / with a click and delete item 
//makes an array of every item in element is for each item in the array
//at page load, puts every item in in fa class trash . once clicked runs delete item. 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// for each each element in the item class. on click is marked markComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// for each element in the item completed class on click is marked unComplete

// 1-15 on document load they run and sit and wait, waiting for something to be done.. andthen we click something the asyncs are running when we click
async function deleteItem(){ // running the const from above 
    const itemText = this.parentNode.childNodes[1].innerText //parent node is unordered list . list is child node aand the inner text is what changes. targeting child node to change inner text 
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'}, // what type of file it gets in return json 
            body: JSON.stringify({ // getting object and turning into a json string
              'itemFromJS': itemText // item from server js line 48 in server js  itemFromJs is declared as a key itemText is declared above  key is itemText
            })
          })
        const data = await response.json()  
        console.log(data) // runs the info from when the Asynch is run 
        location.reload() // automatic refresh 

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {  //response contains an object > fetch declared within fucntion
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
            method: 'put', // post / get/ put/ delete- crud steps 
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