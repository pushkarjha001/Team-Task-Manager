package com.taskmanager.dto;

public record DashboardResponse(
    long totalTasks,
    long completed,
    long pending,
    long overdue
) {
}
