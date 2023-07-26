const dataModel = require("../modals/dataModel");

exports.createDataPost = async (req, res) => {
  try {
    const createPost = await dataModel.create(req.body);
    res.json({ message: "your post is created", data: createPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to create data post" }),console.log(error);;
  }
};

exports.getData = async (req, res) => {
  try {
    const getData = await dataModel.find(req.body);
    res.json({ message: "all data is fetched", data: getData });
  } catch (error) {
    res.json({ message: "Fail to Fetch data" });
  }
};
exports.getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const getData = await dataModel.findById(id);
    if (!getData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "all data is fetched", data: getData });
  } catch (error) {
    res.json({ message: "Fail to Fetch data" });
  }
};
exports.editDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const getData = await dataModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!getData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: " data is edited", data: getData });
  } catch (error) {
    res.json({ message: "Fail to edit data" });
  }
};
exports.removeDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const getData = await dataModel.findByIdAndDelete(id);
    if (!getData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "all data is fetched", data: getData });
  } catch (error) {
    res.json({ message: "Fail to Fetch data" });
  }
};
