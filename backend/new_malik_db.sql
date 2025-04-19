-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: malik_book
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_bankaccount`
--

DROP TABLE IF EXISTS `api_bankaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_bankaccount` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(200) DEFAULT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(100) DEFAULT NULL,
  `balance` double NOT NULL,
  `shop_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_bankaccount_shop_id_b3828380_fk_api_shop_id` (`shop_id`),
  CONSTRAINT `api_bankaccount_shop_id_b3828380_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_bankaccount`
--

LOCK TABLES `api_bankaccount` WRITE;
/*!40000 ALTER TABLE `api_bankaccount` DISABLE KEYS */;
INSERT INTO `api_bankaccount` VALUES (1,'SBI','Jahul Malik','934890234093','SBIN0017690',14445.5,1),(2,'IDFC','Jahul Malik','78573985756','IDFC0007459',133923,1),(4,'CANERA BANK','MALIK CANERA','CANR357398749','CAN63462786',16000,1),(5,'IDFC FIRST BANK','BILAL','09840982390','IDFC094983',0,4);
/*!40000 ALTER TABLE `api_bankaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_currency`
--

DROP TABLE IF EXISTS `api_currency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_currency` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `currency` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `currency` (`currency`),
  CONSTRAINT `api_currency_chk_1` CHECK ((`currency` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_currency`
--

