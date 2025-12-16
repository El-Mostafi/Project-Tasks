package ma.ensa.projecttasksbackend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid email address")
        String email,
        @NotBlank(message = "Password is required")
        String password
) {
}
