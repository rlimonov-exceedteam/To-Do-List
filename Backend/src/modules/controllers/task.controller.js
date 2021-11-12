const Task = require('../../db/models/task/index');

module.exports.getAllTasks = (req, res, next) => {
  Task.find().then(result => {
    res.send({data: result});
  })
}

module.exports.createNewTask = (req, res, next) => {
  const body = req.body;

  if (body.hasOwnProperty('text') && body.hasOwnProperty('isCheck')) {
    const task = new Task(req.body);
    task.save().then(result => {
      res.send(result);
    });

  } else {
    res.send('Data is incorrect, error!');
  }
}

module.exports.changeTaskInfo = (req, res, next) => {
  const body = req.body;

  if (body.hasOwnProperty('id') && body.hasOwnProperty('isCheck') && body.hasOwnProperty('text')) {
    Task.findOneAndUpdate({id: req.body.id}, {text, isCheck} = req.body, 
      {upsert: true}).then(result => {
        res.send(result);
      })
  } else {
    res.status(422).send('Data is incorrect, error!');
  }
}

module.exports.deleteTask = (req, res, next) => {
  if(!req.query.id) {
    return res.status(422).send('Error! Params not correct');

  } else if (!Task.findOne({id: req.query.id})) {
    res.status(404).send('Task not found');
    
  } else {
    Task.deleteOne({id: req.query.id}).then(result => {
      res.send('succesfully deleted');
    });
  }
}