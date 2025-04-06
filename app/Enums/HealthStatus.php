<?php

namespace App\Enums;

enum HealthStatus: string
{
    case HEALTHY = 'Healthy';
    case WEAK = 'Weak';
    case DISEASED = 'Diseased';
}
