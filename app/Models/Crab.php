<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Crab extends Model
{
    /** @use HasFactory<\Database\Factories\CrabFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'tag_id',
        'species',
        'age_value',
        'age_unit',
        'weight',
        'gender',
        'health_status',
        'removal_reason',
    ];
}
