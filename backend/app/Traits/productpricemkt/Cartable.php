<?php

namespace App\Traits\productpricemkt;

use Illuminate\Support\Facades\Session;

trait Cartable
{
    /**
     * Get the current cart from session.
     */
    public function getCart()
    {
        return Session::get('keranjang', []);
    }

    /**
     * Add item to session cart.
     */
    public function addItemToCart($id_product, $qty = 1)
    {
        $cart = $this->getCart();
        $key = array_search($id_product, array_column($cart, 'id_product'));

        if ($key !== false) {
            $cart[$key]['qty'] += $qty;
        } else {
            $cart[] = [
                'id_product' => $id_product,
                'qty' => $qty,
            ];
        }

        Session::put('keranjang', $cart);
        
        return $cart;
    }
}
