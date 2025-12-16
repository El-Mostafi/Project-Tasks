package ma.ensa.projecttasksbackend.dto.task;

import java.time.LocalDateTime;
import java.util.Date;

public record TaskResponseDTO(
    Long id,
    String title,
    String description,
    boolean isCompleted,
    Date dueDate,
    Long projectId,
    LocalDateTime createdAt
) {
}
