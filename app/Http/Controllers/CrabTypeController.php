<?php

namespace App\Http\Controllers;

use App\Models\CrabType;
use App\Http\Requests\StoreCrabTypeRequest;
use App\Http\Requests\UpdateCrabTypeRequest;
use Inertia\Inertia;

class CrabTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Utilities/Crab/CrabTypes/Index', [
            'genders' => CrabType::all()
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Utilities/Crab/CrabTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCrabTypeRequest $request)
    {
        CrabType::create($request->validated());

        return redirect()->route('crabTypes.index')->with('success', 'Crab type added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(CrabType $crabType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CrabType $crabType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCrabTypeRequest $request, CrabType $crabType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CrabType $crabType)
    {
        //
    }
}
