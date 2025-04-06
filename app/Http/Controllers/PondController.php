<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeletePondRequest;
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
        $ponds = Pond::orderBy('created_at', 'desc')->get();
        return Inertia::render('Ponds/Index', ['ponds' => $ponds]);
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
        // Generate tag_id
        $tag_id = $this->generateTagId();

        // Merge tag_id into validated data
        $data = array_merge($request->validated(), ['tag_id' => $tag_id]);

        // Create crab
        Pond::create($data);

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
    public function destroy(DeletePondRequest $request, Pond $pond)
    {
        $pond->update([
            'removal_reason' => $request->validated('removal_reason'),
        ]);

        $pond->delete();

        return redirect()->route('ponds.index')
            ->with('success', 'Pond deleted successfully');
    }

    private function generateTagId(): string
    {
        $today = now()->format('Y-m-d');
        $lastSeq = (int) substr(Pond::withTrashed()
            ->where('tag_id', 'like', "PND-{$today}-%")
            ->latest('tag_id')->value('tag_id') ?? '', -4);
        return "PND-{$today}-" . str_pad($lastSeq > 0 ? $lastSeq + 1 : 1, 4, '0', STR_PAD_LEFT);
    }
}
