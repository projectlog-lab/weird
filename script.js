import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3VvkO0SXWMUZo_Fb66fmjY7sfiIe2h9A",
  authDomain: "hate-c0efd.firebaseapp.com",
  databaseURL: "https://hate-c0efd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hate-c0efd",
  storageBucket: "hate-c0efd.firebasestorage.app",
  messagingSenderId: "817423625776",
  appId: "1:817423625776:web:a4e4b00b99d549522107f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const commentRef = ref(database, "comments");

// Submit a new comment
document.getElementById("submitBtn").addEventListener("click", () => {
  const input = document.getElementById("commentInput");
  const comment = input.value.trim();
  if (comment === "") return;

  push(commentRef, {
    text: comment,
    time: new Date().toISOString()
  });

  input.value = "";
});

// Display new comments
const commentList = document.getElementById("commentList");

onChildAdded(commentRef, (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "comment";
  div.innerText = data.text;
  commentList.prepend(div); // newest on top
});
