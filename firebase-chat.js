// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

(function () {
  // TODO: replace this with your own firebase config object after creating app in your firebase console
  // Your web app's Firebase configuration
  // const firebaseConfig = {
  //   ...
  // };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize realtime database
  const database = getDatabase(app);

  //Initialize firebase authentication
  const auth = getAuth(app);

  // get elements
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const login = document.getElementById("login");
  const signup = document.getElementById("signup");
  const logout = document.getElementById("logout");
  const message = document.getElementById("message");
  const write = document.getElementById("write");
  const read = document.getElementById("read");
  const status = document.getElementById("status");
  const userNameDisplay = document.getElementById("name-display"); // element that can show the current user's email
  const chat = document.getElementById("chat-box");
  let currentUserEmail = ""; // variable to store the current user's email

  // write
  write.addEventListener("click", (e) => {
    // id
    const id = new Date().getTime();

    //write to database
    set(ref(database, "messages/" + id), {
      message: message.value,
      sender: currentUserEmail,
    });
    message.value = "";
  });

  // read
  read.addEventListener("click", (e) => {
    status.innerHTML = "";
    chat.innerHTML = "";
    handleRead();
  });

  // TODO: use this provided messagesRef to listen for updates and update the chat div on any update, not just when the 'Update Chat' button is clicked
  const messages = ref(database, "messages/");
  onValue(messages, (snapshop) => {
    status.innerHTML = "";
    chat.innerHTML = "";
    const data = snapshop.val();
    const keys = Object.keys(data);

    keys.forEach((key) => {
      console.log(data[key]);
      chat.innerHTML +=
        (data[key]["sender"] || "") +
        "   :   " +
        data[key].message +
        "<br><br>";
    });
  });

  function handleRead() {
    const messages = ref(database, "messages/");

    onValue(messages, (snapshop) => {
      const data = snapshop.val();
      const keys = Object.keys(data);

      keys.forEach((key) => {
        console.log(data[key]);
        chat.innerHTML +=
          (data[key]["sender"] || "") +
          "   :   " +
          data[key].message +
          "<br><br>";
      });
    });
  }

  // TODO: in this function you should set the userNameDisplay.innerHTML to the passed in userEmail as well as updating the currentUserEmail variable to that same value
  function updateCurrentUser(userEmail) {
    currentUserEmail = userEmail;
    userNameDisplay.innerHTML = userEmail;
  }

  // login
  login.addEventListener("click", (e) => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        //Signed in
        const user = userCredential.user;
        console.log("User Login Response: ", user);
        logout.style.display = "inline";
        login.style.display = "none";
        signup.style.display = "none";
        write.style.display = "inline";
        updateCurrentUser(user.email);
      })
      .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  });

  // signup
  signup.addEventListener("click", (e) => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User Signup + Login Response: ", user);
        logout.style.display = "inline";
        login.style.display = "none";
        signup.style.display = "none";
        write.style.display = "inline";
        updateCurrentUser(user.email);
      })
      .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  });

  // logout
  logout.addEventListener("click", (e) => {
    signOut(auth)
      .then((resp) => {
        console.log("Logout Response: ", resp);
        chat.innerHTML = "";
        email.value = "";
        password.value = "";
        logout.style.display = "none";
        login.style.display = "inline";
        signup.style.display = "inline";
        write.style.display = "none";
        updateCurrentUser("");
      })
      .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  });
})();
