function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


function injectHTML(list) {
  console.log('fired injectHTML')
  const target= document.querySelector('#restaurant_list');
  target.innerHTML='';
  list.forEach((item)=> {
    const str=`<li>${item.name}</li>`;
    target.innerHTML+=str
  })
}
  
/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item)=>{
    const lowerCaseName= item.name.toLowerCase();
    const lowerCaseQuery= query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery)
  })
 
}

function cutRestaurantList(list){
  console.log('fired cut list');
  const range=[...Array(15).keys()];
  return (newArray= range.map((item)=>{
    const index= getRandomInt(0, list.length -1);
    return list[index]
  }));
}



async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton=document.querySelector('#filter_button');
  const loadDataButton= document.querySelector('#data_load');
  const generateListButton= document.querySelector('#generate');
  // Add a querySelector that targets your filter button here

  const loadAnimation=document.querySelector('#data_load_animation');
  loadAnimation.style.display='none';
  let currentList = []; // this is "scoped" to the main event function
  
  /* We  need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    console.log('Loading data'); 
    loadAnimation.style.display='inline-block';

    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList=await results.json();
    loadAnimation.style.display='none'
    console.table(currentList);
    
  
    });
  
    filterButton.addEventListener('click', (event)=>{
      console.log('clicked FilterButton');
  
      const formData= new FormData(mainForm);
      const formProps=Object.fromEntries(formData);
  
      console.log(formProps);
      const newList=filterList(currentList, formProps.resto)
  
      console.log(newList);
      injectHTML(newList);
    })
  
  
  generateListButton.addEventListener('click',(event)=>{
    console.log('generate new list');
    loadAnimation.style.display='inline-block';

    const restrauntsList= cutRestaurantList(currentList);
    loadAnimation.style.display='none'
    console.table(restrauntsList);
    injectHTML(restrauntsList);


  })
}


  /*
    Now that you HAVE a list loaded, write an event listener set to your filter button
    it should use the 'new FormData(target-form)' method to read the contents of your main form
    and the Object.fromEntries() method to convert that data to an object we can work with

    When you have the contents of the form, use the placeholder at line 7
    to write a list filter

    Fire it here and filter for the word "pizza"
    you should get approximately 46 results
  */


/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
