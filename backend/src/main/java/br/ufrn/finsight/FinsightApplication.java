package br.ufrn.finsight;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// Dizemos ao Spring para escanear a si mesmo E o núcleo do framework
@SpringBootApplication(scanBasePackages = {
    "br.ufrn.finsight", 
    "br.ufrn.academix.framework.core"
})
// Apontamos onde estão as entidades do banco
@EntityScan(basePackages = {
    "br.ufrn.finsight.domain.model", 
    "br.ufrn.academix.framework.core"
})
// Apontamos onde estão os repositórios
@EnableJpaRepositories(basePackages = {
    "br.ufrn.finsight.domain.repository", 
    "br.ufrn.academix.framework.core"
})
public class FinsightApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinsightApplication.class, args);
    }
}