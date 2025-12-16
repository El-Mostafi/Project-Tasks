package ma.ensa.projecttasksbackend.dto.task;

import jakarta.validation.constraints.AssertTrue;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;

public record TaskFilterDTO(
        String query,
        Boolean completed,

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        Date dueDateFrom,

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        Date dueDateTo
) {
    @AssertTrue(message = "dueDateFrom must be before dueDateTo")
    public boolean isDateRangeValid() {
        if (dueDateFrom == null || dueDateTo == null) {
            return true;
        }
        return dueDateFrom.before(dueDateTo);
    }
}
