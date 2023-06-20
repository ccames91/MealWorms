var userFormEl = document.querySelector("#user-form");
var receipeInputEl = document.querySelector("#RecipeSearch");
var receipeContainerEl = document.querySelector("#receipe-container");

var historyContainerEl = document.querySelector("#history-buttons");

var ninjaApiKey = 'zhEVaooGdW491s6TW7TM1w==a7kkBpjGpLUfzlQm'


var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchText = receipeInputEl.value.trim()

    if (!searchText || searchText=='') {
        receipeContainerEl.innerText='Enter a receipe search text'
        return
    }
    receipeInputEl.value=''
   
    if (!recipeSearch[searchText]) {
        createHistoryButton(searchText, true);
        } else {
        for (const elIndex in historyContainerEl.children) {
            let buttonEl = historyContainerEl.children[elIndex];

            if ( buttonEl.classList && buttonEl.dataset.recipe === searchText) {
                buttonEl.classList.toggle("active");
            }
        }
    }

    recipeSearch[searchText] = searchText;
    localStorage.setItem("recipeSearchData", JSON.stringify(recipeSearch));

    getRecipeList(searchText);
}

var getRecipeList = function(searchText) {
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
    cardBodyEl.classList = "card-body card-content";

    var iconEl = document.createElement("img");
  
    iconEl.setAttribute("alt", "Recipe Thumb Nail");
    iconEl.setAttribute("src", currentDayData.strMealThumb);
    iconEl.setAttribute("width", 250);
  
    cardBodyEl.appendChild(iconEl);

    let ingredientLabel = document.createElement("h3");
    ingredientLabel.innerText = 'Ingredients'
    cardBodyEl.appendChild(ingredientLabel)

    let ingredientList = document.createElement("ul");
    
    for (let indexIng = 1; indexIng < 20 ; indexIng++) {
         
        let listItem = currentDayData['strIngredient' + indexIng]
        if (listItem) {
            let ingredientItem = document.createElement("li");
            ingredientItem.innerText = listItem + " " + currentDayData['strMeasure' + indexIng]
            ingredientList.appendChild(ingredientItem)            
        } else {
            break;
        }
    }
    
    cardBodyEl.appendChild(ingredientList)

    var cardDetails = document.createElement("p");
    cardDetails.textContent = currentDayData.strInstructions

    cardBodyEl.appendChild(cardDetails);
    addNutritionButton(cardBodyEl)
    cardEl.appendChild(cardBodyEl);

    receipeContainerEl.appendChild(cardEl);
};

var addNutritionContent = function (data, elem) {
    let header = document.createElement("h3");
    header.classList ='card-header'
    header.innerText ='Nutritional Facts'
    elem.appendChild(header)

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let ingredientList = document.createElement("ul");

        for (let j in element) {             
            let ingredientItem = document.createElement("li");
            let nutriType = j.substring (0, j.indexOf ('_'))
            if (j.indexOf ('_') <=0 ) {
                nutriType = j
            }
            let nutriMeasure = ''
            if (j.lastIndexOf('_') > 0) {
                nutriMeasure = j.substring(j.lastIndexOf('_')+1,j.length)
            }
            ingredientItem.innerText = nutriType.toUpperCase() + ' ' + element[j] + ' ' + nutriMeasure
            ingredientList.appendChild(ingredientItem)  
        }

        elem.appendChild(ingredientList)
        if (index < data.length - 1) {
            let hrElem = document.createElement('hr')
            elem.appendChild(hrElem)
        }
        
    }

}

var displayNutritionFact = function(event) {
    var recipeName = event.target.parentNode.parentNode.children[0].innerText

    fetch('https://api.api-ninjas.com/v1/nutrition?query=' + recipeName, {
        headers: { 'X-Api-Key': ninjaApiKey}
    })
    .then(res => {
        return res.json()
    })
    .then(data => {

        console.log (data)
        let nutDialogEle = document.getElementById("nutrition-dialog"); 
        nutDialogEle.innerHTML=''
        addNutritionContent (data, nutDialogEle)
        nutDialogEle.addEventListener('click', function(event){
            this.close()
        })
        nutDialogEle.showModal()
    });

}

//Function to display nutritional fact 
var addNutritionButton = function(parentElement) {
    let buttonEl = document.createElement("button");
    buttonEl.classList = "btn btn_width";
    buttonEl.innerText = "Click Here for Nutritional Facts "; 
    buttonEl.addEventListener("click", displayNutritionFact);
    parentElement.appendChild(buttonEl)
}

//Function to generate history button for each previous searched recipes
var createHistoryButton = function (recipeSearch, isActive) {
    let buttonEl = document.createElement("button");
    buttonEl.classList = "btn";
    buttonEl.setAttribute("data-recipe", recipeSearch);
    buttonEl.innerText = recipeSearch;
  
    buttonEl.addEventListener("click", buttonClickHandler);
  
    if (isActive) {
      buttonEl.classList.toggle("active");
    }
  
    historyContainerEl.appendChild(buttonEl);
  };
  
  var buttonClickHandler = function (event) {
    //disable active button
    for (const elIndex in historyContainerEl.children) {
      let buttonEl = historyContainerEl.children[elIndex];
      if (buttonEl.classList && buttonEl.classList.contains("active")) {
        buttonEl.classList.toggle("active");
      }
    }
    getRecipeList(event.target.dataset.recipe);
};
  
  //Look for localstorage for any previous search history and create action button for those recipes
  let recipeSearch = JSON.parse(localStorage.getItem("recipeSearchData"));
  historyContainerEl.innerHTML = "";
  
  if (recipeSearch) {
    for (const key in Object.keys(recipeSearch)) {
      let searchString = Object.keys(recipeSearch)[key];
      console.log(searchString);
      createHistoryButton(searchString);
    }
  } else {
    recipeSearch = {};
  }

//form submit event listener.
userFormEl.addEventListener("submit", formSubmitHandler);