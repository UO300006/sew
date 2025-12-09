<?php
session_start();

class Clasificacion {
    private $documento;

    public function __construct() {
        // Inicializar el atributo documento con la ruta al archivo circuitoEsquema.xml
        $this->documento = './xml/circuitoEsquema.xml';
    }

    // Método para cargar los datos del archivo XML como cadena y convertirlo en objeto
    public function consultar() {
        if (file_exists($this->documento)) {
            $datos = file_get_contents($this->documento); // Leer el archivo como cadena
            if ($datos === false) {
                return null;
            }
            return new SimpleXMLElement($datos); // Convertir la cadena en un objeto SimpleXMLElement
        } else {
            return null;
        }
    }
}

// Crear una nueva instancia de Clasificacion
$clasificacion = new Clasificacion();
$datos = $clasificacion->consultar();

if ($datos == null) {
    echo "<h3>Error: No se pudo cargar el archivo XML</h3>";
    exit;
}

// Extraer información del ganador y la clasificación del mundial
$ganador = (string) $datos->ganador->nombrePiloto;
$tiempo = (string) $datos->ganador->tiempo;
$clasificacionMundial = [
    'Primero' => (string) $datos->clasificacion->primero,
    'Segundo' => (string) $datos->clasificacion->segundo,
    'Tercero' => (string) $datos->clasificacion->tercero,
];
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-clasificaciones</title>
    <meta name="author" content="Iyán Díaz Pereda" />
    <meta name="description" content="Clasificaciones de MotoGP" />
    <meta name="keywords" content="moto, gp, motogp" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="multimedia/big.ico" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>
    <main>
        <header>
            <h1>MotoGP Desktop</h1>
            <nav>
                <a href="index.html" title="Inicio del proyecto MotoGP-Desktop">Inicio</a>
                <a href="piloto.html" title="Información del piloto">Piloto</a>
                <a href="circuito.html" title="Información del circuito">Circuito</a>
                <a href="meteorologia.html" title="Información de la meteorologia">Meteorología</a>
                <a href="clasificaciones.php" class="active" title="Información de las clasificaciones">Clasificaciones</a>
                <a href="juegos.html" title="Información de juegos">Juegos</a>
                <a href="ayuda.html" title="Ayuda del proyecto MotoGp-Desktopo">Ayuda</a>
            </nav>
        </header>

        <p>Estás en: <a href="index.html">Inicio</a> | <strong>Clasificaciones</strong></p>
        <h2>Clasificaciones de MotoGP-Desktop</h2>

        <!-- Mostrar el ganador de la carrera -->
        <section>
            <h3>Ganador de la carrera</h3>
            <p><strong>Nombre:</strong> <?= $ganador ?></p>
            <p><strong>Tiempo empleado:</strong> <?= $tiempo ?></p>
        </section>

        <!-- Mostrar la clasificación del mundial -->
        <section>
            <h3>Clasificación del Mundial</h3>
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($clasificacionMundial as $posicion => $nombre): ?>
                        <tr>
                            <td><?= $posicion ?></td>
                            <td><?= $nombre ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>
    </main>
</body>

</html>