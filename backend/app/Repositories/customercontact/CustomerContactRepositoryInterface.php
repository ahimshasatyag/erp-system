<?php

namespace App\Repositories\customercontact;

interface CustomerContactRepositoryInterface
{
    /**
     * Get paginated customer contacts with search and filter
     */
    public function getDatatable($request);

    /**
     * Create a new customer contact
     */
    public function create(array $data);

    /**
     * Update a customer contact
     */
    public function update($id, array $data);

    /**
     * Delete a customer contact
     */
    public function delete($id);

    /**
     * Find a customer contact by ID
     */
    public function findById($id);

    /**
     * Get list of customers (for dropdown/select options)
     */
    public function getCustomers();
}
