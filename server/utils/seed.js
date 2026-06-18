const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Admin = require("../models/Admin");

dotenv.config();

const products = [
  {
    name: "Bronzer",
    description: "Soft warm toned bronzer in shade coco",
    price: 599,
    image: "/src/assets/products/1-bronzer.jpg",
    category: "Face",
    stock: 7
  },
  {
    name: "Toner",
    description: "Milky white with medium runny texture and suitable for all skin types, hydrating toner",
    price: 399,
    image: "/src/assets/products/2-toner.jpg",
    category: "Skincare",
    stock: 10
  },
  {
    name: "Beginner Teddy Set",
    description: "A beginner's set with soft warm tones. Includes: eyeshadow palette, face mirror, blush brush, cream blush, contour & semi-matte liquid lipstick",
    price: 1099,
    originalPrice: 1299,
    image: "/src/assets/products/3-teddy-set.jpg",
    category: "Sets",
    stock: 3
  },
  {
    name: "Beginner Merfolk Set",
    description: "A beginner's set with soft cool tones. Includes: eyeshadow palette, face mirror, blush brush, cream blush, contour, semi-matte liquid lipstick, lip liner, setting spray & primer",
    price: 1299,
    image: "/src/assets/products/4-merfolk-set.jpg",
    category: "Sets",
    stock: 3
  },
  {
    name: "Angel Face Mirror",
    description: "A soft pink toned design that's slick and portable",
    price: 399,
    image: "/src/assets/products/5-angel-mirror.jpg",
    category: "Tools",
    stock: 8
  },
  {
    name: "Mirror Glaze Lipstick Balm",
    description: "A high gloss, soft finish, highly pigmented and hydrating lipstick balm. Includes one item per package",
    price: 1499,
    image: "/src/assets/products/6-lipstick-balm.jpg",
    category: "Lips",
    stock: 3
  },
  {
    name: "Beginner Strawberry-Cream Set",
    description: "A beginner's set with soft red, cool tones. Includes: eyeshadow palette, face mirror, blush brush, cream blush, contour, 2 semi-matte liquid lipsticks & setting spray",
    price: 1299,
    image: "/src/assets/products/7-strawberry-set.jpg",
    category: "Sets",
    stock: 1
  },
  {
    name: "Beginner Merfolk Brush Set",
    description: "A beginner's brush set with a soft cool-toned grip that catches the eye and cloud-soft bristles. Includes 4 brushes: contour, highlight, blush & powder",
    price: 1299,
    image: "/src/assets/products/8-merfolk-brush.jpg",
    category: "Tools",
    stock: 11
  },
  {
    name: "Lemon-Green Skincare Set",
    description: "A beginner's set for healthier skin. Includes: dark spot treatment serum, soothing toner, moisturiser, night cream, under eye cream, jade roller & gua sha",
    price: 2699,
    image: "/src/assets/products/9-lemon-skincare.jpg",
    category: "Skincare",
    stock: 3
  },
  {
    name: "Beginner Merfolk Skincare Set",
    description: "A beginner's set for healthier skin. Includes: pore tightening treatment serum, soothing toner, moisturiser, anti-ageing night cream, soothing under eye cream, jade roller & gua sha",
    price: 2899,
    originalPrice: 3499,
    image: "/src/assets/products/10-merfolk-skincare.jpg",
    category: "Skincare",
    stock: 3
  },
  {
    name: "Beginner Merfolk Eyeshadow Palette",
    description: "A beginner's set with soft warm and cool tones. Includes 12 colours. Merfolk collection in collaboration with Love and Deepspace (Rafayel's Birthday Event - Limited Edition)",
    price: 1199,
    originalPrice: 1599,
    image: "/src/assets/products/11-angel-palette.jpg",
    category: "Eyes",
    stock: 6
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    // Seed admin config if not exists
    await Admin.deleteMany({});
    await Admin.create({
      banner: "Welcome to ShopEZ. Your premium makeup & beauty destination.",
      categories: ["Face", "Skincare", "Sets", "Tools", "Lips", "Eyes"]
    });
    console.log("✅ Admin config seeded");

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
