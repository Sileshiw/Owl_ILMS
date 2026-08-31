const express = require("express");

const {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require("../controllers/itemsController");

const router = express.Router();

// GET all items
router.get("/", getItems);

// GET one item
router.get("/:id", getItemById);

// CREATE an item
router.post("/", createItem);

// UPDATE an item
router.put("/:id", updateItem);

// DELETE an item
router.delete("/:id", deleteItem);

module.exports = router;