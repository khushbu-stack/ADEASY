let imageFile = null;
let imageURL = "";

document.getElementById("imageInput").addEventListener("change", function (e) {
  imageFile = e.target.files[0];
  if (imageFile) {
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(imageFile);
    preview.style.display = "block";
  }
});

async function uploadImage() {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  imageURL = data.imageUrl;
}

async function generateCaption() {
  if (!imageFile) {
    alert("Upload image first");
    return;
  }

  document.getElementById("caption").value = "Generating...";

  const res = await fetch("http://localhost:5000/generate-caption", {
    method: "POST"
  });

  const data = await res.json();
  document.getElementById("caption").value = data.caption;
}

async function postToInstagram() {
  if (!imageURL) await uploadImage();

  const caption = document.getElementById("caption").value;
  if (!caption) {
    alert("Generate caption first");
    return;
  }

  await fetch("http://localhost:5000/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl: imageURL, caption })
  });

  loadPosts();
}

async function loadPosts() {
  const res = await fetch("http://localhost:5000/posts");
  const posts = await res.json();

  const history = document.getElementById("postHistory");
  history.innerHTML = "";

  posts.forEach(p => {
    history.innerHTML += `
      <div class="post-card">
        <img src="${p.imageUrl}">
        <p>${p.caption}</p>
        <small>${p.date}</small>
      </div>
    `;
  });
}

window.onload = loadPosts;
