const deleteBtn = document.querySelectorAll('.fa-trash') // declares a variable and assigns it to a selection of all elements with that class
const item = document.querySelectorAll('.item span')// declares a variable and assigns it to a selection of span tags inside of a parent of that class
const itemCompleted = document.querySelectorAll('.item span.completed') // declares a variable and assigns it to a selection of span a class of completed isnides of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{  //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // event listener added, listens to click then runds function with that name
})

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)// event listener added, listens to click then runds function with that name
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)// event listener added, listens to click then runds function with that name
})

async function deleteItem(){ //async function declared
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item to grab the inner text within the list span
    try{ //try block started
        const response = await fetch('deleteItem', {  // creates variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',  //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specfies type of content expected which will be json
            body: JSON.stringify({  //makes json a string
              'itemFromJS': itemText  //content of body to the inner text of the list item and naming it this.
            })
          })
        const data = await response.json() //waiting on json from the response to be converted
        console.log(data) //console logs results
        location.reload() //reloads page to update what is displayed

    }catch(err){  //catches error 
        console.log(err) //logs error
    }
}

async function markComplete(){//async function declared
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item to grab the inner text within the list list
    try{ //try block started
        const response = await fetch('markComplete', { // creates variable that waits on a fetch to get data from the result of the markcomplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specfies type of content expected which will be json
            body: JSON.stringify({  //makes json a string
                'itemFromJS': itemText//content of body to the inner text of the list item and naming it this.
            })
          })
        const data = await response.json() //waiting on json from the response to be converted
        console.log(data) //console logs results
        location.reload() //reloads page to update what is displayed

    }catch(err){//catches error 
        console.log(err)//logs error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item to grab the inner text within the list span
    try{//try block started
        const response = await fetch('markUnComplete', {// creates variable that waits on a fetch to get data from the result of the markuncomplete route
            method: 'put',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specfies type of content expected which will be json
            body: JSON.stringify({//makes json a string
                'itemFromJS': itemText//content of body to the inner text of the list item and naming it this.
            })
          })
        const data = await response.json()//waiting on json from the response to be converted
        console.log(data)//console logs results
        location.reload()//reloads page to update what is displayed


    }catch(err){//catches error
        console.log(err)//logs error
    }
}