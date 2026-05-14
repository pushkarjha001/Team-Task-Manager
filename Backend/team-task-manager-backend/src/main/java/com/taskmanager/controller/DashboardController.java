package com.taskmanager.controller;

import com.taskmanager.dto.DashboardResponse;
import com.taskmanager.security.UserPrincipal;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final TaskService taskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public DashboardResponse dashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return taskService.dashboard(principal);
    }
}
