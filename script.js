//should display their name (in a header), their title(s) in a p tag under the name, and finally the name of their spouse
let nameInput = document.querySelector('[name=nameInput]')
let aliasInput = document.querySelector('[name=aliasInput]')
let housesInput = document.querySelector('[name=housesInput]')
let searchBtn = document.querySelector('[name=searchBtn]')
let charContainer = document.getElementById('charContainer')
let favChars = [];



// var scrape = require('website-scraper');
// var options = {
//   urls: ['http://nodejs.org/'],
//   directory: './',
// };
//
// // with promise
// scrape(options).then((result) => {
//     console.log(result)
// }).catch((err) => {
//     /* some code here */
// });





searchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  charContainer.innerHTML = '';
  for (let k = 1; k <= 214; k++) {
    axios.get("https://www.anapioficeandfire.com/api/characters?page=" + k)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {

          if(aliasInput.value.length != 0 && nameInput.value.length != 0){
            if((search(response.data[i].aliases[0].toUpperCase(), aliasInput.value.toUpperCase())) && (search(response.data[i].name.toUpperCase(), nameInput.value.toUpperCase()))){
              getBasicInfo(response, i);
            }
          }else{
            if((search(response.data[i].aliases[0].toUpperCase(), aliasInput.value.toUpperCase())) && aliasInput.value.length != 0){
              getBasicInfo(response, i)
            }
            else if((search(response.data[i].name.toUpperCase(), nameInput.value.toUpperCase())) && nameInput.value.length != 0){
              getBasicInfo(response, i)
            }
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      })
  }
})

function getBasicInfo(response, i){
  let alias;
  let row = document.createElement('div');
  let col = document.createElement('div');
  row.appendChild(col)
  row.className += ' row';
  col.className += ' col-md-4'
  col.style.padding = "0"
  col.style.margin = "15px 0"
  col.style.borderRadius = "20px"
  col.style.backgroundColor = "rgba(20, 20, 20, 0.8)"
  col.innerHTML += `
  <h2>${response.data[i].name}</h2>
  `
  for (let n = 0; n < response.data[i].aliases.length; n++) {
    alias = response.data[i].aliases[n];
    let p = document.createElement('p')
    p.style.fontWeight = '200';
    p.innerHTML += alias;
    col.appendChild(p)
  }
  axios.get(response.data[i].spouse)
    .then(spouseRes => {
      var spouseName;
      spouseName = spouseRes.data.name;
      if (spouseName !== undefined) {
        let p = document.createElement('p')
        p.style.fontWeight = '500'
        p.innerHTML += `
        <p><span>Spouses: </span>${spouseName}</p>
      `
        col.appendChild(p)
      }
    })
  axios.get(response.data[i].allegiances)
  .then(housesRes => {
    var house = housesRes.data.name;
    var region = housesRes.data.region;
    if (house !== undefined || region !== undefined) {
      let p = document.createElement('p')
      p.style.fontWeight = '500'
      p.innerHTML += `
      <p><span>Origin: </span>${region} / ${house}</p>
    `
      col.appendChild(p)
    }
  })
  charContainer.appendChild(col)
}

function search(data, input) {
  let acc = ''
  let testArr = data.split(' ');
  let storeStr = input.toLowerCase();
  let baseArr = testArr.join('  ').split('  ')
  for(let i=0; i<testArr.length; i++) {
    input = storeStr
    for(let j=0; j<=input.length; j++) {
      if (input.length === 0) {
        acc += baseArr[i]+' '
      } else if (testArr[i].toLowerCase().match(input[j])) {
        testArr[i] = testArr[i].slice(testArr[i].toLowerCase().match(input[j]).index+1, testArr[i].length)
        input = input.replace(input[j], '')
        j = -1
      } else {
        j = input.length
      }
    }
  }
  return acc.trim()
}


// Below the characters display 3 houses. It should display the house name, region, current leader, and heir.
//
// House documentation: https://anapioficeandfire.com/Documentation#houses
//
// Stretch:
//
// Make the name of the leader/heir clickable. When a user clicks the name it should add them to the character list above.
// Allow the user to search for a house by id.
// Use the same input field for house/character search and have a drop down to determine if you're searching for a house or character.
// Style it using bootstrap.
