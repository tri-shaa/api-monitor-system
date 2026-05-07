package com.trisha.apimonitor.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "apis")
public class ApiEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String url;

    private String status; // UP or DOWN
    private Long responseTime; // in milliseconds
    private LocalDateTime lastChecked;
}