const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      default: ""
    },
    categories: {
      type: Array,
      default: ["Mobiles", "Electronics", "Fashion", "Sports", "Books"]
    }
  },
  {
    timestamps: true
  }
);

const Admin = mongoose.model("admin", adminSchema);
try {
  mongoose.model("Admin", adminSchema);
} catch (e) {}
module.exports = Admin;
module.exports.Admin = Admin;
