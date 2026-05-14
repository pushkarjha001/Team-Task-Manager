package com.taskmanager.controller;

import com.taskmanager.dto.AddProjectMemberRequest;
import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.dto.UserResponse;
import com.taskmanager.security.UserPrincipal;
import com.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return projectService.create(request, principal);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public List<ProjectResponse> findAll(@AuthenticationPrincipal UserPrincipal principal) {
        return projectService.findAll(principal);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public ProjectResponse findById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return projectService.findById(id, principal);
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> addMember(@PathVariable Long id, @Valid @RequestBody AddProjectMemberRequest request) {
        return projectService.addMember(id, request);
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public List<UserResponse> members(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return projectService.members(id, principal);
    }
}
