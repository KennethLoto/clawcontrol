<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrabType extends Model
{
    /** @use HasFactory<\Database\Factories\CrabTypeFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'crab_type',
    ];
}
