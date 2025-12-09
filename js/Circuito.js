class Circuito {

    constructor() {
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        const mensaje = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            mensaje.textContent = "Este navegador soporta el API File";
        } else {
            mensaje.textContent = "¡¡¡ Este navegador NO soporta el API File !!!";
        }
        document.body.appendChild(mensaje);
    }

    leerArchivoHTML(event) {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                document.getElementById("contenido").innerHTML = e.target.result;
            };
            lector.readAsText(archivo);
        } else {
            alert("No se ha seleccionado ningún archivo.");
        }
    }

    
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('info-circuito');
  if (!container) return;

  container.innerHTML = '<p>Cargando información del circuito…</p>';

  fetch('InfoCircuito.html')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar InfoCircuito.html: ' + response.status);
      return response.text();
    })
    .then(htmlText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      // Limpia el contenedor
      container.innerHTML = '';

      // Regex para detectar URLs (http/https)
      const urlRegex = /(https?:\/\/[^\s<]+)/g;

      // Reemplaza URLs en nodos de texto por <a>
      function linkifyNode(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        textNodes.forEach(textNode => {
          const text = textNode.nodeValue;
          if (!text || !urlRegex.test(text)) return;

          const frag = document.createDocumentFragment();
          let lastIndex = 0;
          text.replace(urlRegex, (match, url, index) => {
            // append text before the match
            if (index > lastIndex) {
              frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }
            // create link
            const a = document.createElement('a');
            a.href = url;
            a.textContent = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            frag.appendChild(a);
            lastIndex = index + match.length;
            return match;
          });
          // append remaining text
          if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
          }
          // replace original text node
          textNode.parentNode.replaceChild(frag, textNode);
        });
      }

      // Helper: obtiene nodos entre un h2 y el siguiente h2
      function collectUntilNextHeading(startH2) {
        const nodes = [];
        let el = startH2.nextElementSibling;
        while (el && el.tagName !== 'H2') {
          nodes.push(el);
          el = el.nextElementSibling;
        }
        return nodes;
      }

      // Helper: crear sección con título y nodos clonados (y linkify)
      function appendSection(titleText, nodes, className) {
        const section = document.createElement('section');
        if (className) section.className = className;
        const h = document.createElement('h2');
        h.textContent = titleText;
        section.appendChild(h);

        nodes.forEach(n => {
          const clone = n.cloneNode(true);
          linkifyNode(clone);
          section.appendChild(clone);
        });

        container.appendChild(section);
      }

      // Buscar h2s del documento remoto
      const headings = Array.from(doc.querySelectorAll('h2'));

      // Datos generales
      const datosH2 = headings.find(h => /datos generales/i.test(h.textContent));
      if (datosH2) {
        const nodes = collectUntilNextHeading(datosH2);
        appendSection('Datos generales', nodes, 'datos-generales');
      }

      // Referencias (tratamiento para que las URLs dentro de <li> sean clicables)
      const refH2 = headings.find(h => /referencias/i.test(h.textContent));
      if (refH2) {
        const nodes = collectUntilNextHeading(refH2);
        // crear sección manual para tener control y linkificar
        const section = document.createElement('section');
        section.className = 'referencias';
        const h = document.createElement('h2');
        h.textContent = 'Referencias';
        section.appendChild(h);

        nodes.forEach(n => {
          const clone = n.cloneNode(true);
          linkifyNode(clone);
          section.appendChild(clone);
        });

        container.appendChild(section);
      }

      // Galería de Fotos (tratamiento especial para agrupar imágenes)
      const galH2 = headings.find(h => /gal[eé]r/i.test(h.textContent) || /galería/i.test(h.textContent));
      if (galH2) {
        const nodes = collectUntilNextHeading(galH2);
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'gallery';
        nodes.forEach(n => {
          if (n.tagName === 'IMG') {
            const imgClone = n.cloneNode(true);
            galleryDiv.appendChild(imgClone);
          } else {
            const imgs = n.querySelectorAll ? n.querySelectorAll('img') : [];
            imgs.forEach(i => galleryDiv.appendChild(i.cloneNode(true)));
            // linkify any text around images as well
            const clone = n.cloneNode(true);
            linkifyNode(clone);
            // if clone contains more descriptive text, append it
            const textParts = Array.from(clone.childNodes).filter(ch => ch.nodeType !== 1 || ch.tagName !== 'IMG');
            textParts.forEach(tp => galleryDiv.appendChild(tp));
          }
        });
        const section = document.createElement('section');
        section.className = 'galeria-de-fotos';
        const h = document.createElement('h2');
        h.textContent = 'Galería de Fotos';
        section.appendChild(h);
        section.appendChild(galleryDiv);
        container.appendChild(section);
      }

      // Videos
      const vidH2 = headings.find(h => /vídeo|video/i.test(h.textContent));
      if (vidH2) {
        const nodes = collectUntilNextHeading(vidH2);
        appendSection('Vídeos', nodes, 'videos');
      }

      // Ganador
      const winH2 = headings.find(h => /ganador/i.test(h.textContent));
      if (winH2) {
        const nodes = collectUntilNextHeading(winH2);
        appendSection('Ganador', nodes, 'ganador');
      }

      // Clasificación
      const clasH2 = headings.find(h => /clasificaci/i.test(h.textContent));
      if (clasH2) {
        const nodes = collectUntilNextHeading(clasH2);
        appendSection('Clasificación', nodes, 'clasificacion');
      }

      // Si no hay contenido detectado, mostrar mensaje
      if (!container.querySelector('section')) {
        container.innerHTML = '<p>No se encontró información estructurada en InfoCircuito.html.</p>';
      }
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p>Error cargando la información del circuito. Revisa la consola.</p>';
    });
});

