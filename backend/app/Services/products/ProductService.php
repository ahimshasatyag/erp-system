<?php

namespace App\Services\products;

use App\Repositories\products\ProductRepositoryInterface;
use App\Traits\products\HasFileUploads;
use App\Helpers\products\ProductHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    use HasFileUploads;

    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function createProduct(array $data, $brosurFile = null, $fotoFile = null)
    {
        return DB::transaction(function () use ($data, $brosurFile, $fotoFile) {
            // Check if brand exists, if not create it
            $brandId = $data['id_product_brand'] ?? null;
            if ($brandId) {
                $brand = $this->productRepository->findBrandByName($brandId);
                if (!$brand) {
                    $brandModel = $this->productRepository->createBrand($brandId, $brandId);
                    $data['id_product_brand'] = $brandModel->id_product_brand;
                } else {
                    $data['id_product_brand'] = $brand->id_product_brand;
                }
            }

            // Generate id_product
            $data['id_product'] = ProductHelper::runningNumber('id_product');

            // Handle uploads
            $data['link_brosur'] = $this->uploadBrosur($brosurFile);
            $data['link_foto'] = $this->uploadFoto($fotoFile);

            $data['date_create'] = now();

            // Create product
            $product = $this->productRepository->create($data);

            // Insert options
            if (!empty($data['options']) && is_array($data['options'])) {
                foreach ($data['options'] as $optName) {
                    if (!empty(trim($optName))) {
                        $product->options()->create([
                            'nm_product_opt' => trim($optName),
                            'amount' => 0,
                            'f_cancel' => '0'
                        ]);
                    }
                }
            }

            // Activity Log (Replacing CI Logger)
            Log::info('Product created: ' . $product->code_product, [
                'id_product' => $product->id_product,
                'code_product' => $product->code_product,
                'nm_product' => $product->nm_product,
                'id_product_kategori' => $product->id_product_kategori,
                'id_product_brand' => $product->id_product_brand,
            ]);

            return $product;
        });
    }

    public function updateProduct($id, array $data, $brosurFile = null, $fotoFile = null)
    {
        return DB::transaction(function () use ($id, $data, $brosurFile, $fotoFile) {
            $product = $this->productRepository->findById($id);

            // Handle uploads (replace if new file provided)
            if ($brosurFile) {
                $data['link_brosur'] = $this->uploadBrosur($brosurFile, $product->link_brosur);
            }
            if ($fotoFile) {
                $data['link_foto'] = $this->uploadFoto($fotoFile, $product->link_foto);
            }

            $data['date_update'] = now();

            // Store previous state for logging
            $previousData = $product->toArray();

            // Update product
            $product = $this->productRepository->update($id, $data);

            // Update options
            if (isset($data['options']) && is_array($data['options'])) {
                // Cancel existing
                $product->options()->update(['f_cancel' => '1']);

                // Insert new ones
                foreach ($data['options'] as $optName) {
                    if (!empty(trim($optName))) {
                        $product->options()->create([
                            'nm_product_opt' => trim($optName),
                            'amount' => 0,
                            'f_cancel' => '0'
                        ]);
                    }
                }
            }

            // Activity Log
            Log::info('Product updated: ' . $product->code_product, [
                'previous' => $previousData,
                'new' => $product->toArray()
            ]);

            return $product;
        });
    }
}
