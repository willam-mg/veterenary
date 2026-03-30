<?php

namespace Database\Factories;

// use App\Models\AccountHolder;
// use App\Models\AccountHolderSignature;
// use Illuminate\Database\Eloquent\Factories\Factory;
// use Illuminate\Support\Facades\Hash;
// // use Illuminate\Support\Facades\Storage;
// use Illuminate\Http\File;
// // use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Str;
// use Intervention\Image\Facades\Image;
// use Intervention\Image\ImageManager;
use App\Models\AccountHolderSignature;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;
use Intervention\Image\Encoders\JpegEncoder;
use Illuminate\Support\Facades\File;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AccountHolderSignatureFactory extends Factory
{
    protected $model = AccountHolderSignature::class;

    public function definition()
    {
        // bloque para leer un directorio de imagenes y copiarlos al storage
        // $sourcePath = resource_path('images/signatures'); // ruta absoluta a la carpeta
        // $targetPath = 'uploads'; // dentro del disco 'public'

        // // Obtener todos los archivos de imagen
        // $images = File::files($sourcePath);

        // $imageFound = array_filter($images, function ($image) {
            
        // })
        // foreach ($images as $image) {
        //     // Obtener el nombre original del archivo
        //     $originalName = $image->getFilename();
        
        //     // Crear un nombre único si deseas evitar conflictos
        //     $newName = Str::random(10) . '_' . $originalName;
        
        //     // Copiar el archivo al disco 'public'
        //     Storage::disk('public')->putFileAs($targetPath, $image, $newName);
        
        //     // Mostrar o guardar el nombre nuevo
        //     // echo "Copiado: $newName\n";
        
        //     // Aquí podrías crear un registro en la base de datos, por ejemplo:
        //     // \App\Models\AccountHolderSignature::create([
        //     //     'signature_src' => $newName,
        //     // ]);
        //     return [
        //         'signature_src' => $newName,
        //     ];
        // }
        static $imageFiles = null;
        if ($imageFiles === null) {
            $sourceDir = resource_path('images/signatures');
            $imageFiles = collect(File::files($sourceDir));
        }

        // Elegir imagen aleatoria
        $randomImage = $imageFiles->random();
        $originalName = $randomImage->getFilename();
        $newName = Str::random(10) . '_' . $originalName;
        $targetPath = 'uploads/' . $newName;

        // Copiar al disco 'public' si no existe
        if (!Storage::disk('public')->exists($targetPath)) {
            Storage::disk('public')->putFileAs('uploads', $randomImage, $newName);
        }

        return [
            'signature_src' => $newName,
        ];

        // Bloque de codigo generar imagenes de firma
        // $filename = Str::random(10) . '.jpg';
        // $path = 'uploads/' . $filename;

        // $manager = new ImageManager(new Driver());
        // $image = $manager->create(640, 480, '#cccccc')
        //     ->text('Firma', 320, 240, function ($font) {
        //         $font->file(resource_path('fonts/ARIAL.TTF'));
        //         $font->size(48);
        //         $font->color('#000000');
        //         $font->align('center');
        //         $font->valign('middle');
        //     });

        // Storage::disk('public')->put($path, (string) $image->encode(new JpegEncoder()));

        // return [
        //     'signature_src' => $filename,
        // ];
    }

    /**
     * Indicate that the admin member has a specific photo.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withPhoto($photoUrl)
    {
        return $this->state([
            'signature_src' => $photoUrl,
        ]);
    }
}
