package com.taskmanager.dto;

import jakarta.validation.constraints.NotNull;

public record AddProjectMemberRequest(
    @NotNull Long userId
) {
}
