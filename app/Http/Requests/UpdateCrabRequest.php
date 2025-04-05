<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCrabRequest extends FormRequest
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
            'species' => 'sometimes|required|in:Mud Crab',
            'age_value' => 'sometimes|required|integer|min:0',
            'age_unit' => 'sometimes|required|in:days,weeks,months',
            'weight' => 'sometimes|required|numeric|min:0',
            'gender' => 'sometimes|required|in:Male,Female,Undetermined',
            'health_status' => 'sometimes|required|in:Healthy,Weak,Diseased',
        ];
    }
}
