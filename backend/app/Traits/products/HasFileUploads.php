<?php

namespace App\Traits\products;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasFileUploads
{
    /**
     * Upload a brochure file.
     *
     * @param UploadedFile|null $file
     * @param string|null $existingFile
     * @return string|null
     */
    public function uploadBrosur(?UploadedFile $file, ?string $existingFile = null): ?string
    {
        if (!$file) {
            return $existingFile;
        }

        // Equivalent to CodeIgniter's upload path './assets/brosur/'
        // In Laravel, best practice is to use the storage disk, e.g., 'public' disk
        $filename = $file->hashName();
        $file->storeAs('brosur', $filename, 'public');

        if ($existingFile) {
            Storage::disk('public')->delete('brosur/' . $existingFile);
        }

        return $filename;
    }

    /**
     * Upload a photo file.
     *
     * @param UploadedFile|null $file
     * @param string|null $existingFile
     * @return string|null
     */
    public function uploadFoto(?UploadedFile $file, ?string $existingFile = null): ?string
    {
        if (!$file) {
            return $existingFile;
        }

        // Equivalent to CodeIgniter's upload path './assets/upload/'
        $filename = $file->hashName();
        $file->storeAs('upload', $filename, 'public');

        if ($existingFile) {
            Storage::disk('public')->delete('upload/' . $existingFile);
        }

        return $filename;
    }
}
