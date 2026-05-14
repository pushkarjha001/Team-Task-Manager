package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUserIdOrderByDueDateAsc(Long userId);

    @Query("""
        select t from Task t
        where t.project.createdBy.id = :userId
           or t.assignedUser.id = :userId
           or exists (
               select pm.id from ProjectMember pm
               where pm.project = t.project and pm.user.id = :userId
           )
        order by t.dueDate asc nulls last, t.id desc
        """)
    List<Task> findVisibleToUser(@Param("userId") Long userId);

    long countByStatus(TaskStatus status);

    long countByAssignedUserIdAndStatus(Long userId, TaskStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

    long countByAssignedUserIdAndDueDateBeforeAndStatusNot(Long userId, LocalDate date, TaskStatus status);
}
