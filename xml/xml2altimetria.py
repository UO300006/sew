import xml.etree.ElementTree as ET

# ====== Cargar XML con namespace ======
tree = ET.parse("circuitoEsquema.xml")
root = tree.getroot()

# Namespace del XML
ns = {"u": "http://www.uniovi.es"}


# ====== Extraer puntos ======
puntos = []

# 1. Punto origen
p_origen = root.find(".//u:puntoOrigen/u:punto", ns)
puntos.append(float(p_origen.find("u:altitud", ns).text))

# 2. Puntos anónimos
for pAnon in root.findall(".//u:puntosAnonimos/u:puntoAnonimo", ns):
    for p in pAnon.findall(".//u:punto", ns):
        alt = float(p.find("u:altitud", ns).text)
        puntos.append(alt)


# ====== Generar SVG ======
width = 1200
height = 300
max_alt = max(puntos)
min_alt = min(puntos)

# Escalas
escala_x = width / (len(puntos) - 1)
escala_y = (height - 50) / (max_alt - min_alt)

svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300">',
    '<polyline fill="none" stroke="red" stroke-width="2" points="'
]

pts_svg = []

for i, alt in enumerate(puntos):
    x = i * escala_x
    y = height - ((alt - min_alt) * escala_y)
    pts_svg.append(f"{x},{y}")

svg.append(" ".join(pts_svg) + '" />')
svg.append("</svg>")

with open("altimetria.svg", "w", encoding="utf-8") as f:
    f.write("\n".join(svg))

print("✔ altimetria.svg generado correctamente")
