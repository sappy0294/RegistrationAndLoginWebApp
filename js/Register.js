document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("myform").addEventListener("click", function(event) {
        event.preventDefault();
        data();
    });
});

async function data() {
    console.log("Starting data function...");

     clearErrors();
    var firstname = document.getElementById("firstname");
    var lastname = document.getElementById("lastname");
    var middlename = document.getElementById("middlename");
    var phoneno = document.getElementById("phoneno");
    var gender = document.getElementById("dropdown");
    var address1 = document.getElementById("address1");
    var address2 = document.getElementById("address2");
    var city = document.getElementById("city");
    var state = document.getElementById("state");
    var country = document.getElementById("country");
    var emailaddress = document.getElementById("email");
    var password = document.getElementById("password").value;

    var firstnameError = document.getElementById("firstname-error");
    var lastnameError = document.getElementById("lastname-error");
    var middlenameError = document.getElementById("middlename-error");
    var genderError = document.getElementById("gender-error");
    var phonenoError = document.getElementById("phonenumber-error");
    var address1error = document.getElementById("address1-error");
    var address2error = document.getElementById("address2-error");
    var stateerror = document.getElementById("state-error");
    var cityerror = document.getElementById("city-error");
    var countryerror = document.getElementById("country-error");
    var emailerror = document.getElementById("email-error");
    var passworderror = document.getElementById("password-error");


    var isValid = true;

    if (!firstname.value.trim()) {
        showError(firstnameError, "First name is required");
        isValid = false;
    }
    else if (!isAlphabetic(firstname.value.trim())) {
        showError(firstnameError, "First name must contain only alphabetic characters");
        isValid = false;
    }

    if (!lastname.value.trim()) {
        showError(lastnameError, "Last name is required");
        isValid = false;
    }
    else if (!isAlphabetic(lastname.value.trim())) {
        showError(lastnameError, "Last name must contain only alphabetic characters");
        isValid = false;
    }

    if (middlename.value.trim()) {
        if (!isAlphabetic(middlename.value.trim())) {
            showError(middlenameError, "Middle name must contain only alphabetic characters");
            isValid = false;
        }
    }

    if (gender.value.trim() == "Select Gender") {
        showError(genderError, "Gender is required");
        isValid = false;
    }

    if (!phoneno.value.trim()) {
        showError(phonenoError, "Phone number is required");
        isValid = false;
    } else if (isNaN(phoneno.value.trim())) {
        showError(phonenoError, "Phone number must be numeric");
        isValid = false;
    }
    else if (phoneno.value.trim().length !== 10 ) {
        showError(phonenoError, "Phone number must be 10 digits only");
        isValid = false;
    }

    if(!address1.value.trim()){
        showError(address1error,"Address1 is required")
        isValid=false;
    }
    else if(!validateAddress(address1.value.trim())){
        showError(address1error,"Address1 must contain only numbers, alphabets, /, - and spaces")
        isValid=false;
    }

   if(!validateAddress(address2.value.trim())){
        showError(address2error,"Address2 must contain only numbers, alphabets, /, - and spaces")
        isValid=false;
    }

    if(!state.value.trim()){
        showError(stateerror,"State is required")
        isValid=false;
    }
    else if(state.value.trim().length>15){
        showError(stateerror,"State must contain only 15 characters")
        isValid=false;
    }

    if(!city.value.trim()){
        showError(cityerror,"City is required")
        isValid=false;
    }
    else if(city.value.trim().length>15){
            showError(cityerror,"City must contain only 15 characters")
            isValid=false;
    }

    if(!country.value.trim()){
        showError(countryerror,"Country is required")
        isValid=false;
    }
    else if(country.value.trim().length>15){
        showError(countryerror,"Country must contain only 15 characters")
        isValid=false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailaddress.value.trim()){
            showError(emailerror,"Email address is required")
            isValid=false;
    }else if(!emailRegex.test(emailaddress.value)){
            showError(emailerror,"Please enter email address with valid format")
            isValid=false;
    }
        
    if(!password.trim()){
            showError(passworderror,"Password is required")
            isValid=false;
    }else if(password.trim().length>8){
            showError(passworderror,"Password must contain only 8 characters")
            isValid=false;
    }

    if (!isValid) {
            return false;
    } else {

                studentDetails = {
                "firstName": firstname.value,
                "lastName": lastname.value,
                "middleName": middlename.value,
                "gender": gender.value,
                "phoneNumber": phoneno.value,
                "address1": address1.value,
                "address2": address2.value,
                "city": city.value,
                "state": state.value,
                "country": country.value,
                "emailAddress": emailaddress.value,
                "password": password
            }
            try {
                if(await updateStudentDetails(studentDetails)){
                alert("Registration completed successfully!");
                document.getElementById("myform").reset();
                return true;
            } 
        }catch (error) {
                alert("Registration failed due to internal failure. Please try after sometime...!");
                console.error("An error occurred:", error.message);
                return false;
            }
        }
}

function isAlphabetic(input) {
    return /^[a-zA-Z]+$/.test(input);
}
function validateAddress(address) {
    var regex = /^[a-zA-Z0-9\/\- ]*$/;
    return regex.test(address);
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

async function updateStudentDetails(studentDetails) {
    try {
        console.log("called with the input: ", studentDetails);
        const response = await fetch('http://localhost:8080/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentDetails)
        });
        if (response.status === 400) {
            alert('User already registered with this email address');
            document.getElementById("myform").reset();
            return false;
        }

        console.log("Server response status:", response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if(response.ok){
            return true;
        }
        const responseData = await response.json();
        console.log("Server response data:", responseData);
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


