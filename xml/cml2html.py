import xml.etree.ElementTree as ET

# ============================
#   Clase Html
# ============================
class Html:
    def __init__(self, title):
        self.lines = []
        self.title = title

    def start(self):
        self.lines.append('<!DOCTYPE html>')
        self.lines.append('<html lang="es">')
        self.lines.append('<head>')
        self.lines.append('    <meta charset="UTF-8">')
        self.lines.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.lines.append(f'    <title>{self.title}</title>')
        self.lines.append('    <link rel="stylesheet" href="estilo.css">')
        self.lines.append('</head>')
        self.lines.append('<body>')
        self.lines.append(f'<h1>{self.title}</h1>')

    def h2(self, text):
        self.lines.append(f'<h2>{text}</h2>')

    def p(self, text):
        self.lines.append(f'<p>{text}</p>')

    def ul_start(self):
        self.lines.append('<ul>')

    def li(self, text):
        self.lines.append(f'<li>{text}</li>')

    def ul_end(self):
        self.lines.append('</ul>')

    def img(self, src, alt="Imagen"):
        self.lines.append(f'<img src="{src}" alt="{alt}" class="responsive-img">')

    def video(self, src):
        self.lines.append(f'''
        <video class="responsive-video" controls>
            <source src="{src}">
            Tu navegador no soporta vídeo.
        </video>
        ''')

    def end(self):
        self.lines.append('</body>')
        self.lines.append('</html>')

    def save(self, filename):
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(self.lines))


# ============================
#     PROCESAMIENTO XML
# ============================

tree = ET.parse("circuitoEsquema.xml")
root = tree.getroot()

# Namespace
ns = {"u": "http://www.uniovi.es"}

# Crear objeto HTML
html = Html("Información del Circuito")
html.start()

# ======= Datos generales =======
html.h2("Datos generales")

def val(xpath):
    elem = root.find(xpath, ns)
    return elem.text if elem is not None else ""

html.p(f"Nombre: {val('.//u:nombre')}")
html.p(f"Longitud del circuito: {val('.//u:longitudCircuito')} metros")
html.p(f"Anchura media: {val('.//u:anchuraMedia')} metros")
html.p(f"Fecha: {val('.//u:fecha')}")
html.p(f"Hora: {val('.//u:hora')}")
html.p(f"Número de vueltas: {val('.//u:numVueltas')}")
html.p(f"Localidad: {val('.//u:localidad')}")
html.p(f"País: {val('.//u:pais')}")
html.p(f"Patrocinador: {val('.//u:nombrePatrocinador')}")

# ======= Referencias =======
html.h2("Referencias")
refs = root.findall(".//u:referencias/u:referencia", ns)
html.ul_start()
for r in refs:
    html.li(r.text)
html.ul_end()

# ======= Galería de fotos =======
html.h2("Galería de Fotos")
fotos = root.findall(".//u:galeriaFotos/u:foto", ns)
for f in fotos:
    html.img(f.text, alt="Foto del circuito")

# ======= Vídeos =======
html.h2("Vídeos")
videos = root.findall(".//u:galeriaVideos/u:video", ns)
for v in videos:
    html.video(v.text)

# ======= Ganador =======
html.h2("Ganador")
ganador = root.find(".//u:ganador", ns)
if ganador is not None:
    nombre = ganador.find("u:nombrePiloto", ns).text
    tiempo = ganador.find("u:tiempo", ns).text
    html.p(f"Ganador: {nombre}")
    html.p(f"Tiempo: {tiempo}")

# ======= Clasificación =======
html.h2("Clasificación")
clasif = root.find(".//u:clasificacion", ns)
if clasif is not None:
    html.ul_start()
    html.li(f"1º {clasif.find('u:primero', ns).text}")
    html.li(f"2º {clasif.find('u:segundo', ns).text}")
    html.li(f"3º {clasif.find('u:tercero', ns).text}")
    html.ul_end()

# ====== Finalizar y guardar ======
html.end()
html.save("InfoCircuito.html")

print("✔ Archivo InfoCircuito.html generado correctamente.")
