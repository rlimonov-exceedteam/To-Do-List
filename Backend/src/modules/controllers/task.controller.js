const Task = require('../../db/models/task/index');

module.exports.getAllTasks = (req, res) => {
  Task.find().then(result => {
    res.send({data: result});
  })
}

module.exports.createNewTask = (req, res) => {
  const task = new Task(req.body);
  task.save();
}

module.exports.changeTaskInfo = (req, res) => {
  Task.findOneAndUpdate({id: req.body.id}, {text: req.body.text, isCheck: req.body.isCheck},
  {upsert: true}, result => {
    res.send(req.body.id);
  });
}

module.exports.deleteTask = (req, res) => {
  console.log(req);
  Task.deleteOne(req.query).then(result => {
    res.send('deleted');
  });
}