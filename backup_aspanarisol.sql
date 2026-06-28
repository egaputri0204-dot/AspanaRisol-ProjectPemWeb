-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: aspanarisol
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','admin123'),(2,'ega','ega1234'),(3,'ega1224','ega1224');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_pesanan`
--

DROP TABLE IF EXISTS `detail_pesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detail_pesanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pesanan_id` int(11) DEFAULT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pesanan_id` (`pesanan_id`),
  KEY `produk_id` (`produk_id`),
  CONSTRAINT `detail_pesanan_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`),
  CONSTRAINT `detail_pesanan_ibfk_2` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_pesanan`
--

LOCK TABLES `detail_pesanan` WRITE;
/*!40000 ALTER TABLE `detail_pesanan` DISABLE KEYS */;
INSERT INTO `detail_pesanan` VALUES (1,3,5,1),(2,3,9,2),(3,3,7,3),(4,4,5,1),(5,4,9,2),(6,4,7,3),(7,5,6,4),(8,5,13,1),(9,5,5,1),(10,11,6,1),(11,11,7,1),(12,12,8,1),(13,12,10,2),(14,12,9,1),(15,13,10,1),(16,14,8,1),(17,15,10,1),(18,15,6,1);
/*!40000 ALTER TABLE `detail_pesanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori`
--

DROP TABLE IF EXISTS `kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kategori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` VALUES (2,'Makanan Asin'),(3,'Minuman'),(4,'Makanan Manis');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesanan`
--

DROP TABLE IF EXISTS `pesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pesanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `nama_pembeli` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `tanggal` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Pending',
  `metode_pembayaran` varchar(50) DEFAULT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `status_pembayaran` varchar(20) DEFAULT 'Belum Bayar',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesanan`
--

LOCK TABLES `pesanan` WRITE;
/*!40000 ALTER TABLE `pesanan` DISABLE KEYS */;
INSERT INTO `pesanan` VALUES (2,NULL,'Ega','0845678','Jakarta',0,'2026-06-03 14:24:45','Diproses',NULL,NULL,'Belum Bayar'),(3,NULL,'Ega','46579','Jakarta Brt',58000,'2026-06-03 14:48:13','Pending',NULL,NULL,'Belum Bayar'),(4,NULL,'Ega Putri ','0845678','Jakarta',58000,'2026-06-06 08:33:23','Selesai',NULL,NULL,'Belum Bayar'),(5,NULL,'Angga','084567890',' Jl. Delima',55500,'2026-06-15 21:43:57','Selesai',NULL,NULL,'Belum Bayar'),(6,NULL,'Dio','0865478907','Jl. Kencana Barat No.3',42500,'2026-06-17 13:32:11','Pending',NULL,NULL,'Belum Bayar'),(7,NULL,'Dio','0865478907','Jl. Kencana Barat no.3',42500,'2026-06-17 13:53:26','Pending',NULL,NULL,'Belum Bayar'),(8,NULL,'Dio','0865478907','Jl. Mangga',58500,'2026-06-17 14:07:01','Pending',NULL,NULL,'Belum Bayar'),(9,NULL,'Dio','0865478907','Jl. Mangga',58500,'2026-06-17 14:09:56','Pending',NULL,NULL,'Belum Bayar'),(10,NULL,'Dio','0865478907','Jl. Mangga',58500,'2026-06-17 14:15:36','Pending',NULL,NULL,'Belum Bayar'),(11,NULL,'Aci','0865476789','JL. Besar',17000,'2026-06-17 14:19:01','Pending',NULL,NULL,'Belum Bayar'),(12,NULL,'Eka','0876543756','Jl. Kita',33000,'2026-06-17 14:24:05','Diproses',NULL,NULL,'Belum Bayar'),(13,NULL,'Ega Putri','08123456789','Jl. Kebon Jeruk',8000,'2026-06-17 21:16:34','Pending',NULL,NULL,'Belum Bayar'),(14,9,'Ega Putri','0865478907','Jl. Kita',9000,'2026-06-17 21:23:46','Selesai',NULL,NULL,'Belum Bayar'),(15,9,'Aci','0865478907','Jakarta',16000,'2026-06-20 01:06:08','Pending','Transfer Bank','1781924726652-images.png','Lunas');
/*!40000 ALTER TABLE `pesanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produk`
--

DROP TABLE IF EXISTS `produk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(100) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  PRIMARY KEY (`id`),
  KEY `fk_kategori` (`kategori_id`),
  CONSTRAINT `fk_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produk`
--

LOCK TABLES `produk` WRITE;
/*!40000 ALTER TABLE `produk` DISABLE KEYS */;
INSERT INTO `produk` VALUES (5,'Wintermelon tea','    Minumman Sehat',15000,'1781890926719-winter.jpeg',3,'Aktif'),(6,'Risol Ragout','    Risoles dengan isian wortel, putih telur, dan ayam suwir yang gurih\r\n            dimasak dengan bumbu spesial dan creamy.',8000,'1781666810648-ragout.jpeg',2,'Aktif'),(7,'Risol Mayo Smoked Beef','    Risoles dengan isian telur, keju, smoked beef, dan mayonaise racikan yang lezat dan creamy.',9000,'1781890914833-s.beef.jpeg',2,'Aktif'),(8,'Risol Mayo Smoked Chicken','    Risoles dengan isian telur, keju, smoked chicken, dan mayonaise racikan yang lezat dan creamy.',9000,'1781890902101-s.chiken.jpeg',2,'Aktif'),(9,'Risol Vegetarian/Sayur','    Risoles yang gurih dan renyah, berisikan telur, wortel, kentang, buncis, dan soun (tanpa daging).',8000,'1781670594703-vege.jpeg',2,'Aktif'),(10,'Risol Pisang Coklat','    Risoles dengan isian perpaduan pisang manis dan coklat lumer dengan kulit risoles yang crispy.',8000,'1781669931324-piscok.jpeg',4,'Aktif'),(13,'Risol Sayur','    sayur',8500,'1781330261183-vege.jpeg',2,'Nonaktif');
/*!40000 ALTER TABLE `produk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'egaputri','egaputri0204@gmail.com','$2y$10$vXeb0E2Dk1/H2GkLRoKiye05fRU/KbtYSWRV5YnWe6N3lR1aOjFvm'),(2,'egaputri','egaputri0204@gmail.com','$2y$10$x3jFap6D6dCk99iOhJEFpONDAmOmyYObzGVbub4Rcg7Xk5BTA0F8S'),(3,'ega','admin@elektroshop.com','$2y$10$Q3KqnNQQlTEjV2tGhybX5uMLGe.S4QNEwu4/mvIJ2SL45KW8dHP9q'),(4,'ega','admin@elektroshop.com','$2y$10$6qHWtgFJoRxPsjlEA.bFMeGQ4CR8eZIv5LmQPC10SXFXPtcZIiRq2'),(5,'ega','admin@elektroshop.com','$2y$10$PVR1P6mj4IT8x.G9xI/PhejDnhAJpJZDaitK2tSjNUVm4c3W5r8tS'),(6,'egaputri','admin@elektroshop.com','$2y$10$BI2I2zkQF3CIDEO1WttI9OU3cgHxRiNVfPgdeGF6EgjAkkTS7CJma'),(7,'egaputri','admin@elektroshop.com','$2y$10$LycLZLwGLsd76qzS/y0fZe0E6g.fXlRxHhpyLgoqTtvUPlxmzY1vK'),(8,'ega','admin@elektroshop.com','$2y$10$OwHcmiUSLrPI.UOiGu.u2.amZLTw.V1tgEUMeVJJ/MffYKWUR/wfi'),(9,'egaputri024','egaputri0204@gmail.com','ega1234');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-27 21:35:52
