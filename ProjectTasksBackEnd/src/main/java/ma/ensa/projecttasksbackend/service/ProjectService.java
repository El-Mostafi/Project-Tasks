package ma.ensa.projecttasksbackend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.project.CreateProjectDTO;
import ma.ensa.projecttasksbackend.dto.project.ProjectResponseDTO;
import ma.ensa.projecttasksbackend.dto.project.UpdateProjectDTO;
import ma.ensa.projecttasksbackend.entity.Project;
import ma.ensa.projecttasksbackend.entity.Task;
import ma.ensa.projecttasksbackend.entity.User;
import ma.ensa.projecttasksbackend.repository.ProjectRepository;
import ma.ensa.projecttasksbackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponseDTO createProject( CreateProjectDTO projectDTO) {
        var user = this.getCurrentUser();

        Project project = Project.builder()
                .title(projectDTO.title())
                .description(projectDTO.description())
                .user(user)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToDTO(savedProject);
    }

    public PagedResponse<ProjectResponseDTO> getCurrentUserProjects(Pageable pageable) {
        User user = getCurrentUser();
        Page<Project> projectsPage = projectRepository.findByUser(user, pageable);
        List<ProjectResponseDTO> projects = projectsPage.getContent()
                .stream()
                .map(this::mapToDTO)
                .toList();
        return new PagedResponse<>(
                projects,
                projectsPage.getNumber(),
                projectsPage.getSize(),
                projectsPage.getTotalElements(),
                projectsPage.getTotalPages(),
                projectsPage.isLast()
        );
    }
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = this.getProjectEntityInternal(id);
        return mapToDTO(project);
    }

    @Transactional
    public ProjectResponseDTO updateProject(Long id, UpdateProjectDTO updateProjectDTO) {
        Project project = this.getProjectEntityInternal(id);
        project.setTitle(updateProjectDTO.title());
        project.setDescription(updateProjectDTO.description());
        Project updatedProject = projectRepository.save(project);
        return mapToDTO(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = this.getProjectEntityInternal(id);
        projectRepository.delete(project);
    }
    private Project getProjectEntityInternal(Long projectId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectRepository.findById(projectId)
                .filter(p -> p.getUser().getEmail().equals(email))
                .orElseThrow(() -> new EntityNotFoundException("Project not found or access denied"));
    }
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
    private ProjectResponseDTO mapToDTO(Project project) {
        List<Task> tasks = project.getTasks();
        int totalTasks = tasks == null ? 0 : tasks.size();
        int completedTasks = tasks == null ? 0 : (int) tasks.stream()
                .filter(Task::isCompleted).count();

        double progress = totalTasks == 0 ? 0.0 : ((double) completedTasks / totalTasks) * 100;

        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getCreatedAt(),
                totalTasks,
                completedTasks,
                progress
        );
    }
}

