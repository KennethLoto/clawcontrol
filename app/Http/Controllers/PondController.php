<?php

namespace App\Http\Controllers;

use App\Models\Pond;
use App\Http\Requests\StorePondRequest;
use App\Http\Requests\UpdatePondRequest;
use Inertia\Inertia;

class PondController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Ponds/Index', [
            'ponds' => Pond::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Ponds/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePondRequest $request)
    {
        Pond::create($request->validated());

        return redirect()->route('ponds.index')->with('success', 'Pond created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pond $pond)
    {
        return Inertia::render('Ponds/Show', [
            'pond' => $pond,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pond $pond)
    {
        return Inertia::render('Ponds/Edit', [
            'pond' => $pond,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePondRequest $request, Pond $pond)
    {
        $pond->update($request->validated());

        return redirect()->route('ponds.index')
            ->with('success', 'Pond updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pond $pond)
    {
        $pond->delete();

        return redirect()->route('ponds.index')
            ->with('success', 'Pond deleted successfully');
    }
}
