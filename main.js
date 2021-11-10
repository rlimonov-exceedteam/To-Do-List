const tasks =  {};
const finished =  {};

let finishedArray = [];
let tasksArray = [];
let task = '';
let paragraph = '';
let counter = 0;


const enterData = (event) => {
  task = event.target.value;
}

const updateToDoside = () => {
  const str = tasksArray.join('');
  document.getElementById('to-do-root').innerHTML = str;
}

const updateFinishedSide = () => {
  const str = finishedArray.join('');
  document.getElementsByClassName('done-root')[0].innerHTML = str;
}

const getFromServer = async (tasks, finished, tasksArray, finishedArray) => {
  const response = await fetch('http://localhost:8000/allTasks',{
    method: 'GET'
  });
  const result = await response.json();

  for (let el of result.data) {
    if (!el.isCheck) {
      tasks[el.id] = el.text;
    } else {
      finished[el.id] = el.text;
    }
  }

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

  updateToDoside();
  updateFinishedSide();

  const serverCounter = result.data[result.data.length - 1] ? 
  result.data[result.data.length - 1].id : null;

  counter = serverCounter ?
  +serverCounter.substring(0, serverCounter.indexOf('div')) : 0;
}

const postOnServer = async (text, id, isCheck) => {
  const response = await fetch('http://localhost:8000/createTask',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text,
      id,
      isCheck
    })
  });
  const result = await response.json();
}

const patchOnServer = async (text, id, isCheck) => {
  const response = await fetch('http://localhost:8000/updateTask',{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8', 
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text,
        id,
        isCheck
      })
  });
  const result = await response.json();
}

const deleteFromServer = async (id) => {
  const response = await fetch(`http://localhost:8000/deleteTask?id=${id}`,{
    method: 'DELETE',
  });
  const result = await response.json();
}

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

  updateToDoside();
  updateFinishedSide();
}

const printTask = async () => {
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
    postOnServer(paragraph, `${counter}div`, false)

    for (let key in tasks) {
      if (tasksArray.indexOf(tasks[key]) < 0) {
        tasksArray.unshift(tasks[key]);
      }
    }

    updateToDoside();
    document.getElementById('add-task').value = null;
    task = '';
  }
}

const finish = async (event) => {
  const [, id] = event.target.classList;
  const task = document.getElementsByClassName(id)[0].value;
  let paragraph = document.getElementById(id);

  delete tasks[id];
  tasksArray = [];

  for (let key in tasks) {
    tasksArray.unshift(tasks[key]);
  }

  updateToDoside();

  paragraph = `<div class="task" id="${id}">
                    <textarea disabled class="task-text ${id}">${task}</textarea>
                    <div class="buttons ${id}">
                      <button class="finish ${id}" onclick="restore(event)">in To-Do</button>
                      <button class="edit ${id} non-edit" onclick="edit(event)">edit</button>
                      <button class="delete ${id}" onclick="remove(event)">delete</button>
                      <button class="return ${id}" style="display: none;">return</button>
                    </div>
                  </div>`;
  finished[id] = paragraph;

  for (let key in finished) {
    if (finishedArray.indexOf(finished[key]) < 0) {
      finishedArray.unshift(finished[key]);
    }
  }

  updateFinishedSide();
  patchOnServer(paragraph, id, true);
}

const restore = async (event) => {
  const [, id] = event.target.classList;
  const task = document.getElementsByClassName(id)[0].value;
  let paragraph = document.getElementById(id);

  delete finished[id];
  finishedArray = [];

  for (let key in finished) {
    finishedArray.unshift(finished[key]);
  }

  updateFinishedSide();

  paragraph = `<div class="task" id="${id}">
                    <textarea disabled class="task-text ${id}">${task}</textarea>
                    <div class="buttons ${id}">
                      <button class="finish ${id}" onclick="finish(event)">finished</button>
                      <button class="edit ${id} non-edit" onclick="edit(event)">edit</button>
                      <button class="delete ${id}" onclick="remove(event)">delete</button>
                      <button class="return ${id}" style="display: none;">return</button>
                    </div>
                  </div>`;
  tasks[id] = paragraph;

  for (let key in tasks) {
    if (tasksArray.indexOf(tasks[key]) < 0) {
      tasksArray.unshift(tasks[key]);
    }
  }

  updateToDoside();
  patchOnServer(paragraph, id, false);
}

const edit = (event) => {
  if (event.target.classList[2] !== 'non-edit') {
    const [, id] = event.target.classList;
    const [elem, ] = document.getElementsByClassName(id);
    const [,,,,,ret] = document.getElementsByClassName(id);
    const [,,,editBtn] = document.getElementsByClassName(id);
    const val = elem.value;
    
    elem.disabled = false;
    ret.style.display = "block";

    ret.onclick = (event) => {
      const [, id2] = event.target.classList;
      const [paragraph2, ] = document.getElementsByClassName(id);

      paragraph2.value = val;
    };

    editBtn.onclick = async (el) => {
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

        patchOnServer(paragraph, id, false);
        tasksArray = [];

        for (let key in tasks) {
          if (tasksArray.indexOf(tasks[key]) < 0) {
            tasksArray.unshift(tasks[key]);
          }
        }

        updateToDoside();

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

        patchOnServer(paragraph, id, true);
        finishedArray = [];
                
        for (let key in finished) {
          if (finishedArray.indexOf(finished[key]) < 0) {
            finishedArray.unshift(finished[key]);
          }
        }

        updateFinishedSide();
      }
    }
  }
}

const remove = async (event) => {
  const [, id] = event.target.classList;

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

  updateFinishedSide();
  updateToDoside();
  deleteFromServer(id);
}


///////////////////////////////////////////////////////////////////////////////////////


window.onload = async () => {
  const input = document.getElementById('add-task');
  const button = document.getElementById('btn');
  const root = document.getElementById('root');

  getFromServer(tasks, finished, tasksArray, finishedArray);

  input.addEventListener('change', enterData);
  button.addEventListener('click', printTask);
  initialPrint(tasks, finished);
}