LOCK TABLES `api_currency` WRITE;
/*!40000 ALTER TABLE `api_currency` DISABLE KEYS */;
INSERT INTO `api_currency` VALUES (1,1),(2,2),(3,5),(4,10),(5,20),(6,50),(7,100),(8,200),(9,500);
/*!40000 ALTER TABLE `api_currency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_customer`
--

DROP TABLE IF EXISTS `api_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_customer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_customer`
--

LOCK TABLES `api_customer` WRITE;
/*!40000 ALTER TABLE `api_customer` DISABLE KEYS */;
INSERT INTO `api_customer` VALUES (1,'Testing Customer','hey@gmail.com','7896541230','A-15, 2nd Floor, G.T Karnal Road, Industrial Area'),(2,'Shaikh Bilal','','90843905458','Delhi'),(3,'Customer Name','customer@gmail.com','9876541230','Dwarka Mor'),(4,'Lal Path Lab','hiteshuy468@gmail.com','9874563213','shastri nagar , near shastri nagar metro station');
/*!40000 ALTER TABLE `api_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dailybalance`
--

DROP TABLE IF EXISTS `api_dailybalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dailybalance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `shop_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_dailybalance_shop_id_a8501d1c_fk_api_shop_id` (`shop_id`),
  CONSTRAINT `api_dailybalance_shop_id_a8501d1c_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dailybalance`
--

LOCK TABLES `api_dailybalance` WRITE;
/*!40000 ALTER TABLE `api_dailybalance` DISABLE KEYS */;
INSERT INTO `api_dailybalance` VALUES (3,'2025-04-07',1),(4,'2025-04-07',4);
/*!40000 ALTER TABLE `api_dailybalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dailyclosingbankbalance`
--

DROP TABLE IF EXISTS `api_dailyclosingbankbalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dailyclosingbankbalance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bank_account_id` bigint DEFAULT NULL,
  `daily_balance_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_dailyclosingbank_bank_account_id_43aec8b5_fk_api_banka` (`bank_account_id`),
  KEY `api_dailyclosingbank_daily_balance_id_19e6f8cc_fk_api_daily` (`daily_balance_id`),
  CONSTRAINT `api_dailyclosingbank_bank_account_id_43aec8b5_fk_api_banka` FOREIGN KEY (`bank_account_id`) REFERENCES `api_bankaccount` (`id`),
  CONSTRAINT `api_dailyclosingbank_daily_balance_id_19e6f8cc_fk_api_daily` FOREIGN KEY (`daily_balance_id`) REFERENCES `api_dailybalance` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dailyclosingbankbalance`
--

LOCK TABLES `api_dailyclosingbankbalance` WRITE;
/*!40000 ALTER TABLE `api_dailyclosingbankbalance` DISABLE KEYS */;
INSERT INTO `api_dailyclosingbankbalance` VALUES (1,13445.5,1,3),(2,108923,2,3),(3,14000,4,3),(4,0,5,4);
/*!40000 ALTER TABLE `api_dailyclosingbankbalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dailyclosingcashbalance`
--

DROP TABLE IF EXISTS `api_dailyclosingcashbalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dailyclosingcashbalance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `daily_balance_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_dailyclosingcash_currency_id_227159ea_fk_api_curre` (`currency_id`),
  KEY `api_dailyclosingcash_daily_balance_id_f98274bd_fk_api_daily` (`daily_balance_id`),
  CONSTRAINT `api_dailyclosingcash_currency_id_227159ea_fk_api_curre` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_dailyclosingcash_daily_balance_id_f98274bd_fk_api_daily` FOREIGN KEY (`daily_balance_id`) REFERENCES `api_dailybalance` (`id`),
  CONSTRAINT `api_dailyclosingcashbalance_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dailyclosingcashbalance`
--

LOCK TABLES `api_dailyclosingcashbalance` WRITE;
/*!40000 ALTER TABLE `api_dailyclosingcashbalance` DISABLE KEYS */;
INSERT INTO `api_dailyclosingcashbalance` VALUES (1,184,1,3),(2,0,2,3),(3,30,3,3),(4,0,4,3),(5,16,5,3),(6,170,6,3),(7,70,7,3),(8,412,8,3),(9,1292,9,3),(10,0,1,4),(11,0,2,4),(12,0,3,4),(13,0,4,4),(14,0,5,4),(15,0,6,4),(16,0,7,4),(17,0,8,4),(18,0,9,4);
/*!40000 ALTER TABLE `api_dailyclosingcashbalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dailyopeningbankbalance`
--

DROP TABLE IF EXISTS `api_dailyopeningbankbalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dailyopeningbankbalance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bank_account_id` bigint DEFAULT NULL,
  `daily_balance_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_dailyopeningbank_bank_account_id_3fefba02_fk_api_banka` (`bank_account_id`),
  KEY `api_dailyopeningbank_daily_balance_id_7186d2d7_fk_api_daily` (`daily_balance_id`),
  CONSTRAINT `api_dailyopeningbank_bank_account_id_3fefba02_fk_api_banka` FOREIGN KEY (`bank_account_id`) REFERENCES `api_bankaccount` (`id`),
  CONSTRAINT `api_dailyopeningbank_daily_balance_id_7186d2d7_fk_api_daily` FOREIGN KEY (`daily_balance_id`) REFERENCES `api_dailybalance` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dailyopeningbankbalance`
--

LOCK TABLES `api_dailyopeningbankbalance` WRITE;
/*!40000 ALTER TABLE `api_dailyopeningbankbalance` DISABLE KEYS */;
INSERT INTO `api_dailyopeningbankbalance` VALUES (5,13445.5,1,3),(6,308923,2,3),(7,15500,4,3),(8,0,5,4);
/*!40000 ALTER TABLE `api_dailyopeningbankbalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_dailyopeningcashbalance`
--

DROP TABLE IF EXISTS `api_dailyopeningcashbalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dailyopeningcashbalance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `daily_balance_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_dailyopeningcash_currency_id_813713be_fk_api_curre` (`currency_id`),
  KEY `api_dailyopeningcash_daily_balance_id_12ecf57e_fk_api_daily` (`daily_balance_id`),
  CONSTRAINT `api_dailyopeningcash_currency_id_813713be_fk_api_curre` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_dailyopeningcash_daily_balance_id_12ecf57e_fk_api_daily` FOREIGN KEY (`daily_balance_id`) REFERENCES `api_dailybalance` (`id`),
  CONSTRAINT `api_dailyopeningcashbalance_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dailyopeningcashbalance`
--

LOCK TABLES `api_dailyopeningcashbalance` WRITE;
/*!40000 ALTER TABLE `api_dailyopeningcashbalance` DISABLE KEYS */;
INSERT INTO `api_dailyopeningcashbalance` VALUES (19,184,1,3),(20,0,2,3),(21,30,3,3),(22,0,4,3),(23,16,5,3),(24,170,6,3),(25,70,7,3),(26,412,8,3),(27,1292,9,3),(28,0,1,4),(29,0,2,4),(30,0,3,4),(31,0,4,4),(32,0,5,4),(33,0,6,4),(34,0,7,4),(35,0,8,4),(36,0,9,4);
/*!40000 ALTER TABLE `api_dailyopeningcashbalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_depositwithdrawhistory`
--

DROP TABLE IF EXISTS `api_depositwithdrawhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_depositwithdrawhistory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `type` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `shop_id` bigint NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_depositwithdrawhistory_created_by_id_bd3d4839_fk_api_user_id` (`created_by_id`),
  KEY `api_depositwithdrawhistory_shop_id_84381e3f_fk_api_shop_id` (`shop_id`),
  CONSTRAINT `api_depositwithdrawhistory_created_by_id_bd3d4839_fk_api_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_depositwithdrawhistory_shop_id_84381e3f_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_depositwithdrawhistory`
--

LOCK TABLES `api_depositwithdrawhistory` WRITE;
/*!40000 ALTER TABLE `api_depositwithdrawhistory` DISABLE KEYS */;
INSERT INTO `api_depositwithdrawhistory` VALUES (1,'2025-04-07','deposit','2025-04-07 09:17:11.944313','2025-04-07 09:17:11.944313',2,1,''),(2,'2025-04-07','withdraw','2025-04-07 09:17:24.830049','2025-04-07 09:17:24.830049',2,1,'');
/*!40000 ALTER TABLE `api_depositwithdrawhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_depositwithdrawhistorycashdenomination`
--

DROP TABLE IF EXISTS `api_depositwithdrawhistorycashdenomination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_depositwithdrawhistorycashdenomination` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `deposit_withdraw_history_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_depositwithdrawh_currency_id_b3226449_fk_api_curre` (`currency_id`),
  KEY `api_depositwithdrawh_deposit_withdraw_his_d44d30a8_fk_api_depos` (`deposit_withdraw_history_id`),
  CONSTRAINT `api_depositwithdrawh_currency_id_b3226449_fk_api_curre` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_depositwithdrawh_deposit_withdraw_his_d44d30a8_fk_api_depos` FOREIGN KEY (`deposit_withdraw_history_id`) REFERENCES `api_depositwithdrawhistory` (`id`),
  CONSTRAINT `api_depositwithdrawhistorycashdenomination_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_depositwithdrawhistorycashdenomination`
--

LOCK TABLES `api_depositwithdrawhistorycashdenomination` WRITE;
/*!40000 ALTER TABLE `api_depositwithdrawhistorycashdenomination` DISABLE KEYS */;
INSERT INTO `api_depositwithdrawhistorycashdenomination` VALUES (1,300,8,1),(2,68,9,1),(3,50,7,1),(4,100,6,1),(5,30,1,1),(6,10,5,1),(7,20,3,1);
/*!40000 ALTER TABLE `api_depositwithdrawhistorycashdenomination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_depositwithdrawhistorypaymentdetail`
--

DROP TABLE IF EXISTS `api_depositwithdrawhistorypaymentdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_depositwithdrawhistorypaymentdetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int unsigned NOT NULL,
  `bank_account_id` bigint DEFAULT NULL,
  `deposit_withdraw_history_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_depositwithdrawh_bank_account_id_783391e9_fk_api_banka` (`bank_account_id`),
  KEY `api_depositwithdrawh_deposit_withdraw_his_92655e8c_fk_api_depos` (`deposit_withdraw_history_id`),
  CONSTRAINT `api_depositwithdrawh_bank_account_id_783391e9_fk_api_banka` FOREIGN KEY (`bank_account_id`) REFERENCES `api_bankaccount` (`id`),
  CONSTRAINT `api_depositwithdrawh_deposit_withdraw_his_92655e8c_fk_api_depos` FOREIGN KEY (`deposit_withdraw_history_id`) REFERENCES `api_depositwithdrawhistory` (`id`),
  CONSTRAINT `api_depositwithdrawhistorypaymentdetail_chk_1` CHECK ((`amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_depositwithdrawhistorypaymentdetail`
--

LOCK TABLES `api_depositwithdrawhistorypaymentdetail` WRITE;
/*!40000 ALTER TABLE `api_depositwithdrawhistorypaymentdetail` DISABLE KEYS */;
INSERT INTO `api_depositwithdrawhistorypaymentdetail` VALUES (1,500,1,1),(2,4000,2,1),(3,4000,4,1),(4,500,4,2);
/*!40000 ALTER TABLE `api_depositwithdrawhistorypaymentdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_service`
--

DROP TABLE IF EXISTS `api_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `service_type_id` bigint NOT NULL,
  `note` longtext,
  `shop_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_service_created_by_id_0510348a_fk_api_user_id` (`created_by_id`),
  KEY `api_service_customer_id_ea58fa6d_fk_api_customer_id` (`customer_id`),
  KEY `api_service_service_type_id_60009dc5_fk_api_servicetype_id` (`service_type_id`),
  KEY `api_service_shop_id_0b480f74_fk_api_shop_id` (`shop_id`),
  CONSTRAINT `api_service_created_by_id_0510348a_fk_api_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_service_customer_id_ea58fa6d_fk_api_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `api_customer` (`id`),
  CONSTRAINT `api_service_service_type_id_60009dc5_fk_api_servicetype_id` FOREIGN KEY (`service_type_id`) REFERENCES `api_servicetype` (`id`),
  CONSTRAINT `api_service_shop_id_0b480f74_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_service`
--

LOCK TABLES `api_service` WRITE;
/*!40000 ALTER TABLE `api_service` DISABLE KEYS */;
INSERT INTO `api_service` VALUES (1,'2025-04-18 05:55:23.743183','2025-04-18 05:55:23.743183',1,1,1,'Remark',1),(2,'2025-04-18 06:18:37.843854','2025-04-18 06:18:37.843854',1,1,1,'',1);
/*!40000 ALTER TABLE `api_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_servicecashdinomination`
--

DROP TABLE IF EXISTS `api_servicecashdinomination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_servicecashdinomination` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_servicecashdinom_currency_id_78300bdc_fk_api_curre` (`currency_id`),
  KEY `api_servicecashdinom_service_id_6bb8c7f2_fk_api_servi` (`service_id`),
  CONSTRAINT `api_servicecashdinom_currency_id_78300bdc_fk_api_curre` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_servicecashdinom_service_id_6bb8c7f2_fk_api_servi` FOREIGN KEY (`service_id`) REFERENCES `api_service` (`id`),
  CONSTRAINT `api_servicecashdinomination_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_servicecashdinomination`
--

LOCK TABLES `api_servicecashdinomination` WRITE;
/*!40000 ALTER TABLE `api_servicecashdinomination` DISABLE KEYS */;
INSERT INTO `api_servicecashdinomination` VALUES (1,100,8,1),(2,10,1,1),(3,5,2,1),(4,20,8,2),(5,120,9,2),(6,20,7,2);
/*!40000 ALTER TABLE `api_servicecashdinomination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_servicepayment`
--

DROP TABLE IF EXISTS `api_servicepayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_servicepayment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int unsigned NOT NULL,
  `bank_account_id` bigint DEFAULT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_servicepayment_bank_account_id_aaea0a20_fk_api_banka` (`bank_account_id`),
  KEY `api_servicepayment_service_id_05bf7395_fk_api_service_id` (`service_id`),
  CONSTRAINT `api_servicepayment_bank_account_id_aaea0a20_fk_api_banka` FOREIGN KEY (`bank_account_id`) REFERENCES `api_bankaccount` (`id`),
  CONSTRAINT `api_servicepayment_service_id_05bf7395_fk_api_service_id` FOREIGN KEY (`service_id`) REFERENCES `api_service` (`id`),
  CONSTRAINT `api_servicepayment_chk_1` CHECK ((`amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_servicepayment`
--

LOCK TABLES `api_servicepayment` WRITE;
/*!40000 ALTER TABLE `api_servicepayment` DISABLE KEYS */;
INSERT INTO `api_servicepayment` VALUES (1,1000,1,1),(2,10000,2,1),(3,15000,2,2),(4,2000,4,2);
/*!40000 ALTER TABLE `api_servicepayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_servicetype`
--

DROP TABLE IF EXISTS `api_servicetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_servicetype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `service_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_type` (`service_type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_servicetype`
--

LOCK TABLES `api_servicetype` WRITE;
/*!40000 ALTER TABLE `api_servicetype` DISABLE KEYS */;
INSERT INTO `api_servicetype` VALUES (1,'Pan Correction'),(2,'Passport Apply');
/*!40000 ALTER TABLE `api_servicetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_shop`
--

DROP TABLE IF EXISTS `api_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_shop` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_shop`
--

LOCK TABLES `api_shop` WRITE;
/*!40000 ALTER TABLE `api_shop` DISABLE KEYS */;
INSERT INTO `api_shop` VALUES (1,'Malik Digital Seva','A-15, 2nd Floor, G.T Karnal Road, Industrial Area',NULL),(4,'Chaudhry Digital Kendra','Khajuri delhi','904385823490');
/*!40000 ALTER TABLE `api_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_shopcash`
--

DROP TABLE IF EXISTS `api_shopcash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_shopcash` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `shop_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_shopcash_shop_id_currency_id_7ce75e73_uniq` (`shop_id`,`currency_id`),
  KEY `api_shopcash_currency_id_30d9efca_fk_api_currency_id` (`currency_id`),
  CONSTRAINT `api_shopcash_currency_id_30d9efca_fk_api_currency_id` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_shopcash_shop_id_d4a93562_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`),
  CONSTRAINT `api_shopcash_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_shopcash`
--

LOCK TABLES `api_shopcash` WRITE;
/*!40000 ALTER TABLE `api_shopcash` DISABLE KEYS */;
INSERT INTO `api_shopcash` VALUES (1,532,8,1),(2,1412,9,1),(3,90,7,1),(4,170,6,1),(5,194,1,1),(6,16,5,1),(7,30,3,1),(8,0,1,4),(9,0,2,4),(10,0,3,4),(11,0,4,4),(12,0,5,4),(13,0,6,4),(14,0,7,4),(15,0,8,4),(16,0,9,4),(17,5,2,1),(18,0,4,1);
/*!40000 ALTER TABLE `api_shopcash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_transaction`
--

DROP TABLE IF EXISTS `api_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_transaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `remark` longtext,
  `customer_id` bigint NOT NULL,
  `shop_id` bigint DEFAULT NULL,
  `transaction_type_id` bigint DEFAULT NULL,
  `created_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_transaction_created_by_id_631dafcf_fk_api_user_id` (`created_by_id`),
  KEY `api_transaction_customer_id_a59c60b4_fk_api_customer_id` (`customer_id`),
  KEY `api_transaction_shop_id_398ac011_fk_api_shop_id` (`shop_id`),
  KEY `api_transaction_transaction_type_id_90048edc_fk_api_trans` (`transaction_type_id`),
  CONSTRAINT `api_transaction_created_by_id_631dafcf_fk_api_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `api_user` (`id`),
  CONSTRAINT `api_transaction_customer_id_a59c60b4_fk_api_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `api_customer` (`id`),
  CONSTRAINT `api_transaction_shop_id_398ac011_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`),
  CONSTRAINT `api_transaction_transaction_type_id_90048edc_fk_api_trans` FOREIGN KEY (`transaction_type_id`) REFERENCES `api_transactiontype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_transaction`
--

LOCK TABLES `api_transaction` WRITE;
/*!40000 ALTER TABLE `api_transaction` DISABLE KEYS */;
INSERT INTO `api_transaction` VALUES (1,'2025-03-29','2025-03-29 11:49:47.456456','2025-03-29 11:49:47.456456','note',1,1,1,1),(6,'2025-04-02','2025-04-02 11:00:04.652876','2025-04-02 11:00:04.652876',NULL,2,1,1,1),(8,'2025-04-02','2025-04-02 11:02:49.167005','2025-04-02 11:02:49.167005',NULL,2,1,1,1),(10,'2025-04-02','2025-04-02 11:05:37.039059','2025-04-02 11:05:37.039059',NULL,2,1,2,1),(12,'2025-04-02','2025-04-02 11:07:06.948878','2025-04-02 11:07:06.948878',NULL,2,1,2,1),(23,'2025-04-05','2025-04-04 20:54:49.940953','2025-04-04 20:54:49.940953','',1,1,1,2),(24,'2025-04-05','2025-04-04 20:57:55.267401','2025-04-04 20:57:55.267401','',3,1,1,2),(25,'2025-04-05','2025-04-04 20:59:32.036521','2025-04-04 20:59:32.036521','',2,1,1,2),(26,'2025-04-05','2025-04-04 21:04:00.739945','2025-04-04 21:04:00.740958','',2,1,1,2),(27,'2025-04-05','2025-04-04 21:23:05.041594','2025-04-04 21:23:05.041594','Receive ₹64,600 from sheikh bilal',2,1,2,2),(28,'2025-04-05','2025-04-05 10:30:26.599387','2025-04-05 10:30:26.599387','',3,1,1,2),(29,'2025-04-05','2025-04-05 11:23:16.708586','2025-04-05 11:23:16.708586','',1,1,2,2),(30,'2025-04-07','2025-04-07 13:28:41.105417','2025-04-07 13:28:41.105417','',1,1,1,1);
/*!40000 ALTER TABLE `api_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_transactioncashdenomination`
--

DROP TABLE IF EXISTS `api_transactioncashdenomination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_transactioncashdenomination` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `currency_id` bigint DEFAULT NULL,
  `transaction_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_transactioncashd_currency_id_537c7bfb_fk_api_curre` (`currency_id`),
  KEY `api_transactioncashd_transaction_id_08f4a91a_fk_api_trans` (`transaction_id`),
  CONSTRAINT `api_transactioncashd_currency_id_537c7bfb_fk_api_curre` FOREIGN KEY (`currency_id`) REFERENCES `api_currency` (`id`),
  CONSTRAINT `api_transactioncashd_transaction_id_08f4a91a_fk_api_trans` FOREIGN KEY (`transaction_id`) REFERENCES `api_transaction` (`id`),
  CONSTRAINT `api_transactioncashdenomination_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_transactioncashdenomination`
--

LOCK TABLES `api_transactioncashdenomination` WRITE;
/*!40000 ALTER TABLE `api_transactioncashdenomination` DISABLE KEYS */;
INSERT INTO `api_transactioncashdenomination` VALUES (1,2,9,1),(2,7,7,6),(5,42,7,12),(6,10,1,23),(7,2,1,24),(8,10,5,25),(9,100,8,27),(10,30,9,27),(11,20,7,27),(12,5,6,27),(13,140,1,27),(14,8,5,27),(15,10,3,27),(16,13,8,28),(17,46,9,28),(18,100,7,28),(19,5,6,28),(20,4,1,28),(21,32,5,28),(22,1200,9,29),(23,10,1,29);
/*!40000 ALTER TABLE `api_transactioncashdenomination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_transactionpaymentdetail`
--

DROP TABLE IF EXISTS `api_transactionpaymentdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_transactionpaymentdetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int unsigned NOT NULL,
  `bank_account_id` bigint DEFAULT NULL,
  `transaction_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_transactionpayme_bank_account_id_6b78815e_fk_api_banka` (`bank_account_id`),
  KEY `api_transactionpayme_transaction_id_1f0efa16_fk_api_trans` (`transaction_id`),
  CONSTRAINT `api_transactionpayme_bank_account_id_6b78815e_fk_api_banka` FOREIGN KEY (`bank_account_id`) REFERENCES `api_bankaccount` (`id`),
  CONSTRAINT `api_transactionpayme_transaction_id_1f0efa16_fk_api_trans` FOREIGN KEY (`transaction_id`) REFERENCES `api_transaction` (`id`),
  CONSTRAINT `api_transactionpaymentdetail_chk_1` CHECK ((`amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_transactionpaymentdetail`
--

LOCK TABLES `api_transactionpaymentdetail` WRITE;
/*!40000 ALTER TABLE `api_transactionpaymentdetail` DISABLE KEYS */;
INSERT INTO `api_transactionpaymentdetail` VALUES (1,500,1,1),(2,80500,1,8),(3,8900,1,10),(4,900,1,26),(5,5000,1,27),(6,10000,2,27),(7,12000,4,27),(8,55,1,28),(9,77,2,28),(10,12000,4,28),(11,45000,2,29),(12,12000,4,29),(13,200000,2,30),(14,1500,4,30);
/*!40000 ALTER TABLE `api_transactionpaymentdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_transactiontype`
--

DROP TABLE IF EXISTS `api_transactiontype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_transactiontype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_type` (`transaction_type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_transactiontype`
--

LOCK TABLES `api_transactiontype` WRITE;
/*!40000 ALTER TABLE `api_transactiontype` DISABLE KEYS */;
INSERT INTO `api_transactiontype` VALUES (1,'Pay'),(2,'Receive');
/*!40000 ALTER TABLE `api_transactiontype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user`
--

DROP TABLE IF EXISTS `api_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(200) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `role` varchar(200) DEFAULT NULL,
  `shop_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `name` (`name`),
  KEY `api_user_shop_id_f43cf39f_fk_api_shop_id` (`shop_id`),
  CONSTRAINT `api_user_shop_id_f43cf39f_fk_api_shop_id` FOREIGN KEY (`shop_id`) REFERENCES `api_shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user`
--

LOCK TABLES `api_user` WRITE;
/*!40000 ALTER TABLE `api_user` DISABLE KEYS */;
INSERT INTO `api_user` VALUES (1,'malik@gmail.com','Jahul Malik','malik@5676',1,'Admin',NULL),(2,'bilal01@gmail.com','Bilal Ahmad','bilal@5676',1,'User',1);
/*!40000 ALTER TABLE `api_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_usertoken`
--

DROP TABLE IF EXISTS `api_usertoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_usertoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_usertoken_user_id_5984b1b0_fk_api_user_id` (`user_id`),
  CONSTRAINT `api_usertoken_user_id_5984b1b0_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_usertoken`
--

LOCK TABLES `api_usertoken` WRITE;
/*!40000 ALTER TABLE `api_usertoken` DISABLE KEYS */;
INSERT INTO `api_usertoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMjQ2NDAyLCJpYXQiOjE3NDMyNDYxMDIsImp0aSI6ImRkY2ViMjQxOGUxYjRmN2JiZWFhMjk2MjE2ZmNlMzI1IiwidXNlcl9pZCI6MX0.yTxeLpHu7uZT8uleRpiB_X2ebyOlrtRITHkxGqyQdi4',1),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNzA2MjAzLCJpYXQiOjE3NDM3MDU5MDMsImp0aSI6ImYwNmYwMWYzODRiZDQxY2E4ZTM0MTk5ZTI4NzNkYjk3IiwidXNlcl9pZCI6Mn0.La7py4t9D5trh42FQPiU_7OluHDrv7DUaQ7kecN5moU',2);
/*!40000 ALTER TABLE `api_usertoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add bank account',7,'add_bankaccount'),(26,'Can change bank account',7,'change_bankaccount'),(27,'Can delete bank account',7,'delete_bankaccount'),(28,'Can view bank account',7,'view_bankaccount'),(29,'Can add currency',8,'add_currency'),(30,'Can change currency',8,'change_currency'),(31,'Can delete currency',8,'delete_currency'),(32,'Can view currency',8,'view_currency'),(33,'Can add customer',9,'add_customer'),(34,'Can change customer',9,'change_customer'),(35,'Can delete customer',9,'delete_customer'),(36,'Can view customer',9,'view_customer'),(37,'Can add daily balance',10,'add_dailybalance'),(38,'Can change daily balance',10,'change_dailybalance'),(39,'Can delete daily balance',10,'delete_dailybalance'),(40,'Can view daily balance',10,'view_dailybalance'),(41,'Can add shop',11,'add_shop'),(42,'Can change shop',11,'change_shop'),(43,'Can delete shop',11,'delete_shop'),(44,'Can view shop',11,'view_shop'),(45,'Can add transaction type',12,'add_transactiontype'),(46,'Can change transaction type',12,'change_transactiontype'),(47,'Can delete transaction type',12,'delete_transactiontype'),(48,'Can view transaction type',12,'view_transactiontype'),(49,'Can add daily closing bank balance',13,'add_dailyclosingbankbalance'),(50,'Can change daily closing bank balance',13,'change_dailyclosingbankbalance'),(51,'Can delete daily closing bank balance',13,'delete_dailyclosingbankbalance'),(52,'Can view daily closing bank balance',13,'view_dailyclosingbankbalance'),(53,'Can add daily closing cash balance',14,'add_dailyclosingcashbalance'),(54,'Can change daily closing cash balance',14,'change_dailyclosingcashbalance'),(55,'Can delete daily closing cash balance',14,'delete_dailyclosingcashbalance'),(56,'Can view daily closing cash balance',14,'view_dailyclosingcashbalance'),(57,'Can add daily opening bank balance',15,'add_dailyopeningbankbalance'),(58,'Can change daily opening bank balance',15,'change_dailyopeningbankbalance'),(59,'Can delete daily opening bank balance',15,'delete_dailyopeningbankbalance'),(60,'Can view daily opening bank balance',15,'view_dailyopeningbankbalance'),(61,'Can add daily opening cash balance',16,'add_dailyopeningcashbalance'),(62,'Can change daily opening cash balance',16,'change_dailyopeningcashbalance'),(63,'Can delete daily opening cash balance',16,'delete_dailyopeningcashbalance'),(64,'Can view daily opening cash balance',16,'view_dailyopeningcashbalance'),(65,'Can add transaction',17,'add_transaction'),(66,'Can change transaction',17,'change_transaction'),(67,'Can delete transaction',17,'delete_transaction'),(68,'Can view transaction',17,'view_transaction'),(69,'Can add transaction cash denomination',18,'add_transactioncashdenomination'),(70,'Can change transaction cash denomination',18,'change_transactioncashdenomination'),(71,'Can delete transaction cash denomination',18,'delete_transactioncashdenomination'),(72,'Can view transaction cash denomination',18,'view_transactioncashdenomination'),(73,'Can add transaction payment detail',19,'add_transactionpaymentdetail'),(74,'Can change transaction payment detail',19,'change_transactionpaymentdetail'),(75,'Can delete transaction payment detail',19,'delete_transactionpaymentdetail'),(76,'Can view transaction payment detail',19,'view_transactionpaymentdetail'),(77,'Can add user',20,'add_user'),(78,'Can change user',20,'change_user'),(79,'Can delete user',20,'delete_user'),(80,'Can view user',20,'view_user'),(81,'Can add user token',21,'add_usertoken'),(82,'Can change user token',21,'change_usertoken'),(83,'Can delete user token',21,'delete_usertoken'),(84,'Can view user token',21,'view_usertoken'),(85,'Can add shop cash',22,'add_shopcash'),(86,'Can change shop cash',22,'change_shopcash'),(87,'Can delete shop cash',22,'delete_shopcash'),(88,'Can view shop cash',22,'view_shopcash'),(89,'Can add deposit withdraw history cash denomination',23,'add_depositwithdrawhistorycashdenomination'),(90,'Can change deposit withdraw history cash denomination',23,'change_depositwithdrawhistorycashdenomination'),(91,'Can delete deposit withdraw history cash denomination',23,'delete_depositwithdrawhistorycashdenomination'),(92,'Can view deposit withdraw history cash denomination',23,'view_depositwithdrawhistorycashdenomination'),(93,'Can add deposit withdraw history',24,'add_depositwithdrawhistory'),(94,'Can change deposit withdraw history',24,'change_depositwithdrawhistory'),(95,'Can delete deposit withdraw history',24,'delete_depositwithdrawhistory'),(96,'Can view deposit withdraw history',24,'view_depositwithdrawhistory'),(97,'Can add deposit withdraw history payment detail',25,'add_depositwithdrawhistorypaymentdetail'),(98,'Can change deposit withdraw history payment detail',25,'change_depositwithdrawhistorypaymentdetail'),(99,'Can delete deposit withdraw history payment detail',25,'delete_depositwithdrawhistorypaymentdetail'),(100,'Can view deposit withdraw history payment detail',25,'view_depositwithdrawhistorypaymentdetail'),(101,'Can add crontab',26,'add_crontabschedule'),(102,'Can change crontab',26,'change_crontabschedule'),(103,'Can delete crontab',26,'delete_crontabschedule'),(104,'Can view crontab',26,'view_crontabschedule'),(105,'Can add interval',27,'add_intervalschedule'),(106,'Can change interval',27,'change_intervalschedule'),(107,'Can delete interval',27,'delete_intervalschedule'),(108,'Can view interval',27,'view_intervalschedule'),(109,'Can add periodic task',28,'add_periodictask'),(110,'Can change periodic task',28,'change_periodictask'),(111,'Can delete periodic task',28,'delete_periodictask'),(112,'Can view periodic task',28,'view_periodictask'),(113,'Can add periodic task track',29,'add_periodictasks'),(114,'Can change periodic task track',29,'change_periodictasks'),(115,'Can delete periodic task track',29,'delete_periodictasks'),(116,'Can view periodic task track',29,'view_periodictasks'),(117,'Can add solar event',30,'add_solarschedule'),(118,'Can change solar event',30,'change_solarschedule'),(119,'Can delete solar event',30,'delete_solarschedule'),(120,'Can view solar event',30,'view_solarschedule'),(121,'Can add clocked',31,'add_clockedschedule'),(122,'Can change clocked',31,'change_clockedschedule'),(123,'Can delete clocked',31,'delete_clockedschedule'),(124,'Can view clocked',31,'view_clockedschedule'),(125,'Can add service',32,'add_service'),(126,'Can change service',32,'change_service'),(127,'Can delete service',32,'delete_service'),(128,'Can view service',32,'view_service'),(129,'Can add service type',33,'add_servicetype'),(130,'Can change service type',33,'change_servicetype'),(131,'Can delete service type',33,'delete_servicetype'),(132,'Can view service type',33,'view_servicetype'),(133,'Can add service payment',34,'add_servicepayment'),(134,'Can change service payment',34,'change_servicepayment'),(135,'Can delete service payment',34,'delete_servicepayment'),(136,'Can view service payment',34,'view_servicepayment'),(137,'Can add service cash dinomination',35,'add_servicecashdinomination'),(138,'Can change service cash dinomination',35,'change_servicecashdinomination'),(139,'Can delete service cash dinomination',35,'delete_servicecashdinomination'),(140,'Can view service cash dinomination',35,'view_servicecashdinomination');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$720000$xSUg9tZgehL58oOil6g4Bx$KaRK2P8UabwsnWPttZHzwyu4N3MgEK3z/QEm1pm7J1I=','2025-04-07 13:10:23.484150',1,'malik@gmail.com','','','',1,1,'2025-03-29 10:40:26.835514'),(2,'pbkdf2_sha256$720000$pTa7oJwDjShFV4M7NcufAW$2OEmjtlkt5lbCHesoTyGVPCMt7UVJ4Ub9z2kqm137wM=','2025-04-05 11:29:00.230520',1,'bilal01@gmail.com','','','',1,1,'2025-03-29 10:41:07.625567'),(3,'pbkdf2_sha256$720000$31Vkdq624GUA4DUq72JF0J$FXaYbXB8WRK1Zpl6iy+tXVNvcMwuqf7HsswXoE64ZJw=','2025-04-04 05:46:17.687533',1,'harsh@partsklik.com','','','',1,1,'2025-03-29 10:41:32.865318'),(4,'pbkdf2_sha256$870000$cJJJ7yGbxNTaweVW04oIP4$MEdpjWc17yOeKpOBMPfBliMfKlzljBskhPBrSS20Tew=','2025-03-30 06:31:18.491375',1,'harsh@gmail.com','','','harsh@gmail.com',1,1,'2025-03-30 06:30:39.725297');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-03-29 10:42:01.533570','1','Shop',1,'[{\"added\": {}}]',11,1),(2,'2025-03-29 10:43:44.459608','1','malik@gmail.com => Jahul Malik => None',1,'[{\"added\": {}}]',20,1),(3,'2025-03-29 10:44:13.855110','1','Malik Digital Seva',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',11,1),(4,'2025-03-29 10:44:21.903452','2','bilal01@gmail.com => Bilal Ahmad => Malik Digital Seva',1,'[{\"added\": {}}]',20,1),(5,'2025-03-29 10:45:16.682756','1','Malik Digital Seva => Jahul Malik => 934890234093 ',1,'[{\"added\": {}}]',7,1),(6,'2025-03-29 10:45:58.910841','2','Malik Digital Seva => Jahul Malik => 78573985756 ',1,'[{\"added\": {}}]',7,1),(7,'2025-03-29 10:49:41.431670','1','1',1,'[{\"added\": {}}]',8,1),(8,'2025-03-29 10:49:44.842401','2','2',1,'[{\"added\": {}}]',8,1),(9,'2025-03-29 10:49:49.771072','3','5',1,'[{\"added\": {}}]',8,1),(10,'2025-03-29 10:49:53.129850','4','10',1,'[{\"added\": {}}]',8,1),(11,'2025-03-29 10:50:00.699404','5','20',1,'[{\"added\": {}}]',8,1),(12,'2025-03-29 10:50:07.134235','6','50',1,'[{\"added\": {}}]',8,1),(13,'2025-03-29 10:50:14.407307','7','100',1,'[{\"added\": {}}]',8,1),(14,'2025-03-29 10:50:19.571445','8','200',1,'[{\"added\": {}}]',8,1),(15,'2025-03-29 10:50:24.233012','9','500',1,'[{\"added\": {}}]',8,1),(16,'2025-03-29 10:50:52.687786','1','Malik Digital Seva => 25 x 200',1,'[{\"added\": {}}]',22,1),(17,'2025-03-29 10:51:01.268640','2','Malik Digital Seva => 40 x 500',1,'[{\"added\": {}}]',22,1),(18,'2025-03-29 10:51:12.501462','3','Malik Digital Seva => 65 x 100',1,'[{\"added\": {}}]',22,1),(19,'2025-03-29 10:51:31.805845','4','Malik Digital Seva => 70 x 50',1,'[{\"added\": {}}]',22,1),(20,'2025-03-29 10:51:42.347056','5','Malik Digital Seva => 20 x 1',1,'[{\"added\": {}}]',22,1),(21,'2025-03-29 10:52:02.424603','6','Malik Digital Seva => 40 x 20',1,'[{\"added\": {}}]',22,1),(22,'2025-03-29 11:14:28.277775','1','Malik Digital Seva => Jahul Malik => 934890234093 ',2,'[]',7,1),(23,'2025-03-29 11:48:56.312869','1','Testing Customer',1,'[{\"added\": {}}]',9,3),(24,'2025-03-29 11:49:10.097882','1','Pay',1,'[{\"added\": {}}]',12,3),(25,'2025-03-29 11:49:17.784228','2','Receive',1,'[{\"added\": {}}]',12,3),(26,'2025-03-29 11:49:47.528507','1','2025-03-29 => Malik Digital Seva',1,'[{\"added\": {}}]',17,3),(27,'2025-03-29 11:50:15.635396','1','2025-03-29 => 500 => 2',1,'[{\"added\": {}}]',18,3),(28,'2025-03-29 11:50:50.700651','1','1 => Jahul Malik => 500',1,'[{\"added\": {}}]',19,3),(29,'2025-04-02 11:08:39.286849','7','Malik Digital Seva => 0 x 5',1,'[{\"added\": {}}]',22,1),(30,'2025-04-03 17:36:31.992355','2','Harsh Digital Seva',1,'[{\"added\": {}}]',11,4),(31,'2025-04-03 17:38:24.460916','3','Customer Name',1,'[{\"added\": {}}]',9,4),(32,'2025-04-04 18:04:58.493292','3','Malik Digital Seva => IDFCC => 276876587hfsghfg27367 ',1,'[{\"added\": {}}]',7,4),(33,'2025-04-04 18:05:49.440656','4','Malik Digital Seva => MALIK CANERA => CANR357398749 ',1,'[{\"added\": {}}]',7,4),(34,'2025-04-04 18:06:05.158704','3','Malik Digital Seva => IDFCC => 276876587hfsghfg27367 ',3,'',7,4),(35,'2025-04-05 11:46:10.441401','3','SHop1',3,'',11,2),(36,'2025-04-05 11:46:10.443401','2','Harsh Digital Seva',3,'',11,2),(37,'2025-04-07 12:17:40.569573','1','2025-04-07 => Malik Digital Seva',1,'[{\"added\": {}}]',10,1),(38,'2025-04-07 12:20:45.838939','1','1 => Jahul Malik => 13445.5',1,'[{\"added\": {}}]',15,1),(39,'2025-04-07 12:21:15.529205','2','1 => Jahul Malik => 308923.0',1,'[{\"added\": {}}]',15,1),(40,'2025-04-07 12:21:40.103289','3','1 => MALIK CANERA => 15500.0',1,'[{\"added\": {}}]',15,1),(41,'2025-04-07 12:22:06.356332','1','1 => 1 x 184',1,'[{\"added\": {}}]',16,1),(42,'2025-04-07 12:22:13.269102','2','1 => 2 x 30',1,'[{\"added\": {}}]',16,1),(43,'2025-04-07 12:23:06.282587','17','Malik Digital Seva => 0 x 2',1,'[{\"added\": {}}]',22,1),(44,'2025-04-07 12:23:32.583417','18','Malik Digital Seva => 0 x 10',1,'[{\"added\": {}}]',22,1),(45,'2025-04-07 12:24:14.035528','2','1 => 2 x 0',2,'[{\"changed\": {\"fields\": [\"Quantity\"]}}]',16,1),(46,'2025-04-07 12:24:22.563642','3','1 => 5 x 30',1,'[{\"added\": {}}]',16,1),(47,'2025-04-07 12:24:27.001175','4','1 => 10 x 0',1,'[{\"added\": {}}]',16,1),(48,'2025-04-07 12:24:43.129606','5','1 => 20 x 16',1,'[{\"added\": {}}]',16,1),(49,'2025-04-07 12:24:49.275699','6','1 => 50 x 170',1,'[{\"added\": {}}]',16,1),(50,'2025-04-07 12:24:55.139900','7','1 => 100 x 70',1,'[{\"added\": {}}]',16,1),(51,'2025-04-07 12:25:03.763661','8','1 => 200 x 412',1,'[{\"added\": {}}]',16,1),(52,'2025-04-07 12:25:15.034667','9','1 => 500 x 1292',1,'[{\"added\": {}}]',16,1),(53,'2025-04-07 13:10:52.403491','2','2025-04-07 => Chaudhry Digital Kendra',3,'',10,1),(54,'2025-04-07 13:10:52.404679','1','2025-04-07 => Malik Digital Seva',3,'',10,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_clockedschedule`
--

DROP TABLE IF EXISTS `django_celery_beat_clockedschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_clockedschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clocked_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_clockedschedule`
--

LOCK TABLES `django_celery_beat_clockedschedule` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_clockedschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_celery_beat_clockedschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_crontabschedule`
--

DROP TABLE IF EXISTS `django_celery_beat_crontabschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_crontabschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `minute` varchar(240) NOT NULL,
  `hour` varchar(96) NOT NULL,
  `day_of_week` varchar(64) NOT NULL,
  `day_of_month` varchar(124) NOT NULL,
  `month_of_year` varchar(64) NOT NULL,
  `timezone` varchar(63) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_crontabschedule`
--

LOCK TABLES `django_celery_beat_crontabschedule` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_crontabschedule` DISABLE KEYS */;
INSERT INTO `django_celery_beat_crontabschedule` VALUES (1,'5','0','*','*','*','UTC'),(2,'55','23','*','*','*','UTC');
/*!40000 ALTER TABLE `django_celery_beat_crontabschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_intervalschedule`
--

DROP TABLE IF EXISTS `django_celery_beat_intervalschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_intervalschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `every` int NOT NULL,
  `period` varchar(24) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_intervalschedule`
--

LOCK TABLES `django_celery_beat_intervalschedule` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_intervalschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_celery_beat_intervalschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_periodictask`
--

DROP TABLE IF EXISTS `django_celery_beat_periodictask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_periodictask` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `task` varchar(200) NOT NULL,
  `args` longtext NOT NULL,
  `kwargs` longtext NOT NULL,
  `queue` varchar(200) DEFAULT NULL,
  `exchange` varchar(200) DEFAULT NULL,
  `routing_key` varchar(200) DEFAULT NULL,
  `expires` datetime(6) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `last_run_at` datetime(6) DEFAULT NULL,
  `total_run_count` int unsigned NOT NULL,
  `date_changed` datetime(6) NOT NULL,
  `description` longtext NOT NULL,
  `crontab_id` int DEFAULT NULL,
  `interval_id` int DEFAULT NULL,
  `solar_id` int DEFAULT NULL,
  `one_off` tinyint(1) NOT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `priority` int unsigned DEFAULT NULL,
  `headers` longtext NOT NULL DEFAULT (_utf8mb3'{}'),
  `clocked_id` int DEFAULT NULL,
  `expire_seconds` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `django_celery_beat_p_crontab_id_d3cba168_fk_django_ce` (`crontab_id`),
  KEY `django_celery_beat_p_interval_id_a8ca27da_fk_django_ce` (`interval_id`),
  KEY `django_celery_beat_p_solar_id_a87ce72c_fk_django_ce` (`solar_id`),
  KEY `django_celery_beat_p_clocked_id_47a69f82_fk_django_ce` (`clocked_id`),
  CONSTRAINT `django_celery_beat_p_clocked_id_47a69f82_fk_django_ce` FOREIGN KEY (`clocked_id`) REFERENCES `django_celery_beat_clockedschedule` (`id`),
  CONSTRAINT `django_celery_beat_p_crontab_id_d3cba168_fk_django_ce` FOREIGN KEY (`crontab_id`) REFERENCES `django_celery_beat_crontabschedule` (`id`),
  CONSTRAINT `django_celery_beat_p_interval_id_a8ca27da_fk_django_ce` FOREIGN KEY (`interval_id`) REFERENCES `django_celery_beat_intervalschedule` (`id`),
  CONSTRAINT `django_celery_beat_p_solar_id_a87ce72c_fk_django_ce` FOREIGN KEY (`solar_id`) REFERENCES `django_celery_beat_solarschedule` (`id`),
  CONSTRAINT `django_celery_beat_periodictask_chk_1` CHECK ((`total_run_count` >= 0)),
  CONSTRAINT `django_celery_beat_periodictask_chk_2` CHECK ((`priority` >= 0)),
  CONSTRAINT `django_celery_beat_periodictask_chk_3` CHECK ((`expire_seconds` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_periodictask`
--

LOCK TABLES `django_celery_beat_periodictask` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_periodictask` DISABLE KEYS */;
INSERT INTO `django_celery_beat_periodictask` VALUES (1,'Feed Opening Balance','api.tasks.feed_opening_balance','[]','{}',NULL,NULL,NULL,NULL,1,NULL,0,'2025-04-07 13:22:58.390590','',1,NULL,NULL,0,NULL,NULL,'{}',NULL,NULL),(2,'Feed Closing Balance','api.tasks.feed_closing_balance','[]','{}',NULL,NULL,NULL,NULL,1,NULL,0,'2025-04-07 13:26:19.233071','',2,NULL,NULL,0,NULL,NULL,'{}',NULL,NULL);
/*!40000 ALTER TABLE `django_celery_beat_periodictask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_periodictasks`
--

DROP TABLE IF EXISTS `django_celery_beat_periodictasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_periodictasks` (
  `ident` smallint NOT NULL,
  `last_update` datetime(6) NOT NULL,
  PRIMARY KEY (`ident`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_periodictasks`
--

LOCK TABLES `django_celery_beat_periodictasks` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_periodictasks` DISABLE KEYS */;
INSERT INTO `django_celery_beat_periodictasks` VALUES (1,'2025-04-07 13:26:19.234072');
/*!40000 ALTER TABLE `django_celery_beat_periodictasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_celery_beat_solarschedule`
--

DROP TABLE IF EXISTS `django_celery_beat_solarschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_celery_beat_solarschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event` varchar(24) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq` (`event`,`latitude`,`longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_celery_beat_solarschedule`
--

LOCK TABLES `django_celery_beat_solarschedule` WRITE;
/*!40000 ALTER TABLE `django_celery_beat_solarschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_celery_beat_solarschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(7,'api','bankaccount'),(8,'api','currency'),(9,'api','customer'),(10,'api','dailybalance'),(13,'api','dailyclosingbankbalance'),(14,'api','dailyclosingcashbalance'),(15,'api','dailyopeningbankbalance'),(16,'api','dailyopeningcashbalance'),(24,'api','depositwithdrawhistory'),(23,'api','depositwithdrawhistorycashdenomination'),(25,'api','depositwithdrawhistorypaymentdetail'),(32,'api','service'),(35,'api','servicecashdinomination'),(34,'api','servicepayment'),(33,'api','servicetype'),(11,'api','shop'),(22,'api','shopcash'),(17,'api','transaction'),(18,'api','transactioncashdenomination'),(19,'api','transactionpaymentdetail'),(12,'api','transactiontype'),(20,'api','user'),(21,'api','usertoken'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(31,'django_celery_beat','clockedschedule'),(26,'django_celery_beat','crontabschedule'),(27,'django_celery_beat','intervalschedule'),(28,'django_celery_beat','periodictask'),(29,'django_celery_beat','periodictasks'),(30,'django_celery_beat','solarschedule'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-03-29 10:38:58.563462'),(2,'auth','0001_initial','2025-03-29 10:39:00.868722'),(3,'admin','0001_initial','2025-03-29 10:39:01.498069'),(4,'admin','0002_logentry_remove_auto_add','2025-03-29 10:39:01.538072'),(5,'admin','0003_logentry_add_action_flag_choices','2025-03-29 10:39:01.580137'),(6,'api','0001_initial','2025-03-29 10:39:06.955426'),(7,'contenttypes','0002_remove_content_type_name','2025-03-29 10:39:07.358642'),(8,'auth','0002_alter_permission_name_max_length','2025-03-29 10:39:07.533186'),(9,'auth','0003_alter_user_email_max_length','2025-03-29 10:39:07.621708'),(10,'auth','0004_alter_user_username_opts','2025-03-29 10:39:07.665708'),(11,'auth','0005_alter_user_last_login_null','2025-03-29 10:39:07.852905'),(12,'auth','0006_require_contenttypes_0002','2025-03-29 10:39:07.891429'),(13,'auth','0007_alter_validators_add_error_messages','2025-03-29 10:39:07.930424'),(14,'auth','0008_alter_user_username_max_length','2025-03-29 10:39:08.108541'),(15,'auth','0009_alter_user_last_name_max_length','2025-03-29 10:39:08.294070'),(16,'auth','0010_alter_group_name_max_length','2025-03-29 10:39:08.390157'),(17,'auth','0011_update_proxy_permissions','2025-03-29 10:39:08.533704'),(18,'auth','0012_alter_user_first_name_max_length','2025-03-29 10:39:08.704405'),(19,'sessions','0001_initial','2025-03-29 10:39:08.910990'),(20,'api','0002_alter_customer_email','2025-03-29 11:48:53.363257'),(21,'api','0003_depositwithdrawhistory_and_more','2025-04-05 10:59:35.757050'),(22,'api','0004_depositwithdrawhistory_remark','2025-04-07 09:10:15.248501'),(23,'api','0005_alter_depositwithdrawhistory_date','2025-04-07 09:10:15.254499'),(24,'api','0006_alter_dailyclosingbankbalance_amount_and_more','2025-04-07 12:20:40.766341'),(25,'django_celery_beat','0001_initial','2025-04-07 13:15:08.249814'),(26,'django_celery_beat','0002_auto_20161118_0346','2025-04-07 13:15:08.300815'),(27,'django_celery_beat','0003_auto_20161209_0049','2025-04-07 13:15:08.315819'),(28,'django_celery_beat','0004_auto_20170221_0000','2025-04-07 13:15:08.318820'),(29,'django_celery_beat','0005_add_solarschedule_events_choices','2025-04-07 13:15:08.320818'),(30,'django_celery_beat','0006_auto_20180322_0932','2025-04-07 13:15:08.375998'),(31,'django_celery_beat','0007_auto_20180521_0826','2025-04-07 13:15:08.410995'),(32,'django_celery_beat','0008_auto_20180914_1922','2025-04-07 13:15:08.431506'),(33,'django_celery_beat','0006_auto_20180210_1226','2025-04-07 13:15:08.444506'),(34,'django_celery_beat','0006_periodictask_priority','2025-04-07 13:15:08.488507'),(35,'django_celery_beat','0009_periodictask_headers','2025-04-07 13:15:08.551019'),(36,'django_celery_beat','0010_auto_20190429_0326','2025-04-07 13:15:08.667539'),(37,'django_celery_beat','0011_auto_20190508_0153','2025-04-07 13:15:08.726545'),(38,'django_celery_beat','0012_periodictask_expire_seconds','2025-04-07 13:15:08.775054'),(39,'django_celery_beat','0013_auto_20200609_0727','2025-04-07 13:15:08.801055'),(40,'django_celery_beat','0014_remove_clockedschedule_enabled','2025-04-07 13:15:08.813054'),(41,'django_celery_beat','0015_edit_solarschedule_events_choices','2025-04-07 13:15:08.816058'),(42,'django_celery_beat','0016_alter_crontabschedule_timezone','2025-04-07 13:15:08.823059'),(43,'django_celery_beat','0017_alter_crontabschedule_month_of_year','2025-04-07 13:15:08.828062'),(44,'django_celery_beat','0018_improve_crontab_helptext','2025-04-07 13:15:08.833478'),(45,'django_celery_beat','0019_alter_periodictasks_options','2025-04-07 13:15:08.835477'),(46,'api','0007_servicetype_service_servicecashdinomination_and_more','2025-04-15 06:44:55.374061'),(47,'api','0008_service_note','2025-04-15 07:22:35.635321'),(48,'api','0009_service_shop','2025-04-15 07:39:19.332451'),(49,'api','0010_alter_transaction_shop','2025-04-18 06:02:43.828085');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('2e65a2d4u879kyms0rdgfxycm7p4vl0x','.eJxVjMsOwiAQRf-FtSHlDS7d-w1kBhipGkhKuzL-uzbpQrf3nHNfLMK21riNssQ5szNT7PS7IaRHaTvId2i3zlNv6zIj3xV-0MGvPZfn5XD_DiqM-q0xTDrbJNALSJKcoyQtGONcIUKhkbRRohRnjZ1QKaOdRwo-QFCkrWTvD-67N7s:1tyUe4:0lRzqOqCz9h7iiIajdPzvOlWuoXlyGKPcvJJC6Bzq2A','2025-04-12 11:46:36.889401'),('2j49ypkkvnezhgpkycieqdhyon3g201r','.eJxVjEEOwiAQRe_C2hBgMgVcuvcMBGamUjU0Ke3KeHdt0oVu_3vvv1TK21rT1mVJE6uzAnX63Uqmh7Qd8D2326xpbusyFb0r-qBdX2eW5-Vw_w5q7vVbY4hEQyATwIKwjxYMInDBAlLIMQvlYAH9aA0hOzNQYHFhdNFy8er9Ad8XOAI:1u0Zsf:N38xM1Nsm8jpZ5VIq_Pe-rH6O5uvfuRpxIxHatbvwtU','2025-04-18 05:46:17.748733'),('814g494t3iuc4llf2fl4v02vpljh4mhz','.eJxVjMsOwiAQRf-FtSEwPIa6dO83kBkgUjWQlHZl_Hdt0oVu7znnvkSkba1xG2WJcxZnocXpd2NKj9J2kO_Ubl2m3tZlZrkr8qBDXnsuz8vh_h1UGvVbQwKcJpXIZaNM8hAKWPZWe1CGrc0ExSMbnZjJokKC4MkFR6ixGBbvD8MLNyc:1tyTdH:-kVcILEowAGIAZTWWyj30Ide2P86aYUlxHKP5kL_TKA','2025-04-12 10:41:43.492677'),('8ansqcmwaoeexy3iy7temsijdohspfmd','.eJxVjEEOwiAQRe_C2hDAUsCle89AZphBqoYmpV0Z7y5NutDtf-_9t4iwrSVujZc4kbgILU6_G0J6ct0BPaDeZ5nmui4Tyl2RB23yNhO_rof7d1CglV5nF5Ihi9YHDRasgzGRy4FMJzh4IuUxw-D4rNmw6oaj0aasAAizE58v_2E5BQ:1u1lPh:OHHo02NXhKc_tm-8smV9ef6dE6uHft8osqgyInwLD2o','2025-04-21 12:17:17.278681'),('96po6zmq8os0nb94ijxn2xnir04j999s','.eJxVjMsOwiAQRf-FtSEwPIa6dO83kBkgUjWQlHZl_Hdt0oVu7znnvkSkba1xG2WJcxZnocXpd2NKj9J2kO_Ubl2m3tZlZrkr8qBDXnsuz8vh_h1UGvVbQwKcJpXIZaNM8hAKWPZWe1CGrc0ExSMbnZjJokKC4MkFR6ixGBbvD8MLNyc:1tzvxA:ntam96dAmYu0IuILzlY7ccS8_FcyRDifj-39j_6S3JM','2025-04-16 11:08:16.103749'),('a03pstdvxgzr3uamapyeqamjhiqa4hpm','.eJxVjEEOwiAQRe_C2hBgMgVcuvcMBGamUjU0Ke3KeHdt0oVu_3vvv1TK21rT1mVJE6uzAnX63Uqmh7Qd8D2326xpbusyFb0r-qBdX2eW5-Vw_w5q7vVbY4hEQyATwIKwjxYMInDBAlLIMQvlYAH9aA0hOzNQYHFhdNFy8er9Ad8XOAI:1u0NhX:MW-HYXLlcaDi9GCcHk-rrZeb8J-vnIe4T9BLMLm-tto','2025-04-17 16:45:59.595056'),('d8ijxmsktolzuzi4rsvbtus4wtmk0ats','.eJxVjMsOwiAQRf-FtSEwPIa6dO83kBkgUjWQlHZl_Hdt0oVu7znnvkSkba1xG2WJcxZnocXpd2NKj9J2kO_Ubl2m3tZlZrkr8qBDXnsuz8vh_h1UGvVbQwKcJpXIZaNM8hAKWPZWe1CGrc0ExSMbnZjJokKC4MkFR6ixGBbvD8MLNyc:1tztXH:oxR71aNCxzvQmHiBHus3WNTr1zRnk_JZP75WlrHepE0','2025-04-16 08:33:23.128701'),('dmi5dw5lb1y7qlgg55idmtht6l4u6xoz','.eJxVjEEOwiAQRe_C2pA6QKEu3fcMZIYZbNVAUtqV8e7apAvd_vfef6mI2zrFrckSZ1YXBer0uxGmh5Qd8B3LrepUy7rMpHdFH7TpsbI8r4f7dzBhm741BgOOOuJgyYHrOYceBAlpCByEGUC8IZvOwgLGe84DdaH3ki0ZNur9Af8sOMs:1u11hs:wREjH9HlrtlD0TV6ReBhu17EzwuVNI9AFsBHhg3pMfs','2025-04-19 11:29:00.233027'),('ndlzusztr8k72u5aevqzeyrpaor1pi3q','.eJxVjEEOwiAQRe_C2hDAUsCle89AZphBqoYmpV0Z7y5NutDtf-_9t4iwrSVujZc4kbgILU6_G0J6ct0BPaDeZ5nmui4Tyl2RB23yNhO_rof7d1CglV5nF5Ihi9YHDRasgzGRy4FMJzh4IuUxw-D4rNmw6oaj0aasAAizE58v_2E5BQ:1u1mF5:QYMr_Jzir5JuE52bAqMjpCyi5l8cdaoyaF8_rKF4LJI','2025-04-21 13:10:23.486150'),('q6oska1ljiv48tl8q853ny50xb30n2bg','.eJxVjEEOwiAQRe_C2pBSygAu3fcMhJkBqRqalHZlvLtt0oVu33v_v0WI21rC1tISJhZXMYjLL8NIz1QPwY9Y77Okua7LhPJI5GmbHGdOr9vZ_h2U2Mq-Np47GsBn53PvXEqGNfTonNdkCCxmxKwtoQINPu1AEZmOY_agSVnx-QLp-Tgt:1tymCU:09L1wZ5c9mMmSbT9O2d_bpKmDvvzhjY_I2Tl8d0G8RU','2025-04-13 06:31:18.531908');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-18 14:47:22
