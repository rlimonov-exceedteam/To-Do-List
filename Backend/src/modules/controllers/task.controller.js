const Task = require('../../db/models/task/index');

module.exports.getAllTasks = (req, res, next) => {
  try {
    Task.find().then(result => {
      res.send({data: result});
    });
  } catch (error) {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
}

module.exports.createNewTask = (req, res, next) => {
  const body = req.body;

  if (body.hasOwnProperty('text') && body.hasOwnProperty('isCheck')) {
    const task = new Task(req.body);
    task.save().then(result => {
      res.send(result);
    });
  } else {
    res.status(422).send('Data is incorrect, error!');
  }
}

module.exports.changeTaskInfo = (req, res, next) => {
  const body = req.body;

  if (body.hasOwnProperty('id')) {
    Task.findOneAndUpdate({id: req.body.id}, {text, isCheck} = req.body, 
    {upsert: true}).then(result => {
      res.send(result);
    });
  } else {
    res.status(422).send('Data is incorrect, error!');
  }
}

module.exports.deleteTask = (req, res, next) => {
  if (!req.query.id) {
    return res.status(422).send('Error! Params not correct');
  } else {
    Task.deleteOne({id: req.query.id}).then(result => {
      res.send('succesfully deleted');
    });
  }
}