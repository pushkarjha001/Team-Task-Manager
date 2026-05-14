package com.taskmanager.service;

import com.taskmanager.dto.DashboardResponse;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.dto.TaskStatusUpdateRequest;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.security.UserPrincipal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectService projectService;
    private final UserService userService;

    @Transactional
    public TaskResponse create(TaskRequest request) {
        Project project = projectService.getById(request.projectId());
        User assignedUser = userService.getById(request.assignedUserId());

        if (!projectMemberRepository.existsByProjectAndUser(project, assignedUser)) {
            throw new IllegalArgumentException("Assigned user must be a member of the project");
        }

        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setAssignedUser(assignedUser);
        task.setProject(project);

        return toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll(UserPrincipal principal) {
        if (principal.getUser().getRole() == Role.ADMIN) {
            return taskRepository.findAll().stream().map(this::toResponse).toList();
        }
        return taskRepository.findVisibleToUser(principal.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id, UserPrincipal principal) {
        Task task = getById(id);
        assertCanView(task, principal);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateStatus(Long id, TaskStatusUpdateRequest request, UserPrincipal principal) {
        Task task = getById(id);
        assertCanUpdate(task, principal);
        task.setStatus(request.status());
        return toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard(UserPrincipal principal) {
        List<Task> tasks = principal.getUser().getRole() == Role.ADMIN
            ? taskRepository.findAll()
            : taskRepository.findVisibleToUser(principal.getId());

        LocalDate today = LocalDate.now();
        long total = tasks.size();
        long completed = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long overdue = tasks.stream()
            .filter(task -> task.getDueDate() != null)
            .filter(task -> task.getDueDate().isBefore(today))
            .filter(task -> task.getStatus() != TaskStatus.DONE)
            .count();
        long pending = total - completed;

        return new DashboardResponse(total, completed, pending, overdue);
    }

    private Task getById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private void assertCanView(Task task, UserPrincipal principal) {
        projectService.assertCanView(task.getProject(), principal);
    }

    private void assertCanUpdate(Task task, UserPrincipal principal) {
        if (principal.getUser().getRole() == Role.ADMIN || task.getAssignedUser().getId().equals(principal.getId())) {
            return;
        }
        throw new AccessDeniedException("Task can only be updated by an admin or the assigned user");
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getDueDate(),
            userService.toResponse(task.getAssignedUser()),
            projectService.toResponse(task.getProject())
        );
    }
}
