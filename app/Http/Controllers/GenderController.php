<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use App\Http\Requests\StoreGenderRequest;
use App\Http\Requests\UpdateGenderRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class GenderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Utilities/Crab/Genders/Index', [
            'genders' => Gender::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Utilities/Crab/Genders/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGenderRequest $request): RedirectResponse
    {
        Gender::create($request->validated());

        return redirect()->route('genders.index')->with('success', 'Gender added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gender $gender)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gender $gender)
    {
        return Inertia::render('Utilities/Crab/Genders/Edit', ['gender' => $gender]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGenderRequest $request, Gender $gender)
    {
        $gender->update($request->validated());

        return redirect()->route('genders.index')->with('success', 'Gender updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gender $gender)
    {
        $gender->delete();

        return redirect()->route('genders.index')->with('success', 'Gender deleted successfully!');
    }
}
