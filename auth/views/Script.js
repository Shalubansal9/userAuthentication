//signup
const register = document.querySelector(".register");
const userName = document.getElementById("inputName");
const userPassword = document.getElementById("inputPass");
const cnfrmPassword = document.getElementById("inputCnfrmPass");
const userEmail = document.getElementById("inputEmail");
const userImage = document.getElementById("img");

//login
const loginBtn = document.querySelector(".submit");
const loginName = document.getElementById("loginname");
const loginPass = document.getElementById("loginpass");

register.addEventListener("click", function (e) {
    e.preventDefault();
    const username = userName.value;
    const password = userPassword.value;
    const cnfrmpassword = cnfrmPassword.value;
    const email = userEmail.value;
    const image = userImage.value;

    if (password !== cnfrmpassword) {
        alert("Passwords do not match");
        return;
    }
    if (!username || !password || !email) {                    //if input is empty
        alert("All the details are required");
        return;
    }
    const userDetails = {
        username,
        password,
        email,
        "imagePath": image,
    }

    const formData = new FormData();
    formData.append('username', userDetails.username);
    formData.append('password', userDetails.password);
    formData.append('email', userDetails.email);
    formData.append('image', document.querySelector('#img').files[0]);

    userName.value = "";
    userPassword.value = "";
    cnfrmPassword.value = "";
    userEmail.value = "";
    userImage.value="";

    fetch("/signup", {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json",   //x-www-form-urlencoded
        // },

        // body: JSON.stringify(userDetails),     //object to json
        body: formData,

    }).then(function (response) {             //promise to handle the response from the server
        if (response.status === 200) {      //successfull response
            //console.log(userDetails);
            alert("Signup successful. Please login.");
        }
        else if (response.status === 500) {
            alert("User already Exist, Please Login to Continue..");
        }
        else {
            alert("something wrong");
        }
    }).catch(function (error) {
        alert("Something went wrong.");
    });
});

loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const loginname = loginName.value;
    const loginpass = loginPass.value;
    //console.log(loginname, loginpass);

    const loginDetails = {
        loginname,
        loginpass,
    }

    loginName.value = "";
    loginPass.value = "";

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),     //object to json
    }).then(function (response) {             //promise to handle the response from the server
        if (response.redirected) {      //successfull response
            console.log("login successfull");
            //return response.json();
        }
        else if (response.status === 401) {        //401 is unauthorized
            response.json().then((data) => {
                if (data.error === "Incorrect password.") {
                    alert("Incorrect password. Please try again.");
                } else {
                    alert("User not found. Please sign up.");
                }
            });
        }
        else {
            alert("something wrong");
        }
    }).catch(function (error) {
        alert("Something went wrong.");
    });
});







