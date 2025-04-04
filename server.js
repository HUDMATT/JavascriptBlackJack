const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000; // Match the port in the error message

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow requests from Live Server
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
})); // Update the CORS configuration
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: 'lax',
        httpOnly: true
    }
}));

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pl3as3d0nth4ckm3!!!',
    database: 'jsblackjack',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit if can't connect to database
    });

// Update the create account endpoint
app.post('/api/create-account', async (req, res) => {
    console.log('Received create account request:', req.body);
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('Missing username or password');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if username already exists
        const [users] = await pool.execute(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );

        if (users.length > 0) {
            console.log('Username already exists');
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO Users (username, password_hash, player_cash, blackandwhitestyle, darkstyle, goldstyle) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, 100, false, false, false]
        );

        console.log('Account created successfully');
        return res.status(201).json({ 
            message: 'Account created successfully',
            userId: result.insertId 
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Server error creating account' });
    }
});

// Add OPTIONS handler for login endpoint
app.options('/api/login', cors());

// Update login endpoint
app.post('/api/login', async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    console.log('Received login request:', req.body);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get user from database
        const [users] = await pool.execute(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session
        req.session.userId = user.user_id;

        // Send user data
        res.json({
            message: 'Login successful',
            username: user.username,
            playerCash: user.player_cash,
            styles: {
                blackAndWhite: user.blackandwhitestyle === 1,
                dark: user.darkstyle === 1,
                gold: user.goldstyle === 1
            },
            lastStyle: user.laststyle // Add this line
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Add sign out endpoint
app.post('/api/signout', async (req, res) => {
    req.session.destroy();
    res.json({ message: 'Signed out successfully' });
});

// Add update player data endpoint
app.post('/api/update-player', async (req, res) => {
    try {
        const { username, playerCash, styles } = req.body;

        const [result] = await pool.execute(
            `UPDATE Users 
             SET player_cash = ?, 
                 blackandwhitestyle = ?, 
                 darkstyle = ?, 
                 goldstyle = ? 
             WHERE username = ?`,
            [
                playerCash,
                styles.blackAndWhite ? 1 : 0,
                styles.dark ? 1 : 0,
                styles.gold ? 1 : 0,
                username
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Player data updated successfully' });
    } catch (error) {
        console.error('Error updating player data:', error);
        res.status(500).json({ error: 'Failed to update player data' });
    }
});

// Add endpoint to update last style
app.post('/api/update-style', async (req, res) => {
    try {
        const { username, style } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE Users SET laststyle = ? WHERE username = ?',
            [style, username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Style updated successfully' });
    } catch (error) {
        console.error('Error updating style:', error);
        res.status(500).json({ error: 'Failed to update style' });
    }
});

// Get global leaderboard (top 5 by total winnings)
app.get('/api/leaderboard/global', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT Users.username, Leaderboards.total_winnings 
            FROM Leaderboards 
            JOIN Users ON Leaderboards.user_id = Users.user_id 
            ORDER BY total_winnings DESC 
            LIMIT 5
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching global leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Update the personal stats endpoint
app.get('/api/leaderboard/personal/:username', async (req, res) => {
    try {
        // First check if user exists
        const [users] = await pool.execute(
            'SELECT user_id FROM Users WHERE username = ?',
            [req.params.username]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Try to get leaderboard stats
        const [rows] = await pool.execute(`
            SELECT 
                COALESCE(l.total_winnings, 0) as total_winnings,
                COALESCE(l.highest_cash, 100) as highest_cash,
                COALESCE(l.times_bankrupt, 0) as times_bankrupt,
                COALESCE(l.games_played, 0) as games_played,
                COALESCE(l.games_won, 0) as games_won,
                u.username,
                COALESCE((
                    SELECT COUNT(*) + 1 
                    FROM Leaderboards l2 
                    WHERE l2.total_winnings > COALESCE(l.total_winnings, 0)
                ), 1) as global_rank
            FROM Users u
            LEFT JOIN Leaderboards l ON u.user_id = l.user_id
            WHERE u.username = ?
        `, [req.params.username]);

        // Return stats (will have default values for nulls due to COALESCE)
        res.json(rows[0]);

    } catch (error) {
        console.error('Error fetching personal stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
    }
});

// Update player stats
app.post('/api/leaderboard/update', async (req, res) => {
    try {
        const { username, cashChange, gameWon, currentCash, bankrupt } = req.body;

        // Get user_id
        const [users] = await pool.execute(
            'SELECT user_id FROM Users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = users[0].user_id;

        // Update or create leaderboard entry
        await pool.execute(`
            INSERT INTO Leaderboards 
                (user_id, total_winnings, highest_cash, times_bankrupt, games_played, games_won)
            VALUES 
                (?, ?, ?, ?, 1, ?)
            ON DUPLICATE KEY UPDATE
                total_winnings = CASE 
                    WHEN ? > 0 THEN total_winnings + ?
                    ELSE total_winnings
                END,
                highest_cash = GREATEST(highest_cash, ?),
                times_bankrupt = times_bankrupt + ?,
                games_played = games_played + 1,
                games_won = games_won + ?
        `, [
            userId,
            Math.max(0, cashChange),
            currentCash,
            bankrupt ? 1 : 0,
            gameWon ? 1 : 0,
            cashChange,
            Math.max(0, cashChange),
            currentCash,
            bankrupt ? 1 : 0,
            gameWon ? 1 : 0
        ]);

        res.json({ message: 'Stats updated successfully' });
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ error: 'Failed to update stats' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});