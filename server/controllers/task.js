const Task = require('../model/task');
const AppError = require('../error-handler/AppError');
const moment = require('moment');


const getTasks = (async (req, res, next) => {
    try {
        const { range = 7 } = req.query;
        const today = moment.utc().endOf('day');
        const tasks = await Task.find({
          createdBy: req.user._id,
          createdAt: {
            $lte: today.toDate(),
            $gt: today.clone().subtract(range, 'days').toDate(),
          },
        });

        if (!tasks) {
          console.log('No tasks found');
        }
    
        console.log('Tasks fetched:', tasks); 
    
        res.status(200).json({
          status: 'success',
          results: tasks.length,
          data: { tasks },
        });
      } catch (error) {
        throw new Error('Failed to fetch tasks');
      }
});

const getTask = (async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
    
        if (!task) {
          throw new Error('Task not found');
        }
    
        res.status(200).json({
          status: 'success',
          data: { task },
        });
      } catch (error) {
        throw new Error('Failed to fetch task');
      }
});

const createTask = (async (req, res, next) => {
  try{
    const { userId } = req.user;
    const { title, priority, checklists, myAssignies, dueDate, createdAt, status } = req.body;

    if (!title || !title || !priority || !checklists) {
      return next(createError(400, "All fields are requiered!"));
    }

    const activity = {
      type: "assigned",
      by: userId,
    };

    // Create the task
    const task = new Task({
    title,
    priority,
    checklists,
    dueDate,
    createdAt,
    status,
    myAssignies,
    createdBy:  req.user._id,
    activities: activity
  });

  await task.save();

  res.status(201).json({
    status: 'success',
    data: { task },
  });

  } catch(error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }

});

const updateTask = (async (req, res, next) => {
  try{
    const { taskId } = req.params;
    const { title, priority, checklists, myAssignies, dueDate, status } = req.body;
  
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user._id },
      {
        title,
        priority,
        checklists,
        myAssignies,
        dueDate,
        status,
      },
      { new: true, runValidators: true }
    );
  
    if (!updatedTask) {
      return next(new AppError('Task not found', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: { task: updatedTask },
    });
  } catch(error) {
    console.log(error); 
    throw new Error('Failed to fetch task');
  }
});


const deleteTask = (async (req, res, next) => {
  const { taskId } = req.params;

  if (!taskId) {
    return next(new AppError('Please provide a taskId', 400));
  }

  const task = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: req.user._id,
  });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const analytics = (async (req, res, next) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
    
        const status = {
          backlog: 0,
          todo: 0,
          inProgress: 0,
          done: 0,
        };
    
        const priorities = {
          low: 0,
          high: 0,
          moderate: 0,
          due: 0,
        };
    
        tasks.forEach((task) => {
          status[task.status]++;
          priorities[task.priority]++;
          if (task.isExpired) {
            priorities.due++;
          }
        });
    
        res.status(200).json({
          status: 'success',
          data: { status, priorities },
        });
      } catch (error) {
        throw new Error('Failed to fetch task');
      }
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  analytics,
};
