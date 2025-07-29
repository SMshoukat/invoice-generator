const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: only needed if you have a User model
      required: true,
    },
    companyName: String,
    clientName: String,
    invoiceNumber: String,
    date: String,
    dueDate: String,
    notes: String,
    items: [
      {
        description: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: String,
    logo: String, // Optional: in case you're storing logos per invoice
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
