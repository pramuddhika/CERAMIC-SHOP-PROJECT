CREATE DATABASE ceramic;

USE ceramic;

-- ########### MASTER DATA TABLE START #################
CREATE TABLE payment_status (
   PAYMENT_TAG VARCHAR(10) NOT NULL UNIQUE,
   DESCRIPTION VARCHAR(40) NOT NULL,
   STATUS BOOLEAN NOT NULL,
   PRIMARY KEY (PAYMENT_TAG)
); 
CREATE TABLE order_type (
  ORDER_TYPE_TAG VARCHAR(10) NOT NULL,
  DESCRIPTION VARCHAR(40) NOT NULL,
  STATUS BOOLEAN NOT NULL,
  PRIMARY KEY (ORDER_TYPE_TAG)
);
CREATE TABLE stock_stages (
  STOCK_STAGE_TAG VARCHAR(10) NOT NULL,
  DESCRIPTION VARCHAR(40) NOT NULL,
  STATUS BOOLEAN NOT NULL,
  PRIMARY KEY (STOCK_STAGE_TAG)
);
-- ########### MASTER DATA TABLE END ###################

-- ########## USER DATA TABALE START ####################
CREATE TABLE user (
   USER_ID varchar(10) NOT NULL,
   EMAIL varchar(20) NOT NULL UNIQUE,
   FIRST_NAME varchar(20) NOT NULL,
   LAST_NAME varchar(20) NOT NULL,
   USER_TYPE varchar(10) NOT NULL,
   PASSWORD varchar(30),
   PRIMARY KEY (USER_ID)
);
CREATE TABLE address_book (
  USER_ID varchar(10) NOT NULL,
  TAG VARCHAR(20) NOT NULL,
  TELEPHONE_NUMBER varchar(13) NOT NULL,
  LINE_1 varchar(15) NOT NULL,
  LINE_2 varchar(15),
  CITY VARCHAR(30) NOT NULL,
  DISTRICT VARCHAR(25) NOT NULL,
  PROVINCE VARCHAR(25) NOT NULL,
  POSTAL_CODE VARCHAR(10) NOT NULL,
  PRIMARY KEY (USER_ID , TAG),
  FOREIGN KEY (USER_ID ) REFERENCES user(USER_ID)
);
-- #########  USER DATA TABLE END #######################

-- ######### PRODUCT DATA TABLE START ###################
CREATE TABLE category (
  CATAGORY_CODE VARCHAR(10) NOT NULL UNIQUE,
  NAME VARCHAR(20) NOT NULL,
  DESCRIPTION VARCHAR(200) NOT NULL,
  IMAGE VARCHAR(256) NOT NULL,
  STATUS BOOLEAN NOT NULL,
  PRIMARY KEY (CATAGORY_CODE)
);
CREATE TABLE sub_category (
  SUB_CATAGORY_CODE VARCHAR(10) NOT NULL,
  CATAGORY_CODE VARCHAR(10) NOT NULL,
  NAME VARCHAR(20) NOT NULL,
  DESCRIPTION VARCHAR(200) NOT NULL,
  IMAGE VARCHAR(256) NOT NULL,
  STATUS BOOLEAN NOT NULL,
  PRIMARY KEY (SUB_CATAGORY_CODE),
  FOREIGN KEY (CATAGORY_CODE) REFERENCES category(CATAGORY_CODE)
);
CREATE TABLE product (
  PRODUCT_CODE VARCHAR(10) NOT NULL,
  SUB_CATAGORY_CODE VARCHAR(10) NOT NULL,
  CATAGORY_CODE VARCHAR(10) NOT NULL,
  NAME VARCHAR(20) NOT NULL,
  DESCRIPTION VARCHAR(200) NOT NULL,
  IMAGE VARCHAR(256) NOT NULL,
  STATUS BOOLEAN NOT NULL,
  PRIMARY KEY (PRODUCT_CODE),
  FOREIGN KEY (CATAGORY_CODE) REFERENCES category(CATAGORY_CODE),
  FOREIGN KEY (SUB_CATAGORY_CODE) REFERENCES sub_category(SUB_CATAGORY_CODE)
);
ALTER TABLE product
ADD PRICE SMALLINT NOT NULL;
-- ######### PRODUCT DATA TABLE END ######################

