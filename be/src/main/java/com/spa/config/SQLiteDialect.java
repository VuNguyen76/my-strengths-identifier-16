
package com.spa.config;

import org.hibernate.community.dialect.SQLiteDialect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SQLiteConfig {
    
    @Bean
    public org.hibernate.community.dialect.SQLiteDialect sqliteDialect() {
        return new SQLiteDialect();
    }
}
