const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create invoice — requires token
router.post("/", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      user: req.user.id, // attach user ID from token
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all invoices for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to get invoices" });
  }
});

// ✅ Get one invoice (only if owned by user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    res.json(invoice);
  } catch {
    res.status(404).json({ error: "Invoice not found" });
  }
});

// ✅ GET /api/invoices?page=1&search=clientName
router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, search = "" } = req.query;
  const PAGE_SIZE = 5;

  try {
    const query = {
      user: req.user.id,
      clientName: { $regex: search, $options: "i" },
    };

    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.json({ invoices, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: "Failed to get invoices" });
  }
});


// ✅ Delete invoice (only if owned by user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;
