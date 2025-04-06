<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteCrabRequest;
use App\Models\Crab;
use App\Http\Requests\StoreCrabRequest;
use App\Http\Requests\UpdateCrabRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
        // Generate tag_id
        $tag_id = $this->generateTagId();

        // Merge tag_id into validated data
        $data = array_merge($request->validated(), ['tag_id' => $tag_id]);

        // Create crab
        Crab::create($data);

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

    public function destroy(DeleteCrabRequest $request, Crab $crab)
    {
        $crab->update([
            'removal_reason' => $request->validated('removal_reason'),
        ]);

        $crab->delete();

        return redirect()->route('crabs.index')
            ->with('success', 'Crab deleted successfully.');
    }

    /**
     * Generate a unique tag_id: CRB-YYYY-MM-DD-0001
     */
    private function generateTagId(): string
    {
        $today = now()->format('Y-m-d');
        $lastSeq = (int) substr(Crab::withTrashed()
            ->where('tag_id', 'like', "CRB-{$today}-%")
            ->latest('tag_id')->value('tag_id') ?? '', -4);
        return "CRB-{$today}-" . str_pad($lastSeq > 0 ? $lastSeq + 1 : 1, 4, '0', STR_PAD_LEFT);
    }
}
