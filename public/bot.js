var botButton = document.getElementById("botButton");
var userInput = document.getElementById("userInput");
botButton.onclick = () =>
{
    console.log(userInput.value);
    fetch("/botFetch",{method:"POST", body:userInput.value}).then((response) =>
    {
        return response.text();
    }).then((txt) =>{
        console.log("I received a response : " + txt);
    });
}
