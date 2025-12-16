package ma.ensa.projecttasksbackend.repository;

import ma.ensa.projecttasksbackend.entity.Project;
import ma.ensa.projecttasksbackend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

    @Query("SELECT t FROM Task t WHERE t.project = :project " +
            "AND (:query IS NULL OR (LOWER(t.title) LIKE :query OR LOWER(t.description) LIKE :query)) " +
            "AND (:completed IS NULL OR t.completed = :completed) " +
            "AND (:dueDateFrom IS NULL OR t.dueDate >= :dueDateFrom) " +
            "AND (:dueDateTo IS NULL OR t.dueDate <= :dueDateTo)")
    Page<Task> findByProject(
            @Param("project") Project project,
            @Param("query") String query,
            @Param("completed") Boolean completed,
            @Param("dueDateFrom") Date dueDateFrom,
            @Param("dueDateTo") Date dueDateTo,
            Pageable pageable
    );
}
