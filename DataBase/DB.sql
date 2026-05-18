DROP SCHEMA IF EXISTS `immigration_decision_support` ;

CREATE SCHEMA IF NOT EXISTS `immigration_decision_support` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;

USE `immigration_decision_support` ;


DROP TABLE IF EXISTS `financial_level` ;

CREATE TABLE IF NOT EXISTS `financial_level` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `level` INT UNIQUE NOT NULL,
    `amount` INT NOT NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `profession` ;

CREATE TABLE IF NOT EXISTS `profession` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user` ;
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `financial_level_id` INT,
    `profession_id` INT,
    `work_experience` INT,
    `family_members` INT,
    `preferred_climate` ENUM('cold', 'moderate', 'warm', 'any'),
    `preferred_ocean_sea` ENUM('yes', 'no', 'any'),
    `preferred_region` ENUM('Europe', 'Asia', 'North_America', 'South_America', 'Australia', 'any'),
    `migration_goal` ENUM('work', 'study', 'living'),
    `state_of_health` ENUM('healthy', 'minor_issues', 'serious_conditions'),
    FOREIGN KEY (`financial_level_id`) REFERENCES `financial_level`(`id`)
        ON DELETE RESTRICT,
    FOREIGN KEY (`profession_id`) REFERENCES `profession`(`id`)
        ON DELETE RESTRICT
) ENGINE=InnoDB;
    
DROP TABLE IF EXISTS `language`;
CREATE TABLE IF NOT EXISTS `language` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_language_skills`;
CREATE TABLE IF NOT EXISTS `user_language_skills` (
    `user_id` INT,
    `language_id` INT,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    PRIMARY KEY (`user_id`, `language_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`language_id`) REFERENCES `language`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;
    
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `shortname` VARCHAR(2) NOT NULL,
    `overall_rating` DECIMAL(3,1) CHECK (`overall_rating` BETWEEN 0 AND 10),
    `user_rating` DECIMAL(3,1) CHECK (`user_rating` BETWEEN 0 AND 10),
    `region` ENUM('Europe', 'Asia', 'North_America', 'South_America', 'Australia') NOT NULL,
    `primary_language_id` INT NOT NULL,
    `secondary_language_id` INT NULL,
    `cost_of_living` INT NOT NULL,
    `economy_index` DECIMAL(3,1) CHECK (`economy_index` BETWEEN 0 AND 10) NOT NULL,
    `quality_of_life` DECIMAL(3,1) CHECK (`quality_of_life` BETWEEN 0 AND 10) NOT NULL,
    `climate` ENUM('cold', 'moderate', 'warm') NOT NULL,
    `is_near_ocean_sea` BOOLEAN NOT NULL,
    `safety_level` DECIMAL(3,1) CHECK (`safety_level` BETWEEN 0 AND 10) NOT NULL,
    `education_level` DECIMAL(3,1) CHECK (`education_level` BETWEEN 0 AND 10) NOT NULL,
    `healthcare_level` DECIMAL(3,1) CHECK (`healthcare_level` BETWEEN 0 AND 10) NOT NULL,
    `employment_opportunities` DECIMAL(3,1) CHECK (`employment_opportunities` BETWEEN 0 AND 10) NOT NULL,
    `immigration_policy` DECIMAL(3,1) CHECK (`immigration_policy` BETWEEN 0 AND 10) NOT NULL,
    `social_institutions` DECIMAL(3,1) CHECK (`social_institutions` BETWEEN 0 AND 10) NOT NULL,
    FOREIGN KEY (`primary_language_id`) REFERENCES `language`(`id`)
        ON DELETE RESTRICT,
    FOREIGN KEY (`secondary_language_id`) REFERENCES `language`(`id`)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `country_profession`;
CREATE TABLE IF NOT EXISTS `country_profession` (
    `country_id` INT NOT NULL,
    `profession_id` INT NOT NULL,
    `demand_for_profession` DECIMAL(5,3) NOT NULL,
    `payment_for_profession` INT NOT NULL,
    PRIMARY KEY (`country_id`, `profession_id`),
    FOREIGN KEY (`country_id`) REFERENCES `country`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`profession_id`) REFERENCES `profession`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;


DROP TABLE IF EXISTS `personal_recommendation`;
CREATE TABLE IF NOT EXISTS `personal_recommendation` (
    `recommendation_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `country_id` INT NOT NULL,
    `score` DECIMAL(4,2) CHECK (`score` BETWEEN 0 AND 10),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`country_id`) REFERENCES `country`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `review`;
CREATE TABLE IF NOT EXISTS `review` (
    `user_id` INT NOT NULL,
    `country_id` INT NOT NULL,
    `rating` DECIMAL(3,1) CHECK (`rating` BETWEEN 1 AND 10) NOT NULL,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`user_id`, `country_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`country_id`) REFERENCES `country`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

