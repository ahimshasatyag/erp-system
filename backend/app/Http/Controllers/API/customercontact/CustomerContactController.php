<?php

namespace App\Http\Controllers\API\customercontact;

use App\Http\Controllers\Controller;
use App\Http\Requests\customercontact\StoreCustomerContactRequest;
use App\Http\Requests\customercontact\UpdateCustomerContactRequest;
use App\Http\Resources\customercontact\CustomerContactResource;
use App\Http\Resources\customercontact\CustomerContactCollection;
use App\Services\customercontact\CustomerContactService;
use App\Models\customercontact\CustomerContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CustomerContactController extends Controller
{
    protected $service;

    public function __construct(CustomerContactService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the customer contacts.
     */
    public function index(Request $request)
    {
        // Policy check
        if (!Gate::check('viewAny', [CustomerContact::class])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contacts = $this->service->getDatatable($request);
        return new CustomerContactCollection($contacts);
    }

    /**
     * Store a newly created customer contact in storage.
     */
    public function store(StoreCustomerContactRequest $request)
    {
        if (!Gate::check('create', [CustomerContact::class])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contact = $this->service->createCustomerContact($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer contact created successfully.',
            'data' => new CustomerContactResource($contact),
        ], 201);
    }

    /**
     * Display the specified customer contact.
     */
    public function show($id)
    {
        if (!Gate::check('viewAny', [CustomerContact::class])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contact = $this->service->getCustomerContact($id);

        if (!$contact) {
            return response()->json(['message' => 'Customer contact not found.'], 404);
        }

        return new CustomerContactResource($contact);
    }

    /**
     * Update the specified customer contact in storage.
     */
    public function update(UpdateCustomerContactRequest $request, $id)
    {
        if (!Gate::check('update', [CustomerContact::class])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contact = $this->service->updateCustomerContact($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer contact updated successfully.',
            'data' => new CustomerContactResource($contact),
        ]);
    }

    /**
     * Remove the specified customer contact from storage.
     */
    public function destroy($id)
    {
        if (!Gate::check('delete', [CustomerContact::class])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $this->service->deleteCustomerContact($id);

        return response()->json([
            'success' => true,
            'message' => 'Customer contact deleted successfully.',
        ]);
    }

    /**
     * Return list of customers for dropdowns.
     */
    public function dataCustomer()
    {
        $customers = $this->service->getCustomers();
        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }
}
