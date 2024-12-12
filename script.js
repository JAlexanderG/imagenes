document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const cropperContainer = document.getElementById("cropper-container");
  const placeholderText = document.getElementById("placeholder-text");
  const image = document.getElementById("image");
  const cropButton = document.getElementById("cropButton");
  const uploadButton = document.getElementById("uploadButton");
  const clearSelectionButton = document.getElementById("clearSelectionButton");
  let cropper;

  // Habilitar Drag and Drop en el contenedor
  cropperContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    cropperContainer.style.borderColor = "green"; // Cambiar estilo para indicar que se puede soltar
  });

  cropperContainer.addEventListener("dragleave", () => {
    cropperContainer.style.borderColor = "#ccc"; // Restaurar estilo
  });

  cropperContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    cropperContainer.style.borderColor = "#ccc"; // Restaurar estilo

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = event.target.result;
        image.style.display = "block";
        placeholderText.style.display = "none";
        cropButton.disabled = false; // Habilitar el botón de recortar
        clearSelectionButton.disabled = false; // Habilitar el botón de borrar selección

        // Inicializar Cropper.js
        if (cropper) {
          cropper.destroy(); // Destruir instancias previas
        }
        cropper = new Cropper(image, {
          aspectRatio: null, // Permitir proporciones libres
          viewMode: 1, // Mantener la imagen visible
          autoCropArea: 0.8,
          dragMode: "move", // Permitir mover la imagen completa
          cropBoxResizable: true,
          cropBoxMovable: true,
          zoomOnWheel: true, // Habilitar zoom con scroll
          toggleDragModeOnDblclick: false, // Evitar cambiar modo con doble clic
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona un archivo de imagen válido.");
    }
  });

  // Abrir selector de archivos al hacer clic en el contenedor
  cropperContainer.addEventListener("click", () => {
    if (!image.src) {
      fileInput.click();
    }
  });

  // Abrir selector de archivos al hacer clic en el botón
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  // Cargar la imagen y mostrarla en el contenedor
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = event.target.result;
        image.style.display = "block";
        placeholderText.style.display = "none";
        cropButton.disabled = false; // Habilitar el botón de recortar
        clearSelectionButton.disabled = false; // Habilitar el botón de borrar selección

        // Inicializar Cropper.js
        if (cropper) {
          cropper.destroy(); // Destruir instancias previas
        }
        cropper = new Cropper(image, {
          aspectRatio: null, // Permitir proporciones libres
          viewMode: 1, // Mantener la imagen visible
          autoCropArea: 0.8,
          dragMode: "move", // Permitir mover la imagen completa
          cropBoxResizable: true,
          cropBoxMovable: true,
          zoomOnWheel: true, // Habilitar zoom con scroll
          toggleDragModeOnDblclick: false, // Evitar cambiar modo con doble clic
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona un archivo de imagen válido.");
    }
  });

  // Botón de recortar la imagen
  cropButton.addEventListener("click", () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      canvas.toBlob((blob) => {
        console.log("Imagen recortada lista:", blob); // Aquí puedes usar el blob
      });
    }
  });

  // Botón de borrar la selección actual
  clearSelectionButton.addEventListener("click", () => {
    console.log("Botón Clear Selection presionado");

    if (cropper) {
      // Obtener datos de la selección
      const cropBoxData = cropper.getCropBoxData(); // Datos del área seleccionada
      const canvasData = cropper.getCanvasData(); // Datos del canvas dentro del Cropper.js

      console.log("Datos de la selección:", cropBoxData);
      console.log("Datos del canvas:", canvasData);

      // Crear un canvas del tamaño de la imagen original
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      console.log("Dimensiones del Canvas:", canvas.width, canvas.height);

      // Dibujar la imagen completa en el canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Calcular coordenadas ajustadas al tamaño real de la imagen
      const scaleX = image.naturalWidth / canvasData.width;
      const scaleY = image.naturalHeight / canvasData.height;

      const left = (cropBoxData.left - canvasData.left) * scaleX;
      const top = (cropBoxData.top - canvasData.top) * scaleY;
      const rectWidth = cropBoxData.width * scaleX;
      const rectHeight = cropBoxData.height * scaleY;

      console.log("Coordenadas ajustadas del rectángulo:", {
        left,
        top,
        rectWidth,
        rectHeight,
      });

      // Dibujar un rectángulo blanco sobre el área seleccionada
      ctx.fillStyle = "white";
      ctx.fillRect(left, top, rectWidth, rectHeight);

      // Convertir el canvas a imagen y actualizar en el Cropper.js
      const modifiedImage = canvas.toDataURL("image/png");
      image.src = modifiedImage;
      cropper.destroy();
      cropper = new Cropper(image, {
        aspectRatio: null,
        viewMode: 1,
        autoCropArea: 0.8,
        dragMode: "move",
        cropBoxResizable: true,
        cropBoxMovable: true,
        zoomOnWheel: true,
        toggleDragModeOnDblclick: false,
      });
    }
  });

  // Función para limpiar la imagen cargada
  function clearImage() {
    if (cropper) {
      cropper.destroy(); // Destruir la instancia de Cropper.js
      cropper = null;
    }
    image.src = "";
    image.style.display = "none";
    placeholderText.style.display = "block";
    cropButton.disabled = true; // Deshabilitar el botón de recortar
    clearSelectionButton.disabled = true; // Deshabilitar el botón de borrar selección
    fileInput.value = ""; // Limpiar el input de archivos
  }
});
