package com.backend.internal.schedulers;

import com.backend.services.VisiteArticleService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VisiteArticleScheduler {

    private final VisiteArticleService visiteArticleService;

    public VisiteArticleScheduler(VisiteArticleService visiteArticleService) {
        this.visiteArticleService = visiteArticleService;
    }

    @Scheduled(cron = "0 0 14 * * ?")
    @Transactional
    public void resetCountsDaily() {
        visiteArticleService.resetCounts();
    }
}