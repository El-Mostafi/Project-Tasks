package ma.ensa.projecttasksbackend.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.task.TaskCreateDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskFilterDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskResponseDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskUpdateDTO;
import ma.ensa.projecttasksbackend.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
@AllArgsConstructor
public class TaskController {
    private TaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponseDTO> createTask(@PathVariable Long projectId, @RequestBody @Valid TaskCreateDTO taskDTO) {
        return new ResponseEntity<>(taskService.createTask(projectId, taskDTO), HttpStatus.CREATED);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<PagedResponse<TaskResponseDTO>> getTasksByProject(
            @PathVariable Long projectId,
            @Valid @ModelAttribute TaskFilterDTO filter,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<TaskResponseDTO> tasksPage = taskService.getTasksByProject(projectId,filter, pageable);
        return ResponseEntity.ok(tasksPage);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long taskId, @RequestBody @Valid TaskUpdateDTO taskUpdateDTO) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskUpdateDTO));
    }

    @PatchMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskResponseDTO> markAsCompleted(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.markAsCompleted(taskId));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
