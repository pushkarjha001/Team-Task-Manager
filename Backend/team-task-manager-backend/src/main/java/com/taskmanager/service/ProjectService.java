package com.taskmanager.service;

import com.taskmanager.dto.AddProjectMemberRequest;
import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.dto.UserResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.security.UserPrincipal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;

    @Transactional
    public ProjectResponse create(ProjectRequest request, UserPrincipal principal) {
        Project project = new Project();
        project.setName(request.name().trim());
        project.setDescription(request.description());
        project.setCreatedBy(principal.getUser());
        Project savedProject = projectRepository.save(project);

        ProjectMember ownerMembership = new ProjectMember();
        ownerMembership.setProject(savedProject);
        ownerMembership.setUser(principal.getUser());
        projectMemberRepository.save(ownerMembership);

        return toResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAll(UserPrincipal principal) {
        if (principal.getUser().getRole() == Role.ADMIN) {
            return projectRepository.findAll().stream().map(this::toResponse).toList();
        }
        return projectRepository.findVisibleToUser(principal.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(Long id, UserPrincipal principal) {
        Project project = getById(id);
        assertCanView(project, principal);
        return toResponse(project);
    }

    @Transactional
    public List<UserResponse> addMember(Long projectId, AddProjectMemberRequest request) {
        Project project = getById(projectId);
        User user = userService.getById(request.userId());

        if (!projectMemberRepository.existsByProjectAndUser(project, user)) {
            ProjectMember member = new ProjectMember();
            member.setProject(project);
            member.setUser(user);
            projectMemberRepository.save(member);
        }

        return members(projectId);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> members(Long projectId, UserPrincipal principal) {
        Project project = getById(projectId);
        assertCanView(project, principal);
        return members(project);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> members(Long projectId) {
        Project project = getById(projectId);
        return members(project);
    }

    private List<UserResponse> members(Project project) {
        return projectMemberRepository.findByProject(project).stream()
            .map(ProjectMember::getUser)
            .map(userService::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public Project getById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    public void assertCanView(Project project, UserPrincipal principal) {
        if (principal.getUser().getRole() == Role.ADMIN
            || project.getCreatedBy().getId().equals(principal.getId())
            || projectMemberRepository.existsByProjectAndUser(project, principal.getUser())) {
            return;
        }
        throw new AccessDeniedException("Project is not visible to this user");
    }

    public ProjectResponse toResponse(Project project) {
        User createdBy = project.getCreatedBy();
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            userService.toResponse(createdBy)
        );
    }
}
