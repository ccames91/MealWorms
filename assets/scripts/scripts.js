var userFormEl = document.querySelector("#user-form");
var receipeInputEl = document.querySelector("#RecipeSearch");
var receipeContainerEl = document.querySelector("#receipe-container");


var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchText = receipeInputEl.value.trim()

    if (!searchText || searchText=='') {
        receipeContainerEl.innerText='Enter a receipe search text'
        return
    }

    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + searchText)
        .then(res => {
         return res.json()
    })
    .then(data => {
        receipeContainerEl.innerHTML = ''

        if (data.meals) {
            for (let index = 0; index < data.meals.length; index++) {
                createRecipeCard(data.meals[index])
            }
        } else {
            receipeContainerEl.innerHTML = 'No recipes found for search text "' + searchText + '"'
        }
        
        console.log (data)
    });
}

//Create display element for present day weather details
var createRecipeCard = function (currentDayData) {
    // Create Card Div for current day weather content
    var cardEl = document.createElement("div");
    cardEl.classList = "card";
    // Create Card Header
    var cardHeaderEl = document.createElement("h3");
    cardHeaderEl.classList = "card-header";
    cardHeaderEl.textContent = currentDayData.strMeal;
    cardEl.appendChild(cardHeaderEl);
  
    // Create Card Body Div
    var cardBodyEl = document.createElement("div");
    cardBodyEl.classList = "card-body";
  
    var iconEl = document.createElement("img");
  
    iconEl.setAttribute("alt", "Recipe Thumb Nail");
    iconEl.setAttribute("src", currentDayData.strMealThumb);
    iconEl.setAttribute("width", 200);
  
    cardBodyEl.appendChild(iconEl);

    var cardDetails = document.createElement("p");
    cardDetails.textContent = currentDayData.strInstructions
    
    cardBodyEl.appendChild(cardDetails);
    cardEl.appendChild(cardBodyEl);

    receipeContainerEl.appendChild(cardEl);
  };

//form submit event listener.
userFormEl.addEventListener("submit", formSubmitHandler);