<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pond extends Model
{
    /** @use HasFactory<\Database\Factories\PondFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'tag_id',
        'location',
        'size',
        'water_type',
        'setup_date',
        'current_ph',
        'current_temperature',
        'current_oxygen',
        'crab_population',
        'water_quality_log',
        'maintenance_notes',
        'removal_reason'
    ];
}
