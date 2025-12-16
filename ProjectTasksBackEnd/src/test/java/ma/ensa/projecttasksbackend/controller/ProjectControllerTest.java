package ma.ensa.projecttasksbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.project.CreateProjectDTO;
import ma.ensa.projecttasksbackend.dto.project.ProjectResponseDTO;
import ma.ensa.projecttasksbackend.dto.project.UpdateProjectDTO;
import ma.ensa.projecttasksbackend.security.CustomUserDetailsService;
import ma.ensa.projecttasksbackend.security.JwtAuthenticationFilter;
import ma.ensa.projecttasksbackend.security.JwtService;
import ma.ensa.projecttasksbackend.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ProjectController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProjectService projectService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    public void testCreateProject_Success() throws Exception {
        CreateProjectDTO createRequest = new CreateProjectDTO("Test Project", "Test Description");
        ProjectResponseDTO response = new ProjectResponseDTO(1L, "Test Project", "Test Description", LocalDateTime.now(), 0, 0, 0.0);

        when(projectService.createProject(any(CreateProjectDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.progressPercentage").value(0.0))
                .andExpect(jsonPath("$.totalTasks").value(0))
                .andExpect(jsonPath("$.completedTasks").value(0));
    }

    @Test
    public void testCreateProject_ValidationError() throws Exception {
        CreateProjectDTO createRequest = new CreateProjectDTO("", "Test Description");

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetUserProjects_Success() throws Exception {
        ProjectResponseDTO project = new ProjectResponseDTO(1L, "Test Project", "Test Description", LocalDateTime.now(), 5, 3, 60.0);
        PagedResponse<ProjectResponseDTO> pagedResponse = new PagedResponse<>(Collections.singletonList(project), 0, 10, 1L, 1, true);

        when(projectService.getCurrentUserProjects(any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/projects").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Project"))
                .andExpect(jsonPath("$.content[0].description").value("Test Description"))
                .andExpect(jsonPath("$.content[0].progressPercentage").value(60.0))
                .andExpect(jsonPath("$.content[0].totalTasks").value(5))
                .andExpect(jsonPath("$.content[0].completedTasks").value(3))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.totalPages").value(1));
    }

    @Test
    public void testGetProjectById_Success() throws Exception {
        ProjectResponseDTO response = new ProjectResponseDTO(1L, "Test Project", "Test Description", LocalDateTime.now(), 10, 7, 70.0);

        when(projectService.getProjectById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.progressPercentage").value(70.0))
                .andExpect(jsonPath("$.totalTasks").value(10))
                .andExpect(jsonPath("$.completedTasks").value(7));
    }

    @Test
    public void testUpdateProject_Success() throws Exception {
        UpdateProjectDTO updateRequest = new UpdateProjectDTO("Updated Title", "Updated Description");
        ProjectResponseDTO response = new ProjectResponseDTO(1L, "Updated Title", "Updated Description", LocalDateTime.now(), 5, 2, 40.0);

        when(projectService.updateProject(eq(1L), any(UpdateProjectDTO.class))).thenReturn(response);

        mockMvc.perform(put("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.progressPercentage").value(40.0))
                .andExpect(jsonPath("$.totalTasks").value(5))
                .andExpect(jsonPath("$.completedTasks").value(2));
    }

    @Test
    public void testUpdateProject_ValidationError() throws Exception {
        UpdateProjectDTO updateRequest = new UpdateProjectDTO("ab", "Updated Description");

        mockMvc.perform(put("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteProject_Success() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isNoContent());
    }
}

