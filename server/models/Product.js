const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    title: {
      type: String
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    originalPrice: {
      type: Number
    },

    discount: {
      type: Number,
      default: 0
    },

    image: {
      type: String
    },

    mainImg: {
      type: String
    },

    carousel: {
      type: Array
    },

    sizes: {
      type: Array
    },

    category: {
      type: String
    },

    gender: {
      type: String
    },

    stock: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

productSchema.pre("validate", function (next) {
  if (this.name && !this.title) {
    this.title = this.name;
  }
  if (this.title && !this.name) {
    this.name = this.title;
  }
  if (this.image && !this.mainImg) {
    this.mainImg = this.image;
  }
  if (this.mainImg && !this.image) {
    this.image = this.mainImg;
  }
  if (!this.carousel || this.carousel.length === 0) {
    this.carousel = [this.image || ""];
  }
  if (!this.sizes || this.sizes.length === 0) {
    this.sizes = ["S", "M", "L", "XL"];
  }
  if (!this.gender) {
    this.gender = "Unisex";
  }
  if (this.originalPrice && this.price && !this.discount) {
    this.discount = Math.max(0, this.originalPrice - this.price);
  }
  if (typeof next === 'function') {
    next();
  }
});

const Product = mongoose.model("products", productSchema);
try {
  mongoose.model("Product", productSchema);
} catch (e) {}
module.exports = Product;
module.exports.Product = Product;