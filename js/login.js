document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("myform").addEventListener("click", async function(event) {
        event.preventDefault();
        data();
    });
});

async function data() {
    console.log("Starting data function...");
    var emailaddress = document.getElementById("email");
    var password = document.getElementById("password");

    var emailerror = document.getElementById("email-error");
    var passworderror = document.getElementById("password-error");

    var isValid = true;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    clearErrors();
    if(!emailaddress.value.trim()){
            showError(emailerror,"Email address is required")
            isValid=false;
    }else if(!emailRegex.test(emailaddress.value)){
            showError(emailerror,"Please enter email address with valid format")
            isValid=false;
    }
    if(!password.value.trim()){
        showError(passworderror,"Password is required")
        isValid=false;
    }else if(password.value.trim().length>8){
        showError(passworderror,"Password must contain only 8 characters")
        isValid=false;
    }
if (!isValid) {
    return false;
} else {

    const loginDetails = {
        "emailAddress": emailaddress.value,
        "password": password.value
    }
try {
    
    const loginSuccess = await loginUser(loginDetails);
    if (loginSuccess) {
        alert("Login successful!");
    } else {
        alert("Login not successfully. Please check the credentials or Register");
    }
    return loginSuccess;
} catch (error) {
    alert("Login failed due to internal failure. Please try after sometime...!");
    console.error("An error occurred:", error.message);
    return false;
}

}
function showError(element, message) {
    element.innerHTML = message;
    element.style.display = "block";
    element.previousElementSibling.classList.add("error");
    }

function clearErrors() {
    var errorMessages = document.querySelectorAll(".error-message");
    var fields = document.querySelectorAll(".names-field, #dropdown, #phoneno");

    errorMessages.forEach(function (error) {
        error.innerHTML = "";
        error.style.display = "none";
    });

    fields.forEach(function (field) {
        field.classList.remove("error");
    });

}
async function loginUser(loginDetails) {
    try {
        console.log("called with the input: ", loginDetails);
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails) 
        });

        console.log("Server response status:", response.status);
        const responseData = await response.json();
        console.log("Server response data:", responseData);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
}
