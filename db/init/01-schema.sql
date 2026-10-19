/*M!999999\- enable the sandbox mode */ 

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `washworld_eksamen` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `washworld_eksamen`;
DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cars` (
  `car_id` char(32) NOT NULL,
  `car_plate` varchar(20) DEFAULT NULL,
  `car_user_fk` char(32) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `updated_at` bigint(20) DEFAULT NULL,
  `deleted_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`car_id`),
  KEY `user_fk` (`car_user_fk`),
  CONSTRAINT `cars_user_fk` FOREIGN KEY (`car_user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `favorite_id` varchar(32) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `location_id` varchar(255) NOT NULL,
  PRIMARY KEY (`favorite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `location_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_services` (
  `location_service_id` char(32) NOT NULL,
  `location_fk` char(32) NOT NULL,
  `service_fk` char(32) NOT NULL,
  PRIMARY KEY (`location_service_id`),
  KEY `location_fk` (`location_fk`),
  KEY `service_fk` (`service_fk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `location_id` char(32) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `location_adress` varchar(199) NOT NULL,
  `location_city` varchar(100) NOT NULL,
  `location_postal_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `updated_at` bigint(20) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `memberships` (
  `membership_id` char(32) NOT NULL,
  `membership_name` varchar(100) NOT NULL,
  `membership_description` varchar(255) NOT NULL,
  `membership_price` decimal(10,0) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  PRIMARY KEY (`membership_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `payment_gateway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_gateway` (
  `payment_gateway_id` char(32) NOT NULL,
  `payment_gateway_name` varchar(50) DEFAULT NULL,
  `payment_gateway_icon_path` char(32) NOT NULL,
  PRIMARY KEY (`payment_gateway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `transaction_id` char(32) NOT NULL,
  `transaction_user_fk` char(32) NOT NULL,
  `transaction_gateway_fk` char(32) NOT NULL,
  `transaction_membership_fk` char(32) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `transaction_membership_fk` (`transaction_membership_fk`),
  KEY `transaction_gateway_fk` (`transaction_gateway_fk`),
  KEY `transaction_user_fk` (`transaction_user_fk`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`transaction_membership_fk`) REFERENCES `memberships` (`membership_id`),
  CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`transaction_gateway_fk`) REFERENCES `payment_gateway` (`payment_gateway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_memberships` (
  `user_memberships_id` char(32) NOT NULL,
  `membership_user_fk` char(32) NOT NULL,
  `membership_fk` char(32) NOT NULL,
  `start_date` bigint(20) NOT NULL,
  `end_date` bigint(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `updated_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`user_memberships_id`),
  UNIQUE KEY `user_fk` (`membership_user_fk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` char(32) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `user_last_name` varchar(20) NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_address` varchar(255) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `deleted_at` bigint(20) DEFAULT NULL,
  `user_verification_key` char(32) DEFAULT NULL,
  `user_verified_at` bigint(20) DEFAULT NULL,
  `user_reset_password_key` char(64) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_verification_key` (`user_verification_key`),
  UNIQUE KEY `user_reset_password_key` (`user_reset_password_key`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `wash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wash` (
  `wash_id` char(32) NOT NULL,
  `membership_wash_fk` char(32) NOT NULL,
  `user_wash_fk` char(32) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  PRIMARY KEY (`wash_id`),
  KEY `membership_wash_fk` (`membership_wash_fk`),
  KEY `user_wash_fk` (`user_wash_fk`),
  CONSTRAINT `user_wash_fk` FOREIGN KEY (`user_wash_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wash_ibfk_1` FOREIGN KEY (`membership_wash_fk`) REFERENCES `memberships` (`membership_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

