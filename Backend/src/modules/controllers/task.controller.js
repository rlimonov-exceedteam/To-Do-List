const Task = require('../../db/models/task/index');

module.exports.getAllTasks = (req, res) => {
  Task.find().then(result => {
    res.send({data: result});
  })
}

module.exports.createNewTask = (req, res) => {
  const task = new Task(req.body);
  task.save().then(result => {
    res.send('succesfully created');
  }).catch(err => {
    console.log(err);
  });
}

module.exports.changeTaskInfo = (req, res) => {
  Task.findOneAndUpdate({id: req.body.id}, {text, isCheck} = req.body,
  {upsert: true}).then(result => {
    res.send('succesfully updated');
  }).catch(err => {
    console.log(err);
  });
}

module.exports.deleteTask = (req, res) => {
  Task.deleteOne({id: req.query.id}).then(result => {
    res.send('succesfully deleted');
  }).catch(err => {
    console.log(err);
  });
}