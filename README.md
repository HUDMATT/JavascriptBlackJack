Fun Jackblack game created with Javascript.

SQL Connection will not work from Github pages, this was created for fun and only runs locally, but if interested, shown below is my SQL schema:


		CREATE DATABASE IF NOT EXISTS jsblackjack;
		USE jsblackjack;
		
		CREATE TABLE IF NOT EXISTS Users (
		    user_id INT AUTO_INCREMENT PRIMARY KEY,
		    username VARCHAR(50) NOT NULL UNIQUE,
		    password_hash VARCHAR(255) NOT NULL,
		    player_cash INT DEFAULT 100,
		    blackandwhitestyle BOOLEAN DEFAULT false,
		    darkstyle BOOLEAN DEFAULT false,
		    goldstyle BOOLEAN DEFAULT false,
		    laststyle VARCHAR(13) DEFAULT 'Default'
		);
		
		CREATE TABLE IF NOT EXISTS Leaderboards (
		    user_id INT PRIMARY KEY,
		    total_winnings INT DEFAULT 0,
		    highest_cash INT DEFAULT 100,
		    times_bankrupt INT DEFAULT 0,
		    games_played INT DEFAULT 0,
		    games_won INT DEFAULT 0,
		    FOREIGN KEY (user_id) REFERENCES Users(user_id)
		);
