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
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET',
  });
  
  let result;

  if (response.ok) {
    result = await response.json();
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
  

  for (let el of result.data) {
    paragraph = `<div class="task" id="${el._id}">
                  <textarea disabled class="task-text ${el._id}">${el.text}</textarea>
                  <div class="buttons ${el._id}">
                    <button class="finish ${el._id}" onclick="finish(event)">${el.isCheck ? 'in To-Do' : 'finished'}</button>
                    <button class="edit ${el._id}" onclick="edit(event)">edit</button>
                    <button class="delete ${el._id}" onclick="remove(event)">delete</button>
                    <button class="return ${el._id}" style="display: none;">return</button>
                  </div>
                </div>`;

    !el.isCheck ? tasks[el._id] = paragraph : finished[el._id] = paragraph;
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

  return result;
}

const postOnServer = async () => {
  const response = await fetch('http://localhost:8000/createTask',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      text: task,
      isCheck: false
    })
  });
  const result = await response.json();

  if (response.ok) {
    paragraph = `<div class="task" id="${result._id}">
                  <textarea disabled class="task-text ${result._id}">${task}</textarea>
                  <div class="buttons ${result._id}">
                    <button class="finish ${result._id}" onclick="finish(event)">finished</button>
                    <button class="edit ${result._id}" onclick="edit(event)">edit</button>
                    <button class="delete ${result._id}" onclick="remove(event)">delete</button>
                    <button class="return ${result._id}" style="display: none;">return</button>
                  </div>
                </div>`;
    tasksArray = [];
    tasks[result._id] = paragraph;

    for (let key in tasks) {
      if (tasksArray.indexOf(tasks[key]) < 0) {
        tasksArray.unshift(tasks[key]);
      }
    }

  updateToDoside();
  document.getElementById('add-task').value = null;
  task = '';

  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const patchOnServer = async (isCheck, elem, _id, action) => {
  const response = await fetch('http://localhost:8000/updateTask',{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: elem.value,
      isCheck,
      _id
    })
  });

  if (response.ok) {
    const result = await response.json();
    elem.disabled = true;
    const isEditable = elem.nextElementSibling.children[1].classList[2];

    if (action === 'finish' && isCheck) {
      delete tasks[_id];

      finished[_id] = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text ${_id}">${elem.value}</textarea>
                        <div class="buttons ${_id}">
                          <button class="finish ${_id}" onclick="finish(event)">in To-Do</button>
                          <button class="edit ${_id} ${isEditable ? 'non-edit' : ''}" onclick="edit(event)">edit</button>
                          <button class="delete ${_id}" onclick="remove(event)">delete</button>
                          <button class="return ${_id}" style="display: none;">return</button>
                        </div>
                      </div>`
      delete tasks[_id];
      tasksArray = [];
      finishedArray = [];

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

      return;
    } else if (action === 'finish' && !isCheck) {
      delete finished[_id];

      tasks[_id] = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text ${_id}">${elem.value}</textarea>
                        <div class="buttons ${_id}">
                          <button class="finish ${_id}" onclick="finish(event)">finished</button>
                          <button class="edit ${_id} non-edit" onclick="edit(event)">edit</button>
                          <button class="delete ${_id}" onclick="remove(event)">delete</button>
                          <button class="return ${_id}" style="display: none;">return</button>
                        </div>
                      </div>`;
      delete finished[_id];
      tasksArray = [];
      finishedArray = [];

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

      return;
    }

    if (_id in tasks) {     
      const paragraph = `<div class="task" id="${_id}">
                          <textarea disabled class="task-text ${_id}">${elem.value}</textarea>
                          <div class="buttons ${_id}">
                            <button class="finish ${_id}" onclick="finish(event)">finished</button>
                            <button class="edit ${_id}" onclick="edit(event)">edit</button>
                            <button class="delete ${_id}" onclick="remove(event)">delete</button>
                            <button class="return ${_id}" style="display: none;">return</button>
                          </div>
                        </div>`;
      tasks[_id] = paragraph;
      tasksArray = [];

      for (let key in tasks) {
        if (tasksArray.indexOf(tasks[key]) < 0) {
          tasksArray.unshift(tasks[key]);
        }
      }
      updateToDoside();

    } else if (_id in finished) {      
      const paragraph = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text ${_id}">${elem.value}</textarea>
                        <div class="buttons ${_id}">
                          <button class="finish ${_id}" onclick="finish(event)">in To-Do</button>
                          <button class="edit ${_id}" onclick="edit(event)">edit</button>
                          <button class="delete ${_id}" onclick="remove(event)">delete</button>
                          <button class="return ${_id}" style="display: none;">return</button>
                        </div>
                      </div>`;
      finished[_id] = paragraph;
      finishedArray = [];
              
      for (let key in finished) {
        if (finishedArray.indexOf(finished[key]) < 0) {
          finishedArray.unshift(finished[key]);
        }
      }

      updateFinishedSide();
    }
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const deleteFromServer = async (id) => {
  const response = await fetch(`http://localhost:8000/deleteTask?_id=${id}`,{
    method: 'DELETE',
  });
  
  if (response.ok) {
    const result = await response.json();

    delete tasks[result._id];
    delete finished[result._id];
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
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

const finish = async (event) => {
  const [, id] = event.target.classList;
  const text = document.getElementsByClassName(id)[0].value;
  const elem = document.getElementsByClassName(id)[0];
  const isCheck = Object.keys(tasks).includes(id) ? false : true;
  patchOnServer(!isCheck, elem, id, 'finish');
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
      ret.style.display = "none";
      const isCheck = Object.keys(tasks).includes(id) ? false : true;
      patchOnServer(isCheck, elem, id);
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
  button.addEventListener('click', postOnServer);
  initialPrint(tasks, finished);
}