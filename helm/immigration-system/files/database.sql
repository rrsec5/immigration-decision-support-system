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

    -- a trigger that ensures the calculation of the overall rating when a new record is created in the country table
    -- There is no user_rating here, because there are no reviews yet when the country is created.
    DROP TRIGGER IF EXISTS trg_country_before_insert;
    DELIMITER $$
    CREATE TRIGGER trg_country_before_insert
    BEFORE INSERT ON country
    FOR EACH ROW
    BEGIN
        SET NEW.overall_rating = (
            (
                NEW.economy_index*3 +
                NEW.quality_of_life*3 +
                NEW.safety_level*2 +
                NEW.education_level +
                NEW.healthcare_level +
                NEW.employment_opportunities +
                NEW.immigration_policy +
                NEW.social_institutions
            ) / 13
        );
    END$$
    DELIMITER ;

    INSERT INTO `financial_level` (`level`, `amount`) VALUES
    ('0', 100),
    ('1', 1000),
    ('2', 5000),
    ('3', 10000),
    ('4', 50000);

    INSERT INTO `profession` (`name`) VALUES
    ('Clerical Worker'),
    ('Customer Service Representative'),
    ('Sales and Marketing Specialist'),
    ('Software Developer'),
    ('Web Developer'),
    ('Healthcare Professional'),
    ('Construction Worker'),
    ('Designer'),
    ('Engineer'),
    ('Administrative Specialist'),
    ('Manager'),
    ('Educator'),
    ('General Worker');

    INSERT INTO `language` (`name`) VALUES
    ('Ukrainian'),
    ('Russian'),
    ('English'),
    ('Polish'),
    ('Japanese'),
    ('Chinese'),
    ('Korean'),
    ('German'),
    ('French'),
    ('Spanish'),
    ('Portuguese'),
    ('Italian'),
    ('Czech'),
    ('Finnish'),
    ('Swedish'),
    ('Norwegian'),
    ('Dutch'),
    ('Romanian'),
    ('Greek'),
    ('Turkish'),
    ('Arabic');

    /*
    The data for tables `country` and `country_profession` was taken from various sources such as:
    OECD, UNDP, MIPEX, Numbeo, SalaryExpert and ERI
    */

    INSERT INTO `country` 
    (`name`, `shortname`, `region`, `climate`, `is_near_ocean_sea`, `primary_language_id`, `secondary_language_id`,
    `cost_of_living`, `economy_index`, `quality_of_life`, `safety_level`, `education_level`, `healthcare_level`, 
    `employment_opportunities`, `immigration_policy`, `social_institutions`)
    VALUES
    ('Ukraine','ua','Europe','moderate',1,2,1,783,5.0,6.7,7.1,3.6,6.3,7.5,7.7,8.8),
    ('USA','us','North_America','moderate',1,3,NULL,2680,9.7,9.2,6.9,9.6,9.7,8.8,9.1,9.2),
    ('Canada','ca','North_America','cold',1,3,9,2240,9.1,8.8,7.2,9.7,9.2,8.9,9.6,9.3),
    ('UK','gb','Europe','moderate',1,3,NULL,2326,8.7,8.9,7.0,7.1,9.5,7.6,7.9,8.8),
    ('China','cn','Asia','moderate',1,6,NULL,828,5.6,7.5,9.3,3.6,6.1,7.4,6.2,8.1),
    ('Japan','jp','Asia','moderate',1,5,NULL,1310,8.0,9.2,9.3,6.6,9.0,8.3,7.1,8.9),
    ('South Korea','kr','Asia','moderate',1,7,NULL,1481,8.0,8.1,8.8,9.0,7.4,8.6,8.2,8.0),
    ('Brazil','br','South_America','warm',1,11,10,885,5.2,6.7,5.0,4.7,6.7,8.7,8.9,8.3),
    ('Mexico','mx','North_America','warm',1,10,NULL,1430,5.6,7.1,6.5,6.3,7.5,8.0,7.7,8.0),
    ('UAE','ae','Asia','warm',1,21,3,2350,9.2,8.9,10.0,6.3,8.8,5.8,5.3,9.1),
    ('Poland','pl','Europe','moderate',1,4,3,1460,7.3,8.3,8.8,7.1,6.3,7.3,7.0,9.1),
    ('Germany','de','Europe','moderate',1,8,3,2040,9.1,9.5,8.0,8.1,8.9,9.4,8.2,8.9),
    ('France','fr','Europe','moderate',1,9,3,1975,8.7,8.7,6.1,6.8,9.0,7.9,8.0,9.1),
    ('Spain','es','Europe','warm',1,10,NULL,1765,8.2,9.2,8.0,7.3,9.8,8.7,8.1,9.3),
    ('Italy','it','Europe','warm',1,12,NULL,1800,8.1,8.2,7.1,7.3,9.7,8.7,8.0,8.8),
    ('Czech Republic','cz','Europe','moderate',0,13,3,1660,7.1,8.9,9.1,8.4,8.2,8.0,7.4,9.4),
    ('Finland','fi','Europe','cold',1,14,3,1970,8.6,9.8,9.1,9.8,9.1,9.9,10.0,9.7),
    ('Sweden','se','Europe','cold',1,15,3,1945,8.6,9.3,7.0,10.0,9.9,9.9,10.0,9.4),
    ('Norway','no','Europe','cold',1,16,3,2750,9.4,9.5,8.5,9.0,9.5,9.6,8.9,9.4),
    ('Netherlands','nl','Europe','moderate',1,17,3,2810,9.5,10.0,9.1,8.2,9.0,8.6,8.0,9.3),
    ('Portugal','pt','Europe','warm',1,11,3,1770,7.1,8.7,8.5,9.1,8.3,10.0,9.9,8.7),
    ('Bulgaria','bg','Europe','moderate',1,18,NULL,1140,6.6,8.0,8.3,5.5,6.5,7.6,6.9,9.1),
    ('Greece','gr','Europe','warm',1,19,NULL,1420,6.6,7.7,7.2,6.8,8.1,8.4,7.3,8.3),
    ('Austria','at','Europe','moderate',0,8,3,2170,9.3,9.6,8.9,7.9,9.8,8.3,6.9,8.9),
    ('Belgium','be','Europe','moderate',1,9,17,2045,9.3,8.9,6.9,9.1,9.4,8.1,8.9,9.1),
    ('Romania','ro','Europe','moderate',1,18,NULL,1120,7.2,7.8,8.5,7.2,7.8,7.5,7.6,8.4),
    ('Switzerland','ch','Europe','moderate',0,8,9,3760,10.0,9.8,9.0,7.7,9.9,8.5,7.3,9.2),
    ('Australia','au','Australia','warm',1,3,NULL,2610,9.2,9.3,7.1,9.4,9.7,6.9,8.5,9.3),
    ('Denmark','dk','Europe','moderate',1,17,3,2360,9.2,10.0,9.1,7.5,8.5,8.6,7.4,9.5),
    ('Turkey','tr','Asia','warm',1,20,NULL,1170,7.0,7.8,7.7,7.9,9.2,5.6,6.7,8.0);

    INSERT INTO `country_profession` 
    (`country_id`, `profession_id`, `demand_for_profession`, `payment_for_profession`) VALUES

    -- =========================
    -- 1 Ukraine
    -- =========================
    (1,1,-0.060,1200),(1,2,-0.221,1100),(1,3,-0.332,1000),(1,4,0.038,2500),(1,5,-0.091,2400),
    (1,6,0.572,2800),(1,7,-0.157,1800),(1,8,0.213,1700),(1,9,-0.117,2600),(1,10,-0.138,1300),
    (1,11,-0.145,1500),(1,12,0.483,1400),(1,13,-0.134,900),

    -- =========================
    -- 2 USA
    -- =========================
    (2,1,0.058,4500),(2,2,0.295,4200),(2,3,0.247,6500),(2,4,-0.103,12000),(2,5,0.010,11500),
    (2,6,0.361,18000),(2,7,-0.487,6000),(2,8,-0.021,9000),(2,9,-0.349,13000),(2,10,-0.062,5000),
    (2,11,-0.049,15000),(2,12,0.131,6500),(2,13,0.060,2500),

    -- =========================
    -- 3 Canada
    -- =========================
    (3,1,-0.284,4200),(3,2,0.099,3800),(3,3,0.173,6000),(3,4,0.004,11000),(3,5,-0.020,10500),
    (3,6,0.670,17000),(3,7,-0.195,5800),(3,8,0.099,8500),(3,9,-0.289,12000),(3,10,-0.055,4800),
    (3,11,-0.188,14000),(3,12,0.223,6200),(3,13,-0.137,2300),

    -- =========================
    -- 4 UK
    -- =========================
    (4,1,-0.275,4000),(4,2,-0.414,3500),(4,3,-0.117,6200),(4,4,0.153,11500),(4,5,0.020,11000),
    (4,6,0.418,16500),(4,7,0.046,5200),(4,8,-0.128,7800),(4,9,0.120,12500),(4,10,0.229,4500),
    (4,11,0.113,14000),(4,12,0.244,6000),(4,13,-0.294,2200),

    -- =========================
    -- 5 China
    -- =========================
    (5,1,-0.509,2000),(5,2,-0.497,1800),(5,3,-0.073,3000),(5,4,0.104,7000),(5,5,0.012,6800),
    (5,6,0.211,9000),(5,7,-0.182,2500),(5,8,-0.390,3200),(5,9,0.146,8000),(5,10,-0.369,2200),
    (5,11,-0.154,10000),(5,12,0.136,3500),(5,13,-0.277,1200),

    -- =========================
    -- 6 Japan
    -- =========================
    (6,1,-0.375,3800),(6,2,-0.229,3500),(6,3,-0.091,6000),(6,4,0.022,12000),(6,5,-0.046,11500),
    (6,6,0.490,16000),(6,7,-0.119,5000),(6,8,-0.273,9000),(6,9,0.106,12500),(6,10,-0.232,4500),
    (6,11,-0.194,14000),(6,12,0.462,6500),(6,13,-0.303,2500),

    -- =========================
    -- 7 South Korea
    -- =========================
    (7,1,-0.417,3700),(7,2,-0.327,3400),(7,3,-0.353,5800),(7,4,0.080,11500),(7,5,-0.122,11000),
    (7,6,0.241,15000),(7,7,0.132,4800),(7,8,0.083,8800),(7,9,0.233,12000),(7,10,-0.128,4200),
    (7,11,-0.344,13500),(7,12,0.142,6200),(7,13,-0.122,2400),

    -- =========================
    -- 8 Brazil
    -- =========================
    (8,1,0.005,1500),(8,2,0.114,1400),(8,3,-0.157,2500),(8,4,0.005,6000),(8,5,0.003,5800),
    (8,6,0.331,8000),(8,7,-0.002,2000),(8,8,-0.101,3200),(8,9,-0.056,6500),(8,10,-0.098,1700),
    (8,11,-0.087,9000),(8,12,0.113,3000),(8,13,0.124,1000),

    -- =========================
    -- 9 Mexico
    -- =========================
    (9,1,-0.027,1400),(9,2,-0.252,1300),(9,3,0.018,2600),(9,4,-0.124,5800),(9,5,-0.193,5600),
    (9,6,-0.561,8500),(9,7,0.161,2100),(9,8,0.062,3100),(9,9,-0.024,6200),(9,10,-0.082,1600),
    (9,11,-0.134,8800),(9,12,-0.273,2900),(9,13,0.126,1100),

    -- =========================
    -- 10 UAE
    -- =========================
    (10,1,-0.427,4500),(10,2,0.118,4200),(10,3,-0.004,7500),(10,4,0.141,14000),(10,5,0.119,13500),
    (10,6,0.631,20000),(10,7,-0.055,6000),(10,8,0.107,9500),(10,9,0.045,14500),(10,10,0.044,5000),
    (10,11,-0.124,16000),(10,12,0.197,7000),(10,13,-0.256,2500),

    -- =========================
    -- 11 Poland
    -- =========================
    (11,1,-0.133,2400),(11,2,-0.131,2200),(11,3,-0.029,4200),(11,4,0.113,8500),(11,5,0.043,8200),
    (11,6,-0.142,7000),(11,7,0.105,3200),(11,8,0.110,4500),(11,9,0.176,9000),(11,10,-0.122,2600),
    (11,11,0.018,9500),(11,12,0.028,3800),(11,13,-0.133,1500),

    -- =========================
    -- 12 Germany
    -- =========================
    (12,1,0.062,4200),(12,2,-0.033,3900),(12,3,-0.078,6500),(12,4,0.095,12500),(12,5,0.067,12000),
    (12,6,-0.031,17000),(12,7,-0.025,5800),(12,8,-0.053,8500),(12,9,0.110,13000),(12,10,0.032,4800),
    (12,11,0.071,14500),(12,12,0.117,6200),(12,13,-0.177,2400),

    -- =========================
    -- 13 France
    -- =========================
    (13,1,-0.057,3900),(13,2,-0.311,3600),(13,3,-0.290,6000),(13,4,-0.023,11500),(13,5,-0.131,11000),
    (13,6,0.353,16000),(13,7,0.021,5200),(13,8,-0.027,8000),(13,9,0.026,12000),(13,10,-0.136,4500),
    (13,11,-0.263,13800),(13,12,0.166,5800),(13,13,-0.296,2200),

    -- =========================
    -- 14 Spain
    -- =========================
    (14,1,-0.150,3000),(14,2,-0.258,2800),(14,3,-0.428,5000),(14,4,-0.011,9000),(14,5,-0.054,8700),
    (14,6,0.201,13000),(14,7,0.183,4200),(14,8,0.008,6500),(14,9,-0.037,9800),(14,10,-0.338,3500),
    (14,11,-0.263,11000),(14,12,0.133,4500),(14,13,-0.064,1800),

    -- =========================
    -- 15 Italy
    -- =========================
    (15,1,0.030,3100),(15,2,-0.505,2900),(15,3,-0.296,5100),(15,4,-0.005,9200),(15,5,-0.158,8800),
    (15,6,0.143,13500),(15,7,-0.235,4300),(15,8,-0.256,6600),(15,9,-0.132,10000),(15,10,-0.048,3600),
    (15,11,-0.093,11200),(15,12,0.102,4600),(15,13,-0.420,1750),

    -- =========================
    -- 16 Czech Republic
    -- =========================
    (16,1,-0.221,2600),(16,2,0.059,2400),(16,3,0.007,4300),(16,4,0.003,8800),(16,5,0.041,8500),
    (16,6,-0.207,7200),(16,7,0.027,3300),(16,8,-0.014,4700),(16,9,-0.102,9200),(16,10,-0.004,2700),
    (16,11,0.031,9800),(16,12,0.007,3900),(16,13,0.054,1600),

    -- =========================
    -- 17 Finland
    -- =========================
    (17,1,-0.101,4300),(17,2,-0.488,4000),(17,3,-0.266,6700),(17,4,0.285,13000),(17,5,0.055,12500),
    (17,6,0.432,17500),(17,7,-0.297,6000),(17,8,-0.120,8600),(17,9,0.187,13500),(17,10,-0.021,5000),
    (17,11,-0.044,15000),(17,12,0.084,6500),(17,13,-0.402,2400),

    -- =========================
    -- 18 Sweden
    -- =========================
    (18,1,-0.014,4200),(18,2,-0.309,3900),(18,3,-0.144,6500),(18,4,0.196,12800),(18,5,0.098,12300),
    (18,6,0.262,17200),(18,7,-0.118,5900),(18,8,-0.236,8400),(18,9,-0.035,13200),(18,10,-0.050,4900),
    (18,11,0.084,14800),(18,12,0.094,6400),(18,13,-0.267,2300),

    -- =========================
    -- 19 Norway
    -- =========================
    (19,1,-0.121,5200),(19,2,-0.308,5000),(19,3,-0.046,7800),(19,4,0.078,14500),(19,5,-0.081,14000),
    (19,6,0.555,20000),(19,7,0.136,7000),(19,8,0.107,9800),(19,9,0.142,15000),(19,10,0.037,5800),
    (19,11,-0.028,16500),(19,12,0.016,7200),(19,13,-0.192,3000),

    -- =========================
    -- 20 Netherlands
    -- =========================
    (20,1,-0.127,4300),(20,2,-0.204,4000),(20,3,-0.395,6800),(20,4,-0.105,13000),(20,5,-0.212,12500),
    (20,6,0.100,17500),(20,7,-0.158,6000),(20,8,-0.110,8600),(20,9,-0.095,13500),(20,10,-0.238,5000),
    (20,11,-0.285,15000),(20,12,0.408,6500),(20,13,-0.222,2400),

    -- =========================
    -- 21 Portugal
    -- =========================
    (21,1,-0.150,2600),(21,2,-0.258,2400),(21,3,-0.428,4200),(21,4,-0.011,8200),(21,5,-0.054,7900),
    (21,6,0.201,12000),(21,7,0.183,3500),(21,8,0.008,5800),(21,9,-0.037,9000),(21,10,-0.338,3000),
    (21,11,-0.263,10200),(21,12,0.133,4200),(21,13,-0.064,1600),

    -- =========================
    -- 22 Bulgaria
    -- =========================
    (22,1,-0.082,1800),(22,2,-0.227,1600),(22,3,-0.244,3000),(22,4,0.048,6500),(22,5,0.018,6200),
    (22,6,0.233,8500),(22,7,0.004,2400),(22,8,-0.180,3500),(22,9,0.077,7000),(22,10,-0.204,1900),
    (22,11,-0.130,7800),(22,12,0.106,2800),(22,13,-0.053,1100),

    -- =========================
    -- 23 Greece
    -- =========================
    (23,1,0.030,2500),(23,2,-0.505,2300),(23,3,-0.296,4200),(23,4,-0.005,8000),(23,5,-0.158,7600),
    (23,6,0.143,11800),(23,7,-0.235,3400),(23,8,-0.256,5500),(23,9,-0.132,8600),(23,10,-0.048,2800),
    (23,11,-0.093,9800),(23,12,0.102,4000),(23,13,-0.420,1500),

    -- =========================
    -- 24 Austria
    -- =========================
    (24,1,-0.009,4300),(24,2,0.103,4000),(24,3,-0.015,6800),(24,4,-0.058,12800),(24,5,-0.021,12300),
    (24,6,-0.109,17500),(24,7,0.090,5900),(24,8,0.023,8500),(24,9,0.039,13300),(24,10,-0.128,5000),
    (24,11,-0.071,14800),(24,12,-0.084,6200),(24,13,0.131,2400),

    -- =========================
    -- 25 Belgium
    -- =========================
    (25,1,0.019,4200),(25,2,-0.682,3900),(25,3,-0.260,6600),(25,4,0.110,12600),(25,5,-0.094,12100),
    (25,6,0.702,17800),(25,7,-0.560,5800),(25,8,-0.327,8400),(25,9,-0.070,13100),(25,10,0.094,4900),
    (25,11,0.120,14600),(25,12,0.123,6300),(25,13,-0.675,2300),

    -- =========================
    -- 26 Romania
    -- =========================
    (26,1,0.000,1700),(26,2,-0.330,1500),(26,3,-0.246,2900),(26,4,0.073,6200),(26,5,0.005,6000),
    (26,6,0.249,8200),(26,7,-0.450,2300),(26,8,-0.341,3400),(26,9,-0.203,6800),(26,10,-0.071,1800),
    (26,11,-0.040,7600),(26,12,0.054,2700),(26,13,-0.116,1000),

    -- =========================
    -- 27 Switzerland
    -- =========================
    (27,1,0.134,6500),(27,2,-0.266,6200),(27,3,-0.404,9500),(27,4,0.083,17000),(27,5,0.031,16500),
    (27,6,0.126,24000),(27,7,-0.064,8500),(27,8,-0.173,12000),(27,9,0.034,18000),(27,10,-0.135,7000),
    (27,11,-0.205,20000),(27,12,-0.317,8500),(27,13,-0.251,3500),

    -- =========================
    -- 28 Australia
    -- =========================
    (28,1,-0.188,4300),(28,2,-0.337,4000),(28,3,-0.229,6700),(28,4,-0.135,12500),(28,5,-0.135,12000),
    (28,6,0.437,17500),(28,7,-0.269,5800),(28,8,-0.236,8500),(28,9,-0.187,13000),(28,10,-0.155,5000),
    (28,11,-0.161,14500),(28,12,0.275,6200),(28,13,-0.309,2400),

    -- =========================
    -- 29 Denmark
    -- =========================
    (29,1,-0.405,4500),(29,2,-0.343,4200),(29,3,-0.069,7000),(29,4,0.199,13200),(29,5,0.088,12700),
    (29,6,0.632,18200),(29,7,0.028,6200),(29,8,0.034,8900),(29,9,0.213,13800),(29,10,0.092,5200),
    (29,11,0.184,15200),(29,12,0.255,6700),(29,13,-0.230,2500),

    -- =========================
    -- 30 Turkey
    -- =========================
    (30,1,-0.093,1600),(30,2,-0.347,1500),(30,3,-0.441,2800),(30,4,-0.148,5500),(30,5,-0.107,5300),
    (30,6,0.169,7800),(30,7,-0.046,2100),(30,8,-0.258,3200),(30,9,-0.179,6200),(30,10,-0.283,1700),
    (30,11,-0.284,7000),(30,12,0.030,2600),(30,13,0.035,950);