const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        size: {
          type: String,
          default: "",
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    shippingAddress: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      default: "Paid",
    },

    // PDF flat schema properties for compatibility
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    paymentMethod: { type: String },
    orderDate: { type: String },
    deliveryDate: { type: String },
    orderStatus: { type: String, default: "order placed" }
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", async function () {
  try {
    console.log("🔍 orderSchema pre-validate hook triggered!");
    console.log("status:", this.status, "orderStatus:", this.orderStatus);

    // Sync status fields
    if (this.status && (!this.orderStatus || this.orderStatus === "order placed")) {
      this.orderStatus = this.status;
    } else if (this.orderStatus && this.orderStatus !== "order placed") {
      this.status = this.orderStatus;
    }

    // Populate user-related details if missing userId but we have email/name
    if (!this.userId && (this.email || this.name)) {
      const User = mongoose.model("User");
      const user = await User.findOne({ $or: [{ email: this.email }, { username: this.name }] });
      if (user) {
        this.userId = user._id;
      }
    }

    // Populate user-related details if available
    if (this.userId) {
      console.log("User lookup for ID:", this.userId);
      const User = mongoose.model("User");
      const user = await User.findById(this.userId);
      if (user) {
        console.log("User found:", user.username);
        this.name = this.name || user.username;
        this.email = this.email || user.email;
        this.mobile = this.mobile || user.phone || "9876543210";
        this.address = this.address || this.shippingAddress || user.address || "123 Main St";
        this.pincode = this.pincode || "123456";
      } else {
        console.log("User NOT found in DB!");
      }
    }

    // Sync address fields
    if (this.shippingAddress && !this.address) {
      this.address = this.shippingAddress;
    }
    if (this.address && !this.shippingAddress) {
      this.shippingAddress = this.address;
    }

    // Bi-directional product sync
    if ((!this.products || this.products.length === 0) && this.title) {
      const Product = mongoose.model("Product");
      const product = await Product.findOne({ $or: [{ title: this.title }, { name: this.title }] });
      if (product) {
        this.products = [{
          productId: product._id,
          quantity: this.quantity || 1,
          size: this.size || "M"
        }];
      }
    }

    if (this.products && this.products.length > 0) {
      const firstItem = this.products[0];
      console.log("Product lookup for ID:", firstItem.productId);
      if (firstItem.productId) {
        const Product = mongoose.model("Product");
        const product = await Product.findById(firstItem.productId);
        if (product) {
          console.log("Product found:", product.name);
          this.title = this.title || product.title || product.name;
          this.description = this.description || product.description;
          this.mainImg = this.mainImg || product.mainImg || product.image;
          this.size = this.size || firstItem.size || "M";
          this.quantity = this.quantity || firstItem.quantity || 1;
          this.price = this.price || product.price;
          this.discount = this.discount !== undefined ? this.discount : (product.discount || 0);
        } else {
          console.log("Product NOT found in DB!");
        }
      }
    }

    // Price and totalAmount sync
    if (this.totalAmount && !this.price) {
      this.price = this.totalAmount;
    }
    if (this.price && !this.totalAmount) {
      this.totalAmount = this.price * (this.quantity || 1);
    }

    // Default dates if missing
    if (!this.orderDate) {
      this.orderDate = new Date().toISOString().split("T")[0];
    }
    if (!this.deliveryDate) {
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 3);
      this.deliveryDate = delivery.toISOString().split("T")[0];
    }
    if (!this.paymentMethod) {
      this.paymentMethod = "cod";
    }

    console.log("Pre-validate hook completed. Final fields:");
    console.log("name:", this.name, "title:", this.title, "orderStatus:", this.orderStatus);
  } catch (err) {
    console.error("Error in Order pre-validate hook:", err);
    throw err;
  }
});

const Orders = mongoose.model("orders", orderSchema);
try {
  mongoose.model("Order", orderSchema);
} catch (e) {}
module.exports = Orders;
module.exports.Orders = Orders;
