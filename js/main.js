let searchBtn = document.getElementById("search-btn");
let resultImg = document.getElementById("result-img");
let resultInfo = document.getElementById("result-info");
let searchCon = document.querySelector(".search-container");
let resultCon = document.querySelector(".container-result");
let drinksCon = document.querySelector(".all-drinks");
let intro = document.getElementById("intro");
let drinkID;

searchBtn.addEventListener("click", getID);

function getID() {
  intro.classList.add("hidden");
  let userInp = document.getElementById("user-inp").value;
  let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";

  // Clear existing error messages
  let errorMsg = document.querySelector(".msg");
  if (errorMsg) {
    errorMsg.remove();
  }

  if (userInp.length == 0) {
    // Display error message
    let errorMsg = document.createElement("h3");
    errorMsg.classList.add("msg");
    errorMsg.textContent = "No results found. Please enter a valid search term";
    searchCon.appendChild(errorMsg);
  } else {
    fetch(url + userInp)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid search term');
        }
        return res.json();
      })
      .then((data) => {
        drinkID = data.drinks[0].idDrink;
        getDrinkInfo(drinkID);
        displayAllDrinks(data.drinks)
      })
      .catch(err => {
        console.log(`Error: ${err.message}`);
        // Clear existing results
        resultImg.innerHTML = "";
        resultInfo.innerHTML = "";
        drinksCon.innerHTML = "";
        // Display error message
        let errorMsg = document.createElement("h3");
        errorMsg.classList.add("msg");
        errorMsg.textContent = "No results found. Please enter a valid search term";
        searchCon.appendChild(errorMsg);
      });
  }
}

// function to display drink info
function getDrinkInfo(id) {
  let url = "https://thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let myDrink = data.drinks[0];
        let count = 1;
        let ingredients = [];
        for (let item in myDrink) {
          let ingredient = "";
          let measure = "";
          if (item.startsWith("strIngredient") && myDrink[item]) {
            ingredient = myDrink[item];
            if (myDrink[`strMeasure` + count]) {
              measure = myDrink[`strMeasure` + count];
            } else {
              measure = "";
            }
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }

        // page render for drink info
        resultImg.innerHTML = `
        <img src=${myDrink.strDrinkThumb}>
        <p class="glass"><i class="fa-solid fa-martini-glass"></i>${myDrink.strGlass}</p>
        `;
        resultInfo.innerHTML = `
        <h2 class="drink-name">${myDrink.strDrink}</h2>
        <p class="instructions">${myDrink.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul class="ingredients"></ul>
        `;
        let ingredientsCnt = document.querySelector(".ingredients");
        ingredients.forEach(item => {
          let listItem = document.createElement("li");
          listItem.innerText = item;
          ingredientsCnt.appendChild(listItem);
        })
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    })
}

// function to display all similar drinks
function displayAllDrinks(drinks) {
  // clear drinksCon
  drinksCon.innerHTML = '';

  if (drinks.length > 1) {
    drinksCon.innerHTML = `
    <div class="all-drinks-links"></div>
    `;
    let drinksLinks = document.querySelector(".all-drinks-links")
    drinks.forEach(drink => {
      let drinkLink = document.createElement("a");
      drinkLink.href = "#";
      let drinkImg = document.createElement("img");
      drinkImg.src = drink.strDrinkThumb;
      drinkLink.appendChild(drinkImg);
      drinksLinks.appendChild(drinkLink);
      drinkLink.addEventListener("click", () => {
        getDrinkInfo(drink.idDrink);
      })
    });
  }
}