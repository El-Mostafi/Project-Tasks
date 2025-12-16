package ma.ensa.projecttasksbackend.repository;

import ma.ensa.projecttasksbackend.entity.Project;
import ma.ensa.projecttasksbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    Page<Project> findByUser(User user, Pageable pageable);
}
