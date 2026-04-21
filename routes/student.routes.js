const express = require("express");
const router = express.Router();

const controller = require("../controllers/student.controller");
const validate = require("../middlewares/validation.middleware");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate, controller.create);
router.put("/:id", validate, controller.update);
router.delete("/:id", controller.delete);

module.exports = router;