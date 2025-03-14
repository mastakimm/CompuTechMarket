//package com.backend.config;
//
//import com.backend.entities.ComponentType;
//import com.backend.repositories.ComponentTypeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.transaction.annotation.Transactional;
//
//@Configuration
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private ComponentTypeRepository componentTypeRepository;
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//        jdbcTemplate.execute("DELETE FROM component");
//
//        jdbcTemplate.execute("DELETE FROM component_type");
//        jdbcTemplate.execute("ALTER TABLE component_type AUTO_INCREMENT = 1");
//
//        ComponentType gpu = new ComponentType("Processeur");
//        ComponentType cpu = new ComponentType("Carte graphique");
//        ComponentType ecran = new ComponentType("Ecran");
//
//        componentTypeRepository.save(gpu);
//        componentTypeRepository.save(cpu);
//        componentTypeRepository.save(ecran);
//    }
//}
