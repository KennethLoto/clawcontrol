<?php

namespace App\Http\Controllers;

use App\Models\Crab;
use App\Http\Requests\StoreCrabRequest;
use App\Http\Requests\UpdateCrabRequest;
use Inertia\Inertia;

class CrabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $crabs = Crab::orderBy('created_at', 'desc')->get();
        return Inertia::render('Crabs/Index', compact('crabs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Crabs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCrabRequest $request)
    {
        Crab::create($request->validated());

        // return redirect()->route('crabs.index');
        return redirect()->route('crabs.index')->with('success', 'Crab created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Crab $crab) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Crab $crab)
    {
        return Inertia::render('Crabs/Edit', [
            'crab' => $crab
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCrabRequest $request, Crab $crab)
    {
        $crab->update($request->validated());

        return redirect()->route('crabs.index')->with('success', 'Crab updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Crab $crab)
    {
        $crab->delete();
        return redirect()->route('crabs.index')->with('success', 'Crab deleted successfully!');
    }
}
