function addTask() {
    const inp = document.getElementById('inp');
    const text = inp.value.trim();
  
    if (text === '') return; // Không thêm nếu ô trống
  
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" onchange="toggleDone(this)">
      <span>${text}</span>
      <button class="delete-btn" onclick="deleteTask(this)">✕</button>
    `;
  
    document.getElementById('list').appendChild(li);
    inp.value = ''; // Xóa ô nhập sau khi thêm
  }
  
  function toggleDone(checkbox) {
    const li = checkbox.parentElement;
    li.classList.toggle('done');
  }
  
  function deleteTask(btn) {
    btn.parentElement.remove();
  }
  
  // Bấm Enter cũng thêm được
  document.getElementById('inp').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTask();
  });