package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record TaskRequest(
    @NotBlank String title,
    String description,
    LocalDate dueDate,
    @NotNull Long assignedUserId,
    @NotNull Long projectId
) {
}
