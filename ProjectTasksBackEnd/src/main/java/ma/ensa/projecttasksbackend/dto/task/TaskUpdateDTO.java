package ma.ensa.projecttasksbackend.dto.task;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public record TaskUpdateDTO(
    @NotBlank(message = "Title is required")
    String title,
    String description,
    @FutureOrPresent(message = "Due date must be in the present or future")
    Date dueDate,
    Boolean completed
) {
}

