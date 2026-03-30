<?php
namespace App\Services\Helpers;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use Illuminate\Support\Facades\File;

class FileUploadService
{
    private $public_path = 'app/public/uploads/';
    protected ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }






    /**
     * Save an image in the storage and return the saved path.
     *
     * This method is used to save signatures or images uploaded as base64.
     *
     * @param string $image         Imagen codificated in base64
     * @param int $idNumber         ID user
     * @param string $tagName       Type entitity (ej. 'admin', 'client', etc.)
     * @param string $nameValueFoto Optional value only for update entity
     * @return string               Path of the saved image
     *
     * @example
     * ```php
     * if ($dataSignature) {
     *     $admin->payer_signature_src = $this->fileUploadService->saveImage($dataSignature, $admin->id, 'admin');
     *     $admin->save();
     * }
     * ```
     */
    public function saveImage($image, $idNumber, $tagName, $nameValueFoto = null)
    {
        try {
            if ($nameValueFoto) {
                $imageExist = storage_path($this->public_path . $nameValueFoto);
                if (file_exists($imageExist)) {
                    unlink($imageExist);
                    @unlink(storage_path($this->public_path . 'thumbnail/' . $nameValueFoto));
                    @unlink(storage_path($this->public_path . 'thumbnail-small/' . $nameValueFoto));
                }
            }

            $imageName = $tagName . '_' . $idNumber . date('ymdHis').'.jpg';
            $path = storage_path($this->public_path . $imageName);

            // Procesa imagen
            $this->imageManager->read($image)->save($path);

            // Thumbnail grande
            $this->imageManager->read($path)
                ->scale(width: 200, height: 275)
                ->save(storage_path($this->public_path . 'thumbnail/' . $imageName));

            // Thumbnail pequeño
            $this->imageManager->read($path)
                ->scale(width: 50, height: 50)
                ->save(storage_path($this->public_path . 'thumbnail-small/' . $imageName));

            return $imageName;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function savePdf($file, $idNumber, $tagName, $nameValueFoto = null)
    {
        try {
            if ($nameValueFoto) {
                $imageExist = storage_path($this->public_path . $nameValueFoto);
                if ($nameValueFoto && file_exists($imageExist)) {
                    unlink($imageExist);
                }
            }
            $imageName = $tagName . '_' . $idNumber . date('ymdHis').'.pdf';
            $path = 'uploads/' . $imageName;
            // $path = storage_path('uploads/' . $imageName);

            $pdfData = preg_replace('/^data:application\/pdf;base64,/', '', $file);
            $pdfData = base64_decode($pdfData);
            // $fileData = base64_decode($file);
            Storage::disk('public')->put($path, $pdfData);
            
            return $imageName;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveVideo($video, $idNumber, $tagName, $nameValueVideo = null)
    {
        try {
            // Verifica y elimina el video anterior si existe
            if ($nameValueVideo) {
                $videoExist = storage_path($this->public_path . $nameValueVideo);
                if ($nameValueVideo && file_exists($videoExist)) {
                    unlink($videoExist);
                }
            }
            
            // Genera un nuevo nombre para el video
            $videoName = $tagName . '_' . $idNumber . date('ymdHis') . '.mp4';
            $path = storage_path($this->public_path . $videoName);

            // Guarda el video
            file_put_contents($path, file_get_contents($video));

            return $videoName;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function readJson($pathFile)
    {
        $json = File::get(resource_path('json/'.$pathFile));
        return json_decode($json, true);
    }
}