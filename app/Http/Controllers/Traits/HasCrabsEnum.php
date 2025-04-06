<?php

namespace App\Http\Controllers\Traits;

use App\Enums\Species;
use App\Enums\AgeUnit;
use App\Enums\Gender;
use App\Enums\HealthStatus;

trait HasCrabsEnum
{
    /**
     * Get all enums needed for crab forms
     *
     * @return array
     */
    protected function getCrabEnums(): array
    {
        return [
            'species' => array_map(fn($case) => [
                'value' => $case->value,
                'label' => $case->value
            ], Species::cases()),

            'age_unit' => array_map(fn($case) => [
                'value' => $case->value,
                'label' => ucfirst($case->value)
            ], AgeUnit::cases()),

            'gender' => array_map(fn($case) => [
                'value' => $case->value,
                'label' => $case->value
            ], Gender::cases()),

            'health_status' => array_map(fn($case) => [
                'value' => $case->value,
                'label' => $case->value
            ], HealthStatus::cases()),
        ];
    }
}
