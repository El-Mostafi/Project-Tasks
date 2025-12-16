package ma.ensa.projecttasksbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.ensa.projecttasksbackend.dto.pagination.PagedResponse;
import ma.ensa.projecttasksbackend.dto.task.TaskCreateDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskFilterDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskResponseDTO;
import ma.ensa.projecttasksbackend.dto.task.TaskUpdateDTO;
import ma.ensa.projecttasksbackend.security.CustomUserDetailsService;
import ma.ensa.projecttasksbackend.security.JwtAuthenticationFilter;
import ma.ensa.projecttasksbackend.security.JwtService;
import ma.ensa.projecttasksbackend.service.TaskService;
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
import java.util.Date;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    public void testCreateTask_Success() throws Exception {
        TaskCreateDTO createRequest = new TaskCreateDTO("Test Task", "Task Description", null);
        TaskResponseDTO response = new TaskResponseDTO(1L, "Test Task", "Task Description", false, null, 1L, LocalDateTime.now());

        when(taskService.createTask(eq(1L), any(TaskCreateDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/projects/1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Task Description"))
                .andExpect(jsonPath("$.isCompleted").value(false))
                .andExpect(jsonPath("$.projectId").value(1));
    }

    @Test
    public void testCreateTask_ValidationError() throws Exception {
        TaskCreateDTO createRequest = new TaskCreateDTO("", "Task Description", new Date());

        mockMvc.perform(post("/api/projects/1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetTasksByProject_Success() throws Exception {
        TaskResponseDTO task = new TaskResponseDTO(1L, "Test Task", "Description", false, new Date(), 1L, LocalDateTime.now());
        PagedResponse<TaskResponseDTO> pagedResponse = new PagedResponse<>(Collections.singletonList(task), 0, 10, 1L, 1, true);

        when(taskService.getTasksByProject(eq(1L), any(TaskFilterDTO.class), any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/projects/1/tasks").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Task"));
    }

    @Test
    public void testGetTasksByProject_WithFilters() throws Exception {
        TaskResponseDTO task = new TaskResponseDTO(1L, "Design Task", "Important", true, null, 1L, LocalDateTime.now());
        PagedResponse<TaskResponseDTO> pagedResponse = new PagedResponse<>(Collections.singletonList(task), 0, 10, 1L, 1, true);

        when(taskService.getTasksByProject(eq(1L), any(TaskFilterDTO.class), any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/projects/1/tasks")
                        .param("page", "0")
                        .param("size", "10")
                        .param("query", "design")
                        .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Design Task"))
                .andExpect(jsonPath("$.content[0].description").value("Important"))
                .andExpect(jsonPath("$.content[0].isCompleted").value(true));
    }

    @Test
    public void testUpdateTask_Success() throws Exception {
        TaskUpdateDTO updateRequest = new TaskUpdateDTO("Updated Task", "Updated Description", null, false);
        TaskResponseDTO response = new TaskResponseDTO(1L, "Updated Task", "Updated Description", false, null, 1L, LocalDateTime.now());

        when(taskService.updateTask(eq(1L), any(TaskUpdateDTO.class))).thenReturn(response);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    public void testUpdateTask_ValidationError() throws Exception {
        TaskUpdateDTO updateRequest = new TaskUpdateDTO("", "Description", new Date(), false);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMarkTaskAsCompleted_Success() throws Exception {
        TaskResponseDTO response = new TaskResponseDTO(1L, "Test Task", "Description", true, null, 1L, LocalDateTime.now());

        when(taskService.markAsCompleted(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/tasks/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Description"))
                .andExpect(jsonPath("$.isCompleted").value(true));
    }

    @Test
    public void testDeleteTask_Success() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());
    }
}

