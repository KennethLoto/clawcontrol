<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCrabRequest extends FormRequest
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
            'species' => 'required|in:Mud Crab',
            'age_value' => 'required|integer|min:0',
            'age_unit' => 'required|in:days,weeks,months',
            'weight' => 'required|numeric|min:0',
            'gender' => 'required|in:Male,Female,Undetermined',
            'health_status' => 'required|in:Healthy,Weak,Diseased',
            'pond_id' => 'required|exists:ponds,id',
        ];
    }
}
