const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/", dataController.createDataPost);
router.get("/", dataController.getData);
router.get("/:id", dataController.getDataById);
router.put("/:id", dataController.editDataById);
router.delete("/:id", dataController.removeDataById);

module.exports = router;
   