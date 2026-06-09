<?php

namespace App\Actions\customers;

use App\Models\customers\Customer;

class DeleteCustomerAction
{
    public function execute(string $idCustomers): bool
    {
        $customer = Customer::find($idCustomers);
        if (!$customer) {
            return false;
        }

        // Delete contacts first (if cascade isn't defined on DB level)
        $customer->contacts()->delete();
        
        return $customer->delete();
    }
}
