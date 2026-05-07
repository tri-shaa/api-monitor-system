package com.trisha.apimonitor.controller;

import com.trisha.apimonitor.model.ApiEntity;
import com.trisha.apimonitor.repository.ApiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @Autowired
    private ApiRepository apiRepository;

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }

    @PostMapping("/add")
    public ApiEntity addApi(@RequestBody ApiEntity api) {
        return apiRepository.save(api);
    }

    @GetMapping("/all")
    public List<ApiEntity> getAllApis() {
        return apiRepository.findAll();
    }

    @Autowired
    private com.trisha.apimonitor.service.ApiMonitoringService monitoringService;

    @GetMapping("/check")
    public String checkApis() {
        monitoringService.checkApis();
        return "API check completed";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteApi(@PathVariable Long id) {
        apiRepository.deleteById(id);
        return "Deleted successfully";
    }
}