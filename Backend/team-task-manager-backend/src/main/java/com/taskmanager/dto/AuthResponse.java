package com.taskmanager.dto;

import com.taskmanager.entity.Role;

public record AuthResponse(
    String token,
    Long id,
    String name,
    String email,
    Role role
) {
}
