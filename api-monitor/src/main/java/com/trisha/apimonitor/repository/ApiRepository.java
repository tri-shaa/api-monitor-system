

package com.trisha.apimonitor.repository;

import com.trisha.apimonitor.model.ApiEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiRepository extends JpaRepository<ApiEntity, Long> {
}