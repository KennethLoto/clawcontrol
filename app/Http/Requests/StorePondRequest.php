<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePondRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'location' => 'required|in:Inland Brackish Pond Zone,Coastal Pond Zone,River Pond Area',
            'size' => 'required|numeric|min:0',
            'water_type' => 'required|in:Brackish,Fresh',
            'setup_date' => 'required|date',
            'current_ph' => 'nullable|numeric|between:0,14',
            'current_temperature' => 'nullable|numeric|min:0',
            'current_oxygen' => 'nullable|numeric|min:0',
            'crab_population' => 'nullable|integer|min:0',
            'water_quality_log' => 'nullable|string|max:2000',
            'maintenance_notes' => 'nullable|string|max:2000',
        ];
    }
}
