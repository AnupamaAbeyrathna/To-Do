// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRjGCrNyJ7avr4Me9Bu_LZ95x7EX7v54U",
  authDomain: "to-do-list-5ea53.firebaseapp.com",
  projectId: "to-do-list-5ea53",
  storageBucket: "to-do-list-5ea53.appspot.com",
  messagingSenderId: "250234490135",
  appId: "1:250234490135:web:0fe8af70ba343790ea7b52",
  measurementId: "G-E2FGRW796C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Your JavaScript code
document.addEventListener('DOMContentLoaded', async () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  addTaskBtn.addEventListener('click', addTask);
  taskList.addEventListener('click', handleTaskClick);

  // Fetch and display tasks from Firestore
  async function fetchTasks() {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
      const taskData = doc.data();
      const li = document.createElement('li');
      li.textContent = taskData.text;
      li.dataset.id = doc.id;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add('deleteBtn');
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  fetchTasks();

  // Add a new task to Firestore
  async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: taskText,
        completed: false
      });
      const li = document.createElement('li');
      li.textContent = taskText;
      li.dataset.id = docRef.id;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add('deleteBtn');
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
      taskInput.value = '';
    }
  }

  // Handle task click events (complete or delete)
  async function handleTaskClick(event) {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('deleteBtn')) {
      const li = event.target.parentElement;
      const taskId = li.dataset.id;
      await deleteDoc(doc(db, "tasks", taskId));
      taskList.removeChild(li);
    } else if (event.target.tagName === 'LI') {
      const taskId = event.target.dataset.id;
      const isCompleted = !event.target.classList.toggle('completed');
      await updateDoc(doc(db, "tasks", taskId), {
        completed: isCompleted
      });
    }
  }
});