class CargadorKML {

    constructor() {
        this.parser = new DOMParser();
    }

    leerArchivoKML(event) {
        const archivo = event.target.files[0];
        if (!archivo) {
            alert("Debe seleccionar un archivo KML.");
            return;
        }

        const lector = new FileReader();

        lector.onload = (e) => {
            const textoKML = e.target.result;

            // Parsear el KML como XML
            const xml = this.parser.parseFromString(textoKML, "text/xml");

            // Extraer coordenadas del primer <coordinates>
            const coordsNodes = xml.getElementsByTagName("coordinates");
            if (coordsNodes.length === 0) {
                alert("El archivo KML no contiene coordenadas.");
                return;
            }

            // coordinates: "long,lat,alt long,lat,alt ..."
            const textoCoords = coordsNodes[0].textContent.trim();
            const puntos = textoCoords.split(/\s+/).map(pair => {
                const [lon, lat] = pair.split(",");
                return [parseFloat(lon), parseFloat(lat)];
            });

            console.log("Coordenadas extraídas:", puntos);

            // Crear GeoJSON para Mapbox
            const geojson = {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: puntos
                }
            };

            // Insertar capa en el mapa
            this.insertarCapaKML(window.mapaCircuito, geojson);
        };

        lector.readAsText(archivo);
    }

    insertarCapaKML(map, geojson) {

    if (!map) {
        alert("El mapa no está inicializado todavía.");
        return;
    }

    // Limpieza si ya existía una capa previa
    if (map.getSource("trazado-kml")) {
        if (map.getLayer("linea-kml")) map.removeLayer("linea-kml");
        map.removeSource("trazado-kml");
    }

    // 1) Crear la fuente con el GeoJSON
    map.addSource("trazado-kml", {
        type: "geojson",
        data: geojson
    });

    // 2) Crear la polilínea
    map.addLayer({
        id: "linea-kml",
        type: "line",
        source: "trazado-kml",
        paint: {
            "line-width": 4,
            "line-color": "#ff0000"
        }
    });

    // 3) MARCADOR en el primer punto
    const origen = geojson.geometry.coordinates[0];

    new mapboxgl.Marker({ color: "blue" })
        .setLngLat(origen)
        .setPopup(new mapboxgl.Popup().setText("Punto origen del circuito"))
        .addTo(map);

    // 4) Ajustar el mapa a la extensión del circuito
    const bounds = new mapboxgl.LngLatBounds();
    geojson.geometry.coordinates.forEach(coord => bounds.extend(coord));

    map.fitBounds(bounds, { padding: 50 });

    console.log("Capa del circuito añadida correctamente.");
}

}

document.addEventListener("DOMContentLoaded", () => {
  mapboxgl.accessToken = "pk.eyJ1IjoidW8zMDAwMDYiLCJhIjoiY21peHAybTR5MDhiczNlczR3ZDExd3N1cCJ9.0Fx25SKH0qCP5tpHNNzmAw";

  const divMapa = document.querySelector("main > div");

  // Crear el mapa global
  window.mapaCircuito = new mapboxgl.Map({
      container: divMapa, // Usamos el elemento directamente
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-3.7038, 40.4168],
      zoom: 5
  });
});

class CargadorSVG {
  constructor() {}

  leerArchivoSVG(event) {
      const archivo = event.target.files[0];
      if (!archivo) {
          alert("Debe seleccionar un archivo SVG.");
          return;
      }

      const lector = new FileReader();
      lector.onload = (e) => {
          const contenidoSVG = e.target.result;
          this.insertarSVG(contenidoSVG);
      };

      lector.readAsText(archivo);
  }

  insertarSVG(contenidoSVG) {
      // Selecciona el segundo <section> en el documento
      const seccionAltimetria = document.querySelectorAll("section")[1];
      if (!seccionAltimetria) {
          console.error("No se encontró la sección para el gráfico de altimetría.");
          return;
      }

      seccionAltimetria.innerHTML = contenidoSVG;
  }
}

