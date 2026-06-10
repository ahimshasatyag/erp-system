<?php

namespace App\Models\customercontact;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\customers\Customer; // Assuming this exists based on standard conventions in this app

class CustomerContact extends Model
{
    use HasFactory;

    protected $table = 'm_customers_contact';
    protected $primaryKey = 'id_customers_contact';
    
    // As observed in legacy Cform/Mmaster, no created_at/updated_at was explicitly used 
    // unless they use date_create/date_update like other tables, but safe to set false or custom names.
    // Assuming false based on lack of usage in Mmaster.php inserts.
    public $timestamps = false;

    protected $fillable = [
        'id_customers',
        'nm_customers_contact',
        'customers_contact_posisi',
        'customers_contact_phone',
        'customers_contact_mobile',
        'customers_contact_email',
        'customers_contact_address',
    ];

    /**
     * Get the customer associated with the contact.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'id_customers', 'id_customers');
    }
}
