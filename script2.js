const fileInput = document.getElementById("fileInput");
const cropperContainer = document.getElementById("cropper-container");
const placeholderText = document.getElementById("placeholder-text");
const image = document.getElementById("image");
const cropButton = document.getElementById("cropButton");
const uploadButton = document.getElementById("uploadButton");
const clearButton = document.getElementById("clearButton");
let cropper;
let imageLoaded = false; // Bandera para controlar si hay una imagen cargada

// Habilitar Drag and Drop en el contenedor
cropperContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  cropperContainer.style.borderColor = "green";
});

cropperContainer.addEventListener("dragleave", () => {
  cropperContainer.style.borderColor = "#ccc";
});

cropperContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  cropperContainer.style.borderColor = "#ccc";

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      image.style.display = "block";
      placeholderText.style.display = "none";
      imageLoaded = true;
      cropButton.disabled = false;

      if (cropper) {
        cropper.destroy();
      }
      initializeCropper();
    };
    reader.readAsDataURL(file);
  } else {
    alert("Por favor, selecciona un archivo de imagen válido.");
  }
});

cropButton.disabled = true;

const modal = document.getElementById("imageModal");
modal.addEventListener("hidden.bs.modal", clearImage);

cropperContainer.addEventListener("click", () => {
  if (!imageLoaded) {
    fileInput.click();
  }
});

uploadButton.addEventListener("click", () => {
  if (imageLoaded) {
    clearImage();
  }
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      image.style.display = "block";
      placeholderText.style.display = "none";
      imageLoaded = true;
      cropButton.disabled = false;

      if (cropper) {
        cropper.destroy();
      }
      initializeCropper();
    };
    reader.readAsDataURL(file);
  } else {
    alert("Por favor, selecciona un archivo de imagen válido.");
  }
});

cropButton.addEventListener("click", () => {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob((blob) => {
      console.log("Imagen recortada lista:", blob);
    });
  }
});

clearButton.addEventListener("click", clearImage);

function clearImage() {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  image.src = "";
  image.style.display = "none";
  placeholderText.style.display = "block";
  imageLoaded = false;
  cropButton.disabled = true;
  fileInput.value = "";
}

function initializeCropper() {
  cropper = new Cropper(image, {
    aspectRatio: null,
    viewMode: 1,
    autoCropArea: 0.8,
    dragMode: "crop",
    cropBoxResizable: true,
    cropBoxMovable: true,
    zoomOnWheel: true,
    toggleDragModeOnDblclick: false,
  });
}

cropperContainer.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    if (cropper) {
      cropper.setDragMode("move");
    }
  }
});

cropperContainer.addEventListener("mouseup", (e) => {
  if (e.button === 1) {
    if (cropper) {
      cropper.setDragMode("crop");
    }
  }
});

/* ******************************************** */

let isCtrlPressed = false;

// Detectar cuando se presiona la tecla Ctrl
document.addEventListener("keydown", (e) => {
  if (e.key === "Control") {
    isCtrlPressed = true;
    if (cropper) {
      cropper.setDragMode("move"); // Cambiar a modo de mover la imagen
    }
  }
});

// Detectar cuando se suelta la tecla Ctrl
document.addEventListener("keyup", (e) => {
  if (e.key === "Control") {
    isCtrlPressed = false;
    if (cropper) {
      cropper.setDragMode("crop"); // Volver a modo de selección
    }
  }
});

// Cambiar a mover la imagen solo si Ctrl está presionado y el clic izquierdo se mantiene
cropperContainer.addEventListener("mousedown", (e) => {
  if (e.button === 0 && isCtrlPressed) {
    // Clic izquierdo + Ctrl
    if (cropper) {
      cropper.setDragMode("move");
    }
  }
});

cropperContainer.addEventListener("mouseup", (e) => {
  if (e.button === 0 && isCtrlPressed) {
    // Clic izquierdo + Ctrl
    if (cropper) {
      cropper.setDragMode("crop");
    }
  }
});

/* ******************************************** */
