const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },

        quantity: {
          type: Number,
          default: 1
        }
      }
    ],

    // PDF flat schema properties for compatibility
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number }
  },
  {
    timestamps: true
  }
);

cartSchema.pre("validate", async function () {
  try {
    if ((!this.products || this.products.length === 0) && this.title) {
      const Product = mongoose.model("Product");
      const product = await Product.findOne({ $or: [{ title: this.title }, { name: this.title }] });
      if (product) {
        this.products = [{
          productId: product._id,
          quantity: this.quantity || 1
        }];
      }
    } else if (this.products && this.products.length > 0) {
      const firstItem = this.products[0];
      if (firstItem.productId) {
        const Product = mongoose.model("Product");
        const product = await Product.findById(firstItem.productId);
        if (product) {
          this.title = product.title || product.name;
          this.description = product.description;
          this.mainImg = product.mainImg || product.image;
          this.price = product.price;
          this.discount = product.discount || 0;
          this.quantity = firstItem.quantity || 1;
          this.size = "M";
        }
      }
    }
  } catch (err) {
    console.error("Error in Cart pre-validate hook:", err);
    throw err;
  }
});

const Cart = mongoose.model("cart", cartSchema);
try {
  mongoose.model("Cart", cartSchema);
} catch (e) {}
module.exports = Cart;
module.exports.Cart = Cart;