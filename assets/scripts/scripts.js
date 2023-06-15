var userFormEl = document.querySelector("#user-form");


var formSubmitHandler = function (event) {
    event.preventDefault();
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=Pasta')
        .then(res => {
         return res.json()
    })
    .then(data => {
        const markup = '<p>s=Pasta</p>'

        document.querySelector('#recipe').innerHTML=markup
        console.log (data)
    });
}





//form submit event listener.
userFormEl.addEventListener("submit", formSubmitHandler);