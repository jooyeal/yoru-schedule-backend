const router = require("express").Router();
const Task = require("../models/Task");
const { verifyToken } = require("../middlewares/verify");

//CREATE TASK
router.post("/create", verifyToken, async (req, res) => {
  console.log(req.body.userId, req.body.title);
  try {
    const newTask = new Task({
      userId: req.body.userId,
      title: req.body.title,
      desc: req.body.desc,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      priority: req.body.priority,
      condition: req.body.condition,
    });

    const savedTask = await newTask.save();
    res.status(200).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE TASK
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const targetTask = await Task.findById(req.params.id);
    if (targetTask.userId !== req.user.id)
      return res.status(401).json("他ユーザーへのアクセスは不可です。");

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          desc: req.body.desc,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          priority: req.body.priority,
          condition: req.body.condition,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE TASK
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json("成功的に削除されました。");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TASK
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const targetTask = await Task.findById(req.params.id);
    if (targetTask.userId !== req.user.id) {
      res.status(401).json("他ユーザーへのアクセスは不可です。");
      return;
    }
    res.status(200).json(targetTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TASKS
router.get("/", verifyToken, async (req, res) => {
  try {
    const allTasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(allTasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
