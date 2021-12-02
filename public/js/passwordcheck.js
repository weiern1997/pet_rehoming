var myInput = document.getElementById("psw");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

var cfmInput = document.getElementById("cfm_psw");
var match = document.getElementById("match");

myInput.onfocus = function () {
    document.getElementById("pw_message").style.display = "block";
}
// When the user clicks outside of the password field, hide the message box
myInput.onblur = function () {
    document.getElementById("pw_message").style.display = "none";
}

cfmInput.onfocus = function () {
    document.getElementById("cfm_message").style.display = "block";
}
// When the user clicks outside of the password field, hide the message box
cfmInput.onblur = function () {
    document.getElementById("cfm_message").style.display = "none";
}

cfmInput.onkeyup = function () {
    var firstpassword = document.f1.psw.value;
    var secondpassword = document.f1.cfm_psw.value;
    if (firstpassword == secondpassword) {
        match.classList.remove("invalid");
        match.classList.add("valid");
    } else {
        match.classList.remove("valid");
        match.classList.add("invalid");
    }
}
myInput.onkeyup = function () {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}
function matchpass() {
    var firstpassword = document.psw.value;
    var secondpassword = document.cfm_psw.value;
    console.log(firstpassword, secondpassword)
    if (firstpassword == secondpassword) {
        return true;
    }
    else {
        return false;
    }
}  