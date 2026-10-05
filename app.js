// app.js
const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');

let currentFilter = 'all'; // all / active / done

// 从 localStorage 恢复数据，使用 || '[]' 避免首次访问时为 null 导致报错
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// 持久化保存函数：将状态数组序列化为 JSON 字符串保存到本地
const save = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const render = () => {
  list.innerHTML = '';
  const shown = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.done : t.done
  );
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = currentFilter === 'all' && tasks.length === 0 ? '暂无任务' : '没有符合条件的任务';
    list.appendChild(li);
    return;
  }
  shown.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) li.classList.add('done');
    li.addEventListener('click', () => {
      task.done = !task.done;    // 切换状态：修改数组中的对象
      save();                    // 数据修改后立即本地持久化
      render();                  // 统一重绘界面
    });

    // 补充删除按钮（对应讲义中已定义的 .del 样式及删除功能）
    const delSpan = document.createElement('span');
    delSpan.textContent = ' ×';
    delSpan.className = 'del';
    delSpan.title = '删除任务';
    delSpan.addEventListener('click', (e) => {
      e.stopPropagation();       // 阻止事件冒泡，避免触发 li 的完成切换
      const idx = tasks.indexOf(task);
      if (idx !== -1) {
        tasks.splice(idx, 1);    // 先改数组
        save();                  // 再保存
        render();                // 再重绘界面
      }
    });
    li.appendChild(delSpan);

    list.appendChild(li);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '任务名不能为空';
    return;
  }
  tasks.push({ text: text, done: false });
  save();                        // 添加任务后持久化保存
  tip.textContent = '';
  input.value = '';
  render();
});

filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;   // data-filter属性
  render();
});

render();
