-- ORBIT MySQL schema. Create the database + user, then run the app
-- (SQLAlchemy `init_db()` also creates these tables automatically).
--
--   CREATE DATABASE IF NOT EXISTS orbit CHARACTER SET utf8mb4;
--   CREATE USER 'orbit'@'%' IDENTIFIED BY 'orbit';
--   GRANT ALL PRIVILEGES ON orbit.* TO 'orbit'@'%';
--   FLUSH PRIVILEGES;

USE orbit;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  nonce         VARCHAR(64) NOT NULL DEFAULT '',
  referred_by   VARCHAR(42) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_wallet (wallet_address)
);

CREATE TABLE IF NOT EXISTS staking_records (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT NOT NULL,
  action       VARCHAR(16) NOT NULL,            -- staked | unstaked | claimed
  amount       DECIMAL(38,18) NOT NULL,
  tx_hash      VARCHAR(66) NOT NULL UNIQUE,
  block_number BIGINT NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stake_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  referrer         VARCHAR(42) NOT NULL,
  referee          VARCHAR(42) NOT NULL UNIQUE,
  status           VARCHAR(16) NOT NULL DEFAULT 'pending',  -- pending|verified|paid|rejected
  purchased_amount DECIMAL(38,18) NOT NULL DEFAULT 0,
  reward_amount    DECIMAL(38,18) NOT NULL DEFAULT 0,
  bonus_amount     DECIMAL(38,18) NOT NULL DEFAULT 0,
  paid             BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at      DATETIME NULL,
  payout_at        DATETIME NULL,
  paid_at          DATETIME NULL,
  tx_hash          VARCHAR(66) NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ref_referrer (referrer),
  INDEX idx_ref_status (status)
);

CREATE TABLE IF NOT EXISTS presale_contributions (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT NOT NULL,
  amount_bnb   DECIMAL(38,18) NOT NULL,
  tokens       DECIMAL(38,18) NOT NULL,
  tx_hash      VARCHAR(66) NOT NULL UNIQUE,
  block_number BIGINT NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_presale_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events_log (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  contract     VARCHAR(42) NOT NULL,
  event_name   VARCHAR(64) NOT NULL,
  block_number BIGINT NOT NULL,
  tx_hash      VARCHAR(66) NOT NULL,
  log_index    BIGINT NOT NULL,
  payload      VARCHAR(2048) NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_events_block (block_number),
  INDEX idx_events_contract (contract)
);
