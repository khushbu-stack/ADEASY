const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
// Serve frontend
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));


/* ------------------ IMAGE UPLOAD SETUP ------------------ */
const storage = multer.diskStorage({
  destination: "uploads/",
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
  res.send("Marketing MVP Backend Running 🚀");
});

// Upload image
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
  });
});

// Generate AI caption (POST - used by frontend)
app.post("/generate-caption", (req, res) => {
  const captions = [
    "Grow your business with smart marketing ✨\n#LocalBusiness #ShopLocal #ViralPost",
    "Turn views into customers 🚀\n#SmallBusiness #MarketingTips #Trending",
    "Your product deserves attention 💡\n#InstaMarketing #LocalSeller #Growth"
  ];
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];
  res.json({ caption: randomCaption });
});

// Generate AI caption (GET - browser testing)
app.get("/generate-caption", (req, res) => {
  const captions = [
    "Grow your business with smart marketing ✨\n#LocalBusiness #ShopLocal #ViralPost",
    "Turn views into customers 🚀\n#SmallBusiness #MarketingTips #Trending",
    "Your product deserves attention 💡\n#InstaMarketing #LocalSeller #Growth"
  ];
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];
  res.json({ caption: randomCaption });
});

// Post (simulated Instagram)
app.post("/post", (req, res) => {
  const { imageUrl, caption } = req.body;

  const newPost = {
    imageUrl,
    caption,
    date: new Date().toLocaleString(),
    status: "Posted"
  };

  posts.unshift(newPost);
  res.json({ message: "Posted to Instagram successfully", post: newPost });
});

// Get post history
app.get("/posts", (req, res) => {
  res.json(posts);
});

/* ------------------ SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
