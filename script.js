// Navegación entre las 4 pantallas (Inicio, Escáner, Clima, Puntos)
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".tab-view");

function irAPantalla(targetId) {
  navButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-view") === targetId));
  views.forEach((v) => v.classList.toggle("active", v.id === targetId));
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    irAPantalla(btn.getAttribute("data-view"));
  });
});

document.querySelectorAll("[data-jump]").forEach((card) => {
  card.addEventListener("click", () => {
    irAPantalla(card.getAttribute("data-jump"));
  });
});

// PANTALLA 1: CONSEJOS AGRÍCOLAS PARA CARLOS
const consejosCarlos = [
  {
    titulo: "Riego matutino para mayor absorción",
    texto: "Riega tus cultivos antes de las 8:30 a.m. para reducir la evaporación por el calor del valle y mantener las raíces frescas durante el día."
  },
  {
    titulo: "Revisión preventiva de hojas",
    texto: "Inspecciona el envés de las hojas cada 3 días para detectar a tiempo manchas, mordeduras o señales tempranas de plagas."
  },
  {
    titulo: "Fertilización foliar segura",
    texto: "Aplica fertilizantes foliares en horas frescas sin viento fuerte ni sol directo para mejorar la absorción del cultivo."
  }
];

let consejoActual = 0;
const consejoTitulo = document.getElementById("consejo-titulo");
const consejoTexto = document.getElementById("consejo-texto");
const btnCambiarConsejo = document.getElementById("btn-cambiar-consejo");
const tipRows = document.querySelectorAll(".tip-row");

function mostrarConsejo(index) {
  consejoActual = ((index % consejosCarlos.length) + consejosCarlos.length) % consejosCarlos.length;
  const item = consejosCarlos[consejoActual];
  consejoTitulo.textContent = item.titulo;
  consejoTexto.textContent = item.texto;
  tipRows.forEach((row, i) => row.classList.toggle("active", i === consejoActual));
}

btnCambiarConsejo.addEventListener("click", () => mostrarConsejo(consejoActual + 1));

tipRows.forEach((row) => {
  row.addEventListener("click", () => {
    mostrarConsejo(Number(row.getAttribute("data-tip-index")));
  });
});

// PANTALLA 2: CÁMARA REAL Y DIAGNÓSTICO FITOSANITARIO
const btnAbrirCamara = document.getElementById("btn-abrir-camara");
const btnCapturar = document.getElementById("btn-capturar");
const inputFoto = document.getElementById("input-foto");
const video = document.getElementById("camera-video");
const photoPreview = document.getElementById("photo-preview");
const placeholder = document.getElementById("camera-placeholder");
const scanLaser = document.getElementById("scan-laser");

const diagBadge = document.getElementById("diag-badge");
const diagConfianza = document.getElementById("diag-confianza");
const diagTitulo = document.getElementById("diag-titulo");
const diagDetalle = document.getElementById("diag-detalle");
const diagTratamiento = document.getElementById("diag-tratamiento");

let mediaStream = null;

const diagnosticosDemo = [
  {
    titulo: "Mancha foliar temprana (Cercospora)",
    confianza: "94% precisión",
    detalle: "Lesiones cloróticas iniciales en bordes foliares asociadas a humedad alta.",
    tratamiento: "Tratamiento sugerido: Retirar hojas muy afectadas, mejorar aireación y aplicar fungicida orgánico a base de cobre o extracto de neem."
  },
  {
    titulo: "Deficiencia leve de nitrógeno",
    confianza: "91% precisión",
    detalle: "Tonalidad verde pálido uniforme en hojas bajas por lavado de nutrientes.",
    tratamiento: "Tratamiento sugerido: Aplicar abono foliar orgánico rico en nitrógeno temprano por la mañana."
  }
];
let diagIndex = 0;

btnAbrirCamara.addEventListener("click", async () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    video.style.display = "none";
    placeholder.style.display = "block";
    btnAbrirCamara.innerHTML = '<i class="fa-solid fa-camera"></i> Abrir cámara';
    btnCapturar.disabled = true;
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = mediaStream;
    video.style.display = "block";
    photoPreview.style.display = "none";
    placeholder.style.display = "none";
    btnAbrirCamara.innerHTML = '<i class="fa-solid fa-stop"></i> Cerrar cámara';
    btnCapturar.disabled = false;
  } catch (err) {
    alert("No se pudo abrir la cámara directamente (verifica permisos del navegador). También puedes usar 'Subir fotografía desde galería'.");
  }
});

inputFoto.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    btnAbrirCamara.innerHTML = '<i class="fa-solid fa-camera"></i> Abrir cámara';
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    photoPreview.src = ev.target.result;
    photoPreview.style.display = "block";
    video.style.display = "none";
    placeholder.style.display = "none";
    btnCapturar.disabled = false;
  };
  reader.readAsDataURL(file);
});

btnCapturar.addEventListener("click", () => {
  scanLaser.classList.add("scanning");
  diagBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analizando...';

  setTimeout(() => {
    scanLaser.classList.remove("scanning");
    const item = diagnosticosDemo[diagIndex % diagnosticosDemo.length];
    diagIndex++;

    diagBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completado';
    diagConfianza.textContent = item.confianza;
    diagTitulo.textContent = item.titulo;
    diagDetalle.textContent = item.detalle;
    diagTratamiento.textContent = item.tratamiento;
    diagTratamiento.hidden = false;
  }, 1300);
});

