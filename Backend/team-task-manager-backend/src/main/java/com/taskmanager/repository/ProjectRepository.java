package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("""
        select p from Project p
        where p.createdBy.id = :userId
           or exists (
               select pm.id from ProjectMember pm
               where pm.project = p and pm.user.id = :userId
           )
        order by p.id desc
        """)
    List<Project> findVisibleToUser(@Param("userId") Long userId);
}
