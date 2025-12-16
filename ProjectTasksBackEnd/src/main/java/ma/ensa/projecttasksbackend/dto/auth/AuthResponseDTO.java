package ma.ensa.projecttasksbackend.dto.auth;

public record AuthResponseDTO(
        String accessToken,
        String tokenType,
        Long userId
) {
}
