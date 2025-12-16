package ma.ensa.projecttasksbackend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.task.TaskCreateDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskFilterDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskResponseDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskUpdateDTO;
import ma.ensa.projecttasksbackend.entity.Project;
import ma.ensa.projecttasksbackend.entity.Task;
import ma.ensa.projecttasksbackend.repository.ProjectRepository;
import ma.ensa.projecttasksbackend.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public TaskResponseDTO createTask(Long projectId, TaskCreateDTO taskCreateDTO) {
        Project project = getProjectOwnedByUser(projectId);
        Task task = Task.builder()
                .title(taskCreateDTO.title())
                .description(taskCreateDTO.description())
                .dueDate(taskCreateDTO.dueDate())
                .completed(false)
                .project(project)
                .build();
        Task savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    public PagedResponse<TaskResponseDTO> getTasksByProject(Long projectId, TaskFilterDTO filter, Pageable pageable) {
        Project project = getProjectOwnedByUser(projectId);

        String formattedQuery = null;
        if (filter.query() != null && !filter.query().isBlank()) {
            formattedQuery = "%" + filter.query().trim().toLowerCase() + "%";
        }
        Page<Task> tasksPage = taskRepository.findByProject(
                project,
                formattedQuery,
                filter.completed(),
                filter.dueDateFrom(),
                filter.dueDateTo(),
                pageable
        );



        List<TaskResponseDTO> tasks = tasksPage.getContent()
                .stream()
                .map(this::mapToDTO)
                .toList();
        return new PagedResponse<>(
                tasks,
                tasksPage.getNumber(),
                tasksPage.getSize(),
                tasksPage.getTotalElements(),
                tasksPage.getTotalPages(),
                tasksPage.isLast()
        );
    }

    @Transactional
    public TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskUpdateDTO) {
        Task task = this.getTaskOwnedByUser(taskId);
        task.setTitle(taskUpdateDTO.title());
        task.setDescription(taskUpdateDTO.description());
        task.setDueDate(taskUpdateDTO.dueDate());
        if (taskUpdateDTO.completed() != null) {
            task.setCompleted(taskUpdateDTO.completed());
        }
        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    @Transactional
    public TaskResponseDTO markAsCompleted(Long taskId) {
        Task task = this.getTaskOwnedByUser(taskId);
        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = this.getTaskOwnedByUser(taskId);
        if (task.getProject() != null) {
            task.getProject().getTasks().remove(task);
            task.setProject(null);
        }

        taskRepository.delete(task);
    }

    private Project getProjectOwnedByUser(Long projectId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectRepository.findById(projectId)
                .filter(p -> p.getUser().getEmail().equals(email))
                .orElseThrow(() -> new EntityNotFoundException("Project not found or access denied"));
    }
    private Task getTaskOwnedByUser(Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskRepository.findById(taskId)
                .filter(t -> t.getProject().getUser().getEmail().equals(email))
                .orElseThrow(() -> new EntityNotFoundException("Task not found or access denied"));
    }

    private TaskResponseDTO mapToDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isCompleted(),
                task.getDueDate(),
                task.getProject().getId(),
                task.getCreatedAt()
        );
    }

}
