<?php
  // proxypac.php
  header('Content-Type: application/json; charset=utf-8');

  $raw = file_get_contents('php://input');
  if (!$raw) {
      http_response_code(400);
      echo json_encode(['error' => 'No se recibió ningún contenido.']);
      exit;
  }

  $dataIn = json_decode($raw, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
      http_response_code(400);
      echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
      exit;
  }

  if (empty($dataIn['filtro']['persNroDocumento'])) {
      http_response_code(422);
      echo json_encode(['error' => 'No se encontró persNroDocumento en el filtro.']);
      exit;
  }
  $documento = $dataIn['filtro']['persNroDocumento'];

  $payload = [
      'aplicacion' => 'SalaEspera',
      'operacion'   => 'obtenerPacientesEspera',
      'apiKey'      => '0dedb690-9ed4-407f-b95b-b945373de84d',
      'filtro'      => ['persNroDocumento' => $documento]
  ];
  $jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE);

  $mUrl = 'http://australqa.markey.com.ar/APIMarkeyV2/obtener';
  $curl = curl_init();

  curl_setopt_array($curl, [
      CURLOPT_URL            => $mUrl,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_SSL_VERIFYPEER => false,
      CURLOPT_TIMEOUT        => 30,
      CURLOPT_POST           => true,
      CURLOPT_POSTFIELDS     => $jsonPayload,
      CURLOPT_HTTPHEADER     => [
          'Content-Type: application/json',
          'Token: UZN9291llgxWJ93uzilrmantG6t20r0v8kwrihYXmZl1EO8irdhT0gFK0tFAlv3m',
          'Content-Length: ' . strlen($jsonPayload)
      ],
  ]);

  $response = curl_exec($curl);
  $curlErr  = curl_errno($curl) ? curl_error($curl) : null;
  $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  curl_close($curl);

  if ($curlErr) {
      http_response_code(502);
      echo json_encode(['error' => 'Error cURL: ' . $curlErr]);
      exit;
  }

  if ($httpCode < 200 || $httpCode >= 300) {
      $trimmed = ltrim($response);
      if (strpos($trimmed, '<Response') === 0) {
          libxml_use_internal_errors(true);
          $xml = simplexml_load_string($response);
          if ($xml !== false) {
              $mensaje = (string) $xml->Mensaje;
              http_response_code(200);
              echo json_encode(['error' => $mensaje]);
              exit;
          }
      }
     
      http_response_code($httpCode);
      echo json_encode([
          'error'    => "La API externa devolvió código HTTP $httpCode",
          'response' => $response
      ]);
      exit;
  }
  
  $result = json_decode($response, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    
      $trimmed = ltrim($response);
      if (strpos($trimmed, '<Response') === 0) {
          libxml_use_internal_errors(true);
          $xml = simplexml_load_string($response);
          if ($xml !== false) {
              $mensaje = (string) $xml->Mensaje;
              echo json_encode(['error' => $mensaje]);
              exit;
          }
      }
      http_response_code(500);
      echo json_encode(['error' => 'Error al decodificar JSON: ' . json_last_error_msg()]);
      exit;
  }


  echo json_encode($result);
?>