const deleteBtn = document.querySelectorAll('.fa-trash') //select all elements of class fa-trash and put in deletebtn variable
const item = document.querySelectorAll('.item span') //select all span elements with a parent with class of item
const itemCompleted = document.querySelectorAll('.item span.completed')//select all span elements with class of completed with a parent of class of item

Array.from(deleteBtn).forEach((element)=>{//create array from deleteBtn variable and iterate through each element
    element.addEventListener('click', deleteItem)//add event listener to element, on each click event run deleteItem function
})//end of foreach declaration

Array.from(item).forEach((element)=>{//create array from item variable and iterate through each element
    element.addEventListener('click', markComplete)//add click event listener to each element and run markComplete function
})//end of for each declaration

Array.from(itemCompleted).forEach((element)=>{ // create array from itemCompleted variable and iterate through each element
    element.addEventListener('click', markUnComplete) // add click event to each element that runs markUncomplete function
})

async function deleteItem(){//declare asynchronous function named deleteItem()
    const itemText = this.parentNode.childNodes[1].innerText//set constant variable with the innertext of the parent of current element at the second childs[1] inner text
    try{//start of try block
        const response = await fetch('deleteItem', { //response variable will hold result of fetch to delete route
            method: 'delete', // method to use with request
            headers: {'Content-Type': 'application/json'}, // header for request will contain json format data
            body: JSON.stringify({ //add json data format object to body of request
              'itemFromJS': itemText // property inside of body will be itemFromJS and will contain itemText
            })// end of fetch options
          })//end of fetch 
        const data = await response.json() // wait for response from fetch. parse the json into an object and store it in data variable
        console.log(data)//log data to console
        location.reload()//reload current url in browser

    }catch(err){//catch any error that may occur inside the try block
        console.log(err) // log to console any errors
    }
}

async function markComplete(){ // asynchronous function declaration named markComplete
    const itemText = this.parentNode.childNodes[1].innerText//create constant variable that holds the text from the second child of the current elements parent
    try{//try block started
        const response = await fetch('markComplete', {//await fetch and return results into constant variable
            method: 'put',//label request at put
            headers: {'Content-Type': 'application/json'},//include header for content type of json format stating type of data in request
            body: JSON.stringify({ // inlcude json format string into body of request
                'itemFromJS': itemText // insert prperty 'itemFromJS' into body containing itemText variable
            })//end of fetch options
          })//end of fetch 
        const data = await response.json() // response from fetch is parsed for JSON and returned as object and put inside of data variable
        console.log(data) // log data to console
        location.reload()//refresh page locally 

    }catch(err){//catch any err from try block
        console.log(err) // log to console any errors
    }//end of catch block
}//end of markcomplete function declaration

async function markUnComplete(){//async function declaration
    const itemText = this.parentNode.childNodes[1].innerText//create constant variable that holds the text from the second child of the current elements parent
    try{//start try block
        const response = await fetch('markUnComplete', {//await fetch and return results to constant variable
            method: 'put',// set method option for fetch
            headers: {'Content-Type': 'application/json'},//set headers option for fetch using content type of JSON format in request
            body: JSON.stringify({//define body to contain JSON format string object
                'itemFromJS': itemText//itemFromJS contains itemText in json format string inside of body object
            })//end of fetch options
          })//end of fetch
        const data = await response.json()//await response to  be parsed to JSON and return to data variable
        console.log(data) // log data to console
        location.reload()//refresh page 

    }catch(err){//catch any errors in try block
        console.log(err)//log errors to console
    }//end of catch block
}//end of markUnComplete function declaration