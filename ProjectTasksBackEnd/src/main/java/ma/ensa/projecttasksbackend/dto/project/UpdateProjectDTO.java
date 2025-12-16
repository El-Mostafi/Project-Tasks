package ma.ensa.projecttasksbackend.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProjectDTO(
    @NotBlank(message = "Title is required")
    @Size(min = 4, max = 50, message = "Title must be between 4 and 50 characters")
    String title,
    String description
) {
}