-- ######### STOCK DATA TABLE START ######################
CREATE TABLE material (
  MATERIAL_ID VARCHAR(10) NOT NULL UNIQUE,
  NAME VARCHAR(20) NOT NULL,
  DESCRIPTION VARCHAR(100) NOT NULL,
  STATUS VARCHAR(10) NOT NULL,
  PRIMARY KEY (MATERIAL_ID)
);
CREATE TABLE material_received_note (
  MATERIAL_ID VARCHAR(10) NOT NULL,
  SUPPILER_ID VARCHAR(10) NOT NULL,
  DATE DATE NOT NULL,
  QUANTITY SMALLINT NOT NULL,
  MATERIAL_VALUE DECIMAL(10,2) NOT NULL,
  PAID_VALUE DECIMAL(10,2),
  PAYMENT_SATUS VARCHAR(10),
  PRIMARY KEY (MATERIAL_ID,SUPPILER_ID,DATE),
  FOREIGN KEY (MATERIAL_ID) REFERENCES material(MATERIAL_ID),
  FOREIGN KEY (SUPPILER_ID) REFERENCES user(USER_ID)
);
CREATE TABLE material_stock (
  MATERIAL_ID VARCHAR(10) NOT NULL,
  UPDATE_DATE DATE NOT NULL,
  QUANTITY DECIMAL(10,2),
  FOREIGN KEY (MATERIAL_ID) REFERENCES material(MATERIAL_ID)
);
CREATE TABLE production_note(
  MATERIAL_ID VARCHAR(10) NOT NULL,
  QUANTITY SMALLINT NOT NULL,
  DATE DATE NOT NULL,
  PRIMARY KEY (MATERIAL_ID,DATE),
  FOREIGN KEY (MATERIAL_ID) REFERENCES material(MATERIAL_ID)
);
CREATE TABLE product_stock_stages (
  ID VARCHAR(10) NOT NULL UNIQUE,
  PRODUCT_CODE VARCHAR(10) NOT NULL,
  QUANTITY SMALLINT NOT NULL,
  UPDATE_DATE DATE NOT NULL,
  DAMAGE_COUNT SMALLINT,
  STAGE VARCHAR(10) NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (STAGE) REFERENCES stock_stages(STOCK_STAGE_TAG),
  FOREIGN KEY (PRODUCT_CODE) REFERENCES product( PRODUCT_CODE)
);
CREATE TABLE production (
  PRODUCT_CODE VARCHAR(10) NOT NULL,
  QUANTITY SMALLINT NOT NULL,
  UPDATE_DATE DATE NOT NULL,
  PRIMARY KEY (PRODUCT_CODE),
  FOREIGN KEY (PRODUCT_CODE) REFERENCES product( PRODUCT_CODE)
);
-- ######### STOCK DATA TABLE END ########################

-- ######### OREDER DATA TABLE START #####################
CREATE TABLE orders (
  ORDER_ID VARCHAR(10) NOT NULL,
  USER_ID varchar(10) NOT NULL,
  ADDRESS_TAG VARCHAR(20) NOT NULL,
  DATE DATE NOT NULL,
  ORDER_TYPE VARCHAR(10) NOT NULL,
  STATUS VARCHAR(10),
  VALUE DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (ORDER_ID),
  FOREIGN KEY (USER_ID) REFERENCES user(USER_ID),
  FOREIGN KEY (ORDER_TYPE) REFERENCES order_type(ORDER_TYPE_TAG)
);
CREATE TABLE order_data (
  ORDER_ID VARCHAR(10) NOT NULL,
  PRODUCT_CODE VARCHAR(10) NOT NULL,
  QUANTITY SMALLINT NOT NULL,
  COMPLETED_QUANTITY SMALLINT,
  UNIT_PRICE SMALLINT NOT NULL,
  PRIMARY KEY (ORDER_ID, PRODUCT_CODE),
  FOREIGN KEY (ORDER_ID ) REFERENCES orders(ORDER_ID),
  FOREIGN KEY (PRODUCT_CODE) REFERENCES product( PRODUCT_CODE)
);
CREATE TABLE payment (
   ORDER_ID VARCHAR(10) NOT NULL,
   DATE DATE NOT NULL,
   PAID_VALUE DECIMAL(10,2),
   PAYMENT_STATUS VARCHAR(10) NOT NULL,
   PATMENT_TYPE VARCHAR(10) NOT NULL,
   FOREIGN KEY (ORDER_ID ) REFERENCES orders(ORDER_ID),
   FOREIGN KEY (PAYMENT_STATUS) REFERENCES payment_status(PAYMENT_TAG)
);
-- ######### OREDER DATA TABLE END #######################

-- ######### Contact us table ######################
CREATE TABLE conatactUs (
  FULL_NAME VARCHAR(30) NOT NULL,
  EMAIL VARCHAR(30) NOT NULL,
  MESSAGE VARCHAR(200) NOT NULL
);

-- update 2024-12-21
ALTER TABLE category
ADD UNIQUE INDEX `NAME_UNIQUE` (`NAME` ASC) VISIBLE;
;

-- update 2025-01-05
ALTER TABLE material
CHANGE COLUMN `STATUS` `STATUS` TINYINT(1) NOT NULL ;

-- UPDATE 2025.01.14
ALTER TABLE `ceramic`.`user` 
ADD COLUMN `STATUS` TINYINT(1) NOT NULL AFTER `PASSWORD`,
CHANGE COLUMN `PASSWORD` `PASSWORD` VARCHAR(30) NULL ;

ALTER TABLE `ceramic`.`user` 
CHANGE COLUMN `EMAIL` `EMAIL` VARCHAR(50) NOT NULL ;

-- update 2025.1.25
ALTER TABLE `ceramic`.`user` 
CHANGE COLUMN `PASSWORD` `PASSWORD` VARCHAR(256) NULL DEFAULT NULL ;