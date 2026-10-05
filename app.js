// app.js
const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');

let currentFilter = 'all'; // all / active / done
let tasks = [];

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
      task.done = !task.done;    // 切换状态：改的是数组里的对象
      render();
    });

    // 补充删除按钮（对应讲义中已定义的 .del 样式及删除功能）
    const delSpan = document.createElement('span');
    delSpan.textContent = ' ×';
    delSpan.className = 'del';
    delSpan.title = '删除任务';
    delSpan.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止冒泡，避免触发 li 的完成切换
      const idx = tasks.indexOf(task);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        render();
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
