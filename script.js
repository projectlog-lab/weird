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

// References to the main posts and the comment lists
const postsRef = ref(database, "posts");
const postsContainer = document.getElementById("postsContainer");

// Get the elements for creating a new post
const postInput = document.getElementById("postInput");
const postBtn = document.getElementById("postBtn");

// Event listener for creating a new post
postBtn.addEventListener("click", () => {
  const postContent = postInput.value.trim();
  if (postContent === "") return;

  // Push the new post to the database
  push(postsRef, {
    content: postContent,
    timestamp: new Date().toISOString()
  });

  postInput.value = "";
});

// Listener to display new posts and their comment sections
onChildAdded(postsRef, (postSnapshot) => {
  const postKey = postSnapshot.key;
  const postData = postSnapshot.val();

  // Create the HTML for the new post
  const postElement = document.createElement("div");
  postElement.className = "post";
  postElement.setAttribute("data-post-id", postKey);
  postElement.innerHTML = `
    <p>${postData.content}</p>
    <div class="comment-section">
      <h4>Comments</h4>
      <input type="text" class="commentInput" placeholder="Say anything anonymously...">
      <button class="submitBtn">Post</button>
      <div class="commentList"></div>
    </div>
  `;

  // Prepend the new post to the top of the container
  postsContainer.prepend(postElement);

  // Set up the comment section for this specific post
  const commentInput = postElement.querySelector(".commentInput");
  const submitBtn = postElement.querySelector(".submitBtn");
  const commentList = postElement.querySelector(".commentList");

  const commentsRef = ref(database, `posts/${postKey}/comments`);

  // Event listener for posting a comment on this specific post
  submitBtn.addEventListener("click", () => {
    const commentContent = commentInput.value.trim();
    if (commentContent === "") return;
    push(commentsRef, {
      text: commentContent,
      timestamp: new Date().toISOString()
    });
    commentInput.value = "";
  });

  // Listener to display comments for this specific post
  onChildAdded(commentsRef, (commentSnapshot) => {
    const commentData = commentSnapshot.val();
    const commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.innerText = commentData.text;
    commentList.appendChild(commentElement);
  });
});