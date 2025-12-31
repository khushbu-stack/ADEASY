const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

/* IMPORTANT: cloud-compatible PORT */
const PORT = process.env.PORT || 5000;

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors());
app.use(express.json());

/* Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* Serve frontend files */
app.use(express.static("public"));

/* Serve uploaded images */
app.use("/uploads", express.static("uploads"));

/* ------------------ IMAGE UPLOAD SETUP ------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ------------------ TEMP DATABASE ------------------ */
let posts = [];

/* ------------------ ROUTES ------------------ */

// Health check
app.get("/", (req, res) => {
  res.send("ADEASY Marketing MVP Running 🚀");
});

// Upload image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  res.json({
    imageUrl: `/uploads/${req.file.filename}`
  });
});

// Generate AI caption (POST)
app.post("/generate-caption", (req, res) => {
  const captions = [
    "Grow your business with smart marketing ✨\n#LocalBusiness #ShopLocal #ViralPost",
    "Turn views into customers 🚀\n#SmallBusiness #MarketingTips #Trending",
    "Your product deserves attention 💡\n#InstaMarketing #LocalSeller #Growth"
  ];

  const randomCaption =
    captions[Math.floor(Math.random() * captions.length)];

  res.json({ caption: randomCaption });
});

// Generate AI caption (GET – browser test)
app.get("/generate-caption", (req, res) => {
  const captions = [
    "Grow your business with smart marketing ✨\n#LocalBusiness #ShopLocal #ViralPost",
    "Turn views into customers 🚀\n#SmallBusiness #MarketingTips #Trending",
    "Your product deserves attention 💡\n#InstaMarketing #LocalSeller #Growth"
  ];

  const randomCaption =
    captions[Math.floor(Math.random() * captions.length)];

  res.json({ caption: randomCaption });
});

// Simulated Instagram post
app.post("/post", (req, res) => {
  const { imageUrl, caption } = req.body;

  if (!imageUrl || !caption) {
    return res.status(400).json({ error: "Image or caption missing" });
  }

  const newPost = {
    imageUrl,
    caption,
    date: new Date().toLocaleString(),
    status: "Posted"
  };

  posts.unshift(newPost);

  res.json({
    message: "Posted to Instagram successfully",
    post: newPost
  });
});

// Get post history
app.get("/posts", (req, res) => {
  res.json(posts);
});

/* ------------------ SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`ADEASY server running on port ${PORT}`);
});
