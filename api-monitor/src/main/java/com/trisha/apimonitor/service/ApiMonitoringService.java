

package com.trisha.apimonitor.service;

import com.trisha.apimonitor.model.ApiEntity;
import com.trisha.apimonitor.repository.ApiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApiMonitoringService {

    @Autowired
    private ApiRepository apiRepository;
    @Scheduled(fixedRate = 10000)
    public void checkApis() {
        List<ApiEntity> apis = apiRepository.findAll();

        for (ApiEntity api : apis) {
            try {
                long start = System.currentTimeMillis();

                URL url = new URL(api.getUrl());
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(5000);
                connection.connect();

                int responseCode = connection.getResponseCode();
                long end = System.currentTimeMillis();

                api.setResponseTime(end - start);
                api.setLastChecked(LocalDateTime.now());

                if (responseCode >= 200 && responseCode < 300) {
                    api.setStatus("UP");
                } else {
                    api.setStatus("DOWN");
                }

            } catch (Exception e) {
                api.setStatus("DOWN");
                api.setResponseTime(null);
                api.setLastChecked(LocalDateTime.now());
            }

            apiRepository.save(api);
        }
    }
}