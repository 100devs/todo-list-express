//create variable assigning to selection all with elements class of fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
//create var assigning to selection of all span inside parent with item class
const item = document.querySelectorAll(".item span");
//create var assigning to selection of all span with completed class that are
//inside parent with item class
const itemCompleted = document.querySelectorAll(".item span.completed");
//create of array of deletebtn and starting loop
Array.from(deleteBtn).forEach((element) => {
  //add event listener to current item waits for a click then calls a
  //function called deletebtn
  element.addEventListener("click", deleteItem);
  //close loop
});
//create array and starting loop
Array.from(item).forEach((element) => {
  //add event listener to current item waits for a click then calls a
  //function called markcomplete
  element.addEventListener("click", markComplete);
  //close loop
});
//create array and starting loop
Array.from(itemCompleted).forEach((element) => {
  //add event listener to only completed item waits for a click then calls a
  //function called markUncomplete
  element.addEventListener("click", markUnComplete);
  //close loop
});

//declare async function
async function deleteItem() {
  //create var and assigning innertext of list span to it
  const itemText = this.parentNode.childNodes[1].innerText;
  //starts try block
  try {
    //creates res const waits on fetch to get data from result of deleteItem route
    const response = await fetch("deleteItem", {
      //sets CRUD method for route
      method: "delete",
      //specifies type of content to expect-JSON
      headers: { "Content-Type": "application/json" },
      //declares msg content being passed, and stringifes it
      body: JSON.stringify({
        //sets content of body to inner text of list item and names it 'itemFromJS'
        itemFromJS: itemText,
        //closes body
      }),
      //closes obj
    });
    //waits on JSON from res to be converted
    const data = await response.json();
    //logs data to console
    console.log(data);
    //reloads page to update what is dispplayed
    location.reload();
    //if err, pass err to catch block
  } catch (err) {
    //log err
    console.log(err);
  } //closes catch block
} //end function

//declare async function
async function markComplete() {
  //looks inside list item and grabs inner text within list
  const itemText = this.parentNode.childNodes[1].innerText;
  //starts try block to do something
  try {
    //creates res const waits on fetch to get data from result of markComplete route
    const response = await fetch("markComplete", {
      //sets CRUD method to update route
      method: "put",
      //specifies type of content to expect-JSON
      headers: { "Content-Type": "application/json" },
      //declares msg content being passed, and stringifes it
      body: JSON.stringify({
        //sets content of body to inner text of list item and names it 'itemFromJS'
        itemFromJS: itemText,
        //closes body
      }),
      //closes ojb
    });
    //waits on JSON from res to be converted
    const data = await response.json();
    //logs to console
    console.log(data);
    //reloads page to update what is dispplayed
    location.reload();
    //if err, pass err to catch block
  } catch (err) {
    //logs err
    console.log(err);
  } //closes catch block
} //end of function

//declare async function
async function markUnComplete() {
  //looks inside list item and grabs inner text within list
  const itemText = this.parentNode.childNodes[1].innerText;
  //starts try block to do something
  try {
    //creates res const waits on fetch to get data from result of markUnComplete route
    const response = await fetch("markUnComplete", {
      //sets CRUD method to update route
      method: "put",
      //specifies type of content to expect-JSON
      headers: { "Content-Type": "application/json" },
      //declares msg content being passed, and stringifes it
      body: JSON.stringify({
        //sets content of body to inner text of list item and names it 'itemFromJS'
        itemFromJS: itemText,
      }), //closes body
    }); //closes obj
    //waits on JSON from res to be converted
    const data = await response.json();
    //logs data
    console.log(data);
    //reloads page to update what is dispplayed
    location.reload();
    //if err, pass err to catch block
  } catch (err) {
    //logs err
    console.log(err);
  }
}
