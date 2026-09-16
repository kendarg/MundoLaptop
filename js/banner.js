const bannerImages = [
  "./img/banner.index/laptop%20one.png",
  "./img/banner.index/pc3.png",
  "./img/banner.index/pc4.png",
  "./img/banner.index/pcM.png",
  "./img/banner.index/pcs%20png.png",
];

const bannerImage = document.getElementById("bannerImagen");

if (bannerImage) {
  let currentImage = 0;

  setInterval(() => {
    currentImage = (currentImage + 1) % bannerImages.length;
    bannerImage.classList.remove("banner-image-front");
    void bannerImage.offsetWidth;
    bannerImage.src = bannerImages[currentImage];
    bannerImage.classList.add("banner-image-front");
  }, 1700);
}