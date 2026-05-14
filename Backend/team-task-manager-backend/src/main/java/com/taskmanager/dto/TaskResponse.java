package com.taskmanager.dto;

import com.taskmanager.entity.TaskStatus;
import java.time.LocalDate;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status,
    LocalDate dueDate,
    UserResponse assignedUser,
    ProjectResponse project
) {
}
