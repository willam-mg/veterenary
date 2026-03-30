<?php
namespace App\Services\Helpers;

class SocketioService
{
    private $path = 'https://socketv2.nacionaladita.com/';
    
    public function emmit() {
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $this->path.'traslado/create');
        curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($crl);
        curl_close($crl);
        return $response;
    }
    
    public function emmitPost($data, $url, $descNotficacion, $urlModulo,  $isArray = false, $idSucursal=null) {
        $url = $this->path.$url;
        $ch = curl_init($url);

        // creating notifications
        $jsonBody = json_encode([
            'data'=> $data,
            'sucursal_id'=> $idSucursal,
            'fase'=> $urlModulo,
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonBody);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonBody)
        ));
        
        $response = curl_exec($ch);
        if(curl_errno($ch)) {
            throw new \Exception('Error: ' . curl_error($ch));
        }
        curl_close($ch);
        return $response;
    }

    public function socketEmitDashboardNotification($url, $data) {
        $url = $this->path.$url;
        $ch = curl_init($url);

        $jsonBody = json_encode([
            'data'=> $data,
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonBody);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonBody)
        ));
        
        $response = curl_exec($ch);
        if(curl_errno($ch)) {
            throw new \Exception('Error: ' . curl_error($ch));
        }
        curl_close($ch);
        return $response;
    }
}