// PANTALLA 3: CLIMA DINÁMICO (SOLEADO, NUBLADO, LLUVIA)
const weatherData = {
  soleado: {
    temp: "33°C",
    condition: "Cielo despejado",
    feels: "Sensación térmica 35°C",
    humedad: '<i class="fa-solid fa-droplet"></i> 58%',
    viento: '<i class="fa-solid fa-wind"></i> 14 km/h',
    lluvia: '<i class="fa-solid fa-umbrella"></i> 10%',
    iconHtml: '<i class="fa-solid fa-sun"></i>',
    alertTitle: "Recomendación para día soleado",
    alertDesc: "Riega temprano antes de las 8:30 a.m. para evitar evaporación rápida y proteger cultivos jóvenes."
  },
  nublado: {
    temp: "29°C",
    condition: "Parcialmente nublado",
    feels: "Sensación térmica 30°C",
    humedad: '<i class="fa-solid fa-droplet"></i> 72%',
    viento: '<i class="fa-solid fa-wind"></i> 11 km/h',
    lluvia: '<i class="fa-solid fa-umbrella"></i> 35%',
    iconHtml: '<i class="fa-solid fa-cloud-sun"></i>',
    alertTitle: "Condición ideal para fertilización",
    alertDesc: "Temperatura moderada sin radiación directa; buen momento para aplicaciones foliares y poda."
  },
  lluvia: {
    temp: "26°C",
    condition: "Lluvia moderada",
    feels: "Sensación térmica 26°C",
    humedad: '<i class="fa-solid fa-droplet"></i> 89%',
    viento: '<i class="fa-solid fa-wind"></i> 18 km/h',
    lluvia: '<i class="fa-solid fa-umbrella"></i> 85%',
    iconHtml: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    alertTitle: "Alerta de lluvia en Villanueva",
    alertDesc: "Suspende riego y fumigación foliar para evitar lavado del producto. Revisa drenajes en parcelas bajas."
  }
};

const weatherStage = document.getElementById("weather-stage");
const weatherChips = document.querySelectorAll(".weather-chip");
const dayCards = document.querySelectorAll(".day-card");

function setWeather(tipo) {
  const data = weatherData[tipo];
  if (!data) return;

  weatherStage.className = `weather-stage ${tipo}`;
  document.getElementById("weather-temp").textContent = data.temp;
  document.getElementById("weather-condition").textContent = data.condition;
  document.getElementById("weather-feels").textContent = data.feels;
  document.getElementById("metric-humedad").innerHTML = data.humedad;
  document.getElementById("metric-viento").innerHTML = data.viento;
  document.getElementById("metric-lluvia").innerHTML = data.lluvia;
  document.getElementById("weather-alert-icon").innerHTML = data.iconHtml;
  document.getElementById("weather-alert-title").textContent = data.alertTitle;
  document.getElementById("weather-alert-desc").textContent = data.alertDesc;

  weatherChips.forEach((c) => c.classList.toggle("active", c.getAttribute("data-weather") === tipo));
}

weatherChips.forEach((chip) => {
  chip.addEventListener("click", () => setWeather(chip.getAttribute("data-weather")));
});

dayCards.forEach((card) => {
  card.addEventListener("click", () => {
    dayCards.forEach((d) => d.classList.remove("active"));
    card.classList.add("active");
    setWeather(card.getAttribute("data-weather"));
  });
});

// PANTALLA 4: PUNTOS DE VENTA / MAPA INTERACTIVO Y GOOGLE MAPS
const agroservicios = [
  {
    name: "Agroservicio Central Villanueva",
    meta: '<i class="fa-solid fa-route"></i> 1.8 km · ~6 min · Abierto',
    items: "Fertilizantes foliares, bioestimulantes, semillas certificadas y control orgánico.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Agroservicio+Villanueva+Cortes+Honduras",
    phone: "tel:+50426700000",
    path: "M 58 135 Q 140 112 212 52"
  },
  {
    name: "Distribuidora Campo Verde",
    meta: '<i class="fa-solid fa-route"></i> 3.4 km · ~10 min · Abierto',
    items: "Bombas de mochila, fungicidas orgánicos, abono granular y asesoría en campo.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Distribuidora+Agricola+Villanueva+Cortes",
    phone: "tel:+50426700001",
    path: "M 58 135 Q 158 136 248 110"
  },
  {
    name: "Insumos Agrícolas AgroSula",
    meta: '<i class="fa-solid fa-route"></i> 2.5 km · ~8 min · Abierto',
    items: "Sustratos, mallas sombra, sistemas de riego por goteo y biofertilizantes.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Insumos+Agricolas+Villanueva+Cortes+Honduras",
    phone: "tel:+50426700002",
    path: "M 58 135 Q 82 88 114 66"
  }
];

const mapMarkers = document.querySelectorAll(".map-marker");
const storeRows = document.querySelectorAll(".store-row");
const routeLine = document.getElementById("route-line");

function selectStore(index) {
  const store = agroservicios[index];
  if (!store) return;

  document.getElementById("store-name").textContent = store.name;
  document.getElementById("store-meta").innerHTML = store.meta;
  document.getElementById("store-items").textContent = store.items;
  document.getElementById("btn-google-maps").href = store.mapsUrl;
  document.getElementById("btn-llamar").href = store.phone;
  routeLine.setAttribute("d", store.path);

  mapMarkers.forEach((m) => m.classList.toggle("active", Number(m.getAttribute("data-store")) === index));
  storeRows.forEach((r) => r.classList.toggle("active", Number(r.getAttribute("data-store")) === index));
}

mapMarkers.forEach((marker) => {
  marker.addEventListener("click", () => selectStore(Number(marker.getAttribute("data-store"))));
});

storeRows.forEach((row) => {
  row.addEventListener("click", () => selectStore(Number(row.getAttribute("data-store"))));
});