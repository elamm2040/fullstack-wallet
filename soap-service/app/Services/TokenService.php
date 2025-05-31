<?php

namespace App\Services;

class TokenService
{
    public function generateToken(int $clientId): string
    {
        return (string) random_int(100000, 999999);
    }

    public function validateToken(string $inputToken, string $expectedToken): bool
    {
        return $inputToken === $expectedToken;
    }
}
