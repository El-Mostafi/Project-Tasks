package ma.ensa.projecttasksbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.project.CreateProjectDTO;
import ma.ensa.projecttasksbackend.dto.project.ProjectResponseDTO;
import ma.ensa.projecttasksbackend.dto.project.UpdateProjectDTO;
import ma.ensa.projecttasksbackend.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/projects")
@RestController
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody @Valid CreateProjectDTO projectDTO) {
        return new ResponseEntity<>(projectService.createProject(projectDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ProjectResponseDTO>> getUserProjects(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<ProjectResponseDTO> projectsPage = projectService.getCurrentUserProjects(pageable);
        return ResponseEntity.ok(projectsPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> updateProject(@PathVariable Long id, @RequestBody @Valid UpdateProjectDTO updateProjectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, updateProjectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

}
