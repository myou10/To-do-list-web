const firebaseConfig = {
    apiKey: "AIzaSyD0z6yu2gX3EPASLH8zZisB0qTUn32hFk0",
    authDomain: "todo-app-d9701.firebaseapp.com",
    databaseURL: "https://todo-app-d9701-default-rtdb.firebaseio.com",
    projectId: "todo-app-d9701",
    storageBucket: "todo-app-d9701.firebasestorage.app",
    messagingSenderId: "950041619607"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  let userId = null;
  
  function dangNhap() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  function dangXuat() {
    auth.signOut();
  }
  
  auth.onAuthStateChanged(user => {
    if (user) {
      userId = user.uid;
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('todo-screen').style.display = 'block';
      document.getElementById('ten-nguoi-dung').textContent = 'Xin chào, ' + user.displayName + '!';
      loadTasks();
    } else {
      userId = null;
      document.getElementById('login-screen').style.display = 'block';
      document.getElementById('todo-screen').style.display = 'none';
      document.getElementById('list').innerHTML = '';
    }
  });
  
  function loadTasks() {
    db.ref('users/' + userId + '/tasks').on('value', snapshot => {
      const tasks = [];
      snapshot.forEach(child => {
        tasks.push({ id: child.key, ...child.val() });
      });
      render(tasks);
    });
  }
  
  function addTask() {
    const inp = document.getElementById('inp');
    const text = inp.value.trim();
    if (text === '') return;
    db.ref('users/' + userId + '/tasks').push({
      text: text,
      done: false,
      createdAt: Date.now()
    });
    inp.value = '';
  }
  
  function toggleDone(id, currentDone) {
    db.ref('users/' + userId + '/tasks/' + id).update({ done: !currentDone });
  }
  
  function deleteTask(id) {
    db.ref('users/' + userId + '/tasks/' + id).remove();
  }
  
  function render(tasks) {
    const list = document.getElementById('list');
    if (tasks.length === 0) {
      list.innerHTML = '<p style="color:#aaa;text-align:center;">Chưa có công việc nào!</p>';
      return;
    }
    list.innerHTML = tasks.map(t => `
      <li class="${t.done ? 'done' : ''}">
        <input type="checkbox" ${t.done ? 'checked' : ''}
          onchange="toggleDone('${t.id}', ${t.done})">
        <span>${t.text}</span>
        <button class="delete-btn" onclick="deleteTask('${t.id}')">✕</button>
      </li>
    `).join('');
  }
  
  document.getElementById('inp')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
