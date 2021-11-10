const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
const finished = JSON.parse(localStorage.getItem('finished')) || {};

let finishedArray = [];
let tasksArray = [];
let task = '';
let paragraph = '';
let storageCounter = JSON.parse(localStorage.getItem('counter'));
let counter = !storageCounter ? 0 : +storageCounter.substring(0, storageCounter.indexOf('div'));

const initialPrint = (tasks, finished) => {
  for (let key in tasks) {
    if (tasksArray.indexOf(tasks[key]) < 0) {
      tasksArray.unshift(tasks[key]);
    }
  }

  for (let key in finished) {
    if (finishedArray.indexOf(finished[key]) < 0) {
      finishedArray.unshift(finished[key]);
    }
  }

  updateLeftside();
  updateRightside();
}

const printTask = () => {
  if(task) {
    paragraph = `<div class="task" id="${++counter}div">
                  <textarea disabled class="task-text ${counter}div">${task}</textarea>
                  <div class="buttons ${counter}div">
                    <button class="finish ${counter}div" onclick="finish(event)">finished</button>
                    <button class="edit ${counter}div" onclick="edit(event)">edit</button>
                    <button class="delete ${counter}div" onclick="remove(event)">delete</button>
                    <button class="return ${counter}div" style="display: none;">return</button>
                  </div>
                 </div>`
    tasks[`${counter}div`] = paragraph;

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('finished', JSON.stringify(finished));
    localStorage.setItem('counter', JSON.stringify(`${counter}div`));

    for (let key in tasks) {
      if (tasksArray.indexOf(tasks[key]) < 0) {
        tasksArray.unshift(tasks[key]);
      }
    }

    updateLeftside();
    document.getElementById('add-task').value = null;
    task = '';
  }
}

const enterData = (event) => {
  task = event.target.value;
}

const updateLeftside = () => {
  const str = tasksArray.join('');
  document.getElementById('to-do-root').innerHTML = str;
}

const updateRightside = () => {
  const str = finishedArray.join('');
  document.getElementsByClassName('done-root')[0].innerHTML = str;
}

const finish = (event) => {
  const [, id] = [event.target.classList];
  const task = document.getElementsByClassName(id)[0].value;
  let elem = document.getElementById(id);

  delete tasks[id]; 
  tasksArray = [];

  for (let key in tasks) {
    tasksArray.unshift(tasks[key]);
  }

  updateLeftside();

  elem = `<div class="task" id="${id}">
            <textarea disabled class="task-text ${id}">${task}</textarea>
            <div class="buttons ${id}">
              <button class="finish ${id}" onclick="restore(event)">in To-Do</button>
              <button class="edit ${id} non-edit" onclick="edit(event)">edit</button>
              <button class="delete ${id}" onclick="remove(event)">delete</button>
              <button class="return ${id}" style="display: none;">return</button>
            </div>
          </div>`;

  finished[id] = elem;

  for (let key in finished) {
    if (finishedArray.indexOf(finished[key]) < 0) {
      finishedArray.unshift(finished[key]);
    }
  }

  updateRightside();

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('finished', JSON.stringify(finished));
}

const restore = (event) => {
  const [, id] = [event.target.classList];
  const task = document.getElementsByClassName(id)[0].value;
  let elem = document.getElementById(id);

  delete finished[id];
  finishedArray = [];

  for (let key in finished) {
    finishedArray.unshift(finished[key]);
  }

  updateRightside();

  elem = `<div class="task" id="${id}">
                    <textarea disabled class="task-text ${id}">${task}</textarea>
                    <div class="buttons ${id}">
                      <button class="finish ${id}" onclick="finish(event)">finished</button>
                      <button class="edit ${id} non-edit" onclick="edit(event)">edit</button>
                      <button class="delete ${id}" onclick="remove(event)">delete</button>
                      <button class="return ${id}" style="display: none;">return</button>
                    </div>
                  </div>`;
  tasks[id] = elem;

  for (let key in tasks) {
    if (tasksArray.indexOf(tasks[key]) < 0) {
      tasksArray.unshift(tasks[key]);
    }
  }

  updateLeftside();

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('finished', JSON.stringify(finished));
}

const edit = (event) => {
  if (event.target.classList[2] !== 'non-edit') {
    const [, id] = [event.target.classList];
    const elem = document.getElementsByClassName(id)[0];
    const ret = document.getElementsByClassName(id)[5];
    const editBtn = document.getElementsByClassName(id)[3];
    const val = elem.value;
    
    elem.disabled = false;
    ret.style.display = "block";

    ret.onclick = (event) => {
      const [, id2] = [event.target.classList];
      const elem2 = document.getElementsByClassName(id)[0];

      elem2.value = val;
    };

    editBtn.onclick = (el) => {
        elem.disabled = true;
        ret.style.display = "none";
        
        if (id in tasks) {
          const paragraph = `<div class="task" id="${id}">
                              <textarea disabled class="task-text ${id}">${elem.value}</textarea>
                              <div class="buttons ${id}">
                                <button class="finish ${id}" onclick="finish(event)">finished</button>
                                <button class="edit ${id}" onclick="edit(event)">edit</button>
                                <button class="delete ${id}" onclick="remove(event)">delete</button>
                                <button class="return ${id}" style="display: none;">return</button>
                              </div>
                            </div>`
          tasks[id] = paragraph;

          localStorage.setItem('tasks', JSON.stringify(tasks));
          localStorage.setItem('finished', JSON.stringify(finished));

          tasksArray = [];

          for (let key in tasks) {
            if (tasksArray.indexOf(tasks[key]) < 0) {
              tasksArray.unshift(tasks[key]);
            }
          }

          updateLeftside();

        } else if (id in finished) {
          const paragraph = `<div class="task" id="${id}">
                              <textarea disabled class="task-text ${id}">${elem.value}</textarea>
                              <div class="buttons ${id}">
                                <button class="finish ${id}" onclick="finish(event)">in To-Do</button>
                                <button class="edit ${id}" onclick="edit(event)">edit</button>
                                <button class="delete ${id}" onclick="remove(event)">delete</button>
                                <button class="return ${id}" style="display: none;">return</button>
                              </div>
                            </div>`
        finished[id] = paragraph;

        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('finished', JSON.stringify(finished));
        
        finishedArray = [];
                
        for (let key in finished) {
          if (finishedArray.indexOf(finished[key]) < 0) {
            finishedArray.unshift(finished[key]);
          }
        }
                
        updateRightside()
        }
      
    };
  }
}

const remove = (event) => {
  const [, id] = [event.target.classList];

  delete tasks[id];
  tasksArray = [];

  for (let key in tasks) {
    tasksArray.unshift(tasks[key]);
  }

  delete finished[id];
  finishedArray = [];

  for (let key in finished) {
    finishedArray.unshift(finished[key]);
  }

  updateRightside();
  updateLeftside();

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('finished', JSON.stringify(finished));
}


///////////////////////////////////////////////////////////////////////////////////////


window.onload = () => {
  const input = document.getElementById('add-task');
  const button = document.getElementById('btn');
  const root = document.getElementById('root');

  input.addEventListener('change', enterData);
  button.addEventListener('click', printTask);
  
  initialPrint(tasks, finished);
}



