<?php
session_start();

// Definición de una clase
class Cronometro
{
    private $tiempoInicio;
    private $tiempoFin;
    private $tiempoTranscurrido;

    public function __construct()
    {
        $this->tiempoInicio = 0;
        $this->tiempoFin = 0;
        $this->tiempoTranscurrido = 0;
    }

    // Método para iniciar el cronómetro
    public function arrancar()
    {
        $this->tiempoInicio = microtime(true);
    }

    // Método para detener el cronómetro
    public function parar()
    {
        $this->tiempoFin = microtime(true);
        if (isset($this->tiempoInicio) && isset($this->tiempoFin)) {
            $this->tiempoTranscurrido = $this->tiempoFin - $this->tiempoInicio;
        }
    }

    // Método para obtener el tiempo transcurrido en formato mm:ss.s
    public function mostrar()
    {
        $minutos = floor($this->tiempoTranscurrido / 60);
        $segundos = floor($this->tiempoTranscurrido % 60);
        $decimas = floor(($this->tiempoTranscurrido - floor($this->tiempoTranscurrido)) * 10);
        return sprintf("%02d:%02d.%d", $minutos, $segundos, $decimas);
    }
}

// Inicializar el cronómetro en la sesión
if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = new Cronometro();
}

$cronometro = $_SESSION['cronometro'];
$tiempoMostrado = ""; // Variable para mostrar el tiempo transcurrido

// Procesar las acciones del formulario
if (count($_POST)>0) {
    if (isset($_POST['arrancar'])) {
        $cronometro->arrancar();
    } elseif (isset($_POST['parar'])) {
        $cronometro->parar();
    } elseif (isset($_POST['mostrar'])) {
        $tiempoMostrado = $cronometro->mostrar();
    }
}
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Cronómetro</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="multimedia/big.ico" />
</head>

<body>
    <header>
        <h1>MotoGP Desktop</h1>
        <nav>
            <a href="index.html" title="Inicio del proyecto MotoGP-Desktop">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorologia">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
            <a href="juegos.html" class="active" title="Información de juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda del proyecto MotoGp-Desktopo">Ayuda</a>
        </nav>
    </header>
    <main>
        <form action="#" method="post">
            <input type="submit" name="arrancar" value="Arrancar" />
            <input type="submit" name="parar" value="Parar" />
            <input type="submit" name="mostrar" value="Mostrar" />
        </form>

        <p>Tiempo transcurrido: <?= $tiempoMostrado ?> </p>
    </main>
</body>

</html>