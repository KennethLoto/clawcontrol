<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crab extends Model
{
    /** @use HasFactory<\Database\Factories\CrabFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'species',
        'age_value',
        'age_unit',
        'weight',
        'gender',
        'health_status',

    ];
}
