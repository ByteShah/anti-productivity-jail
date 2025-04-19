const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working' });
});

// Task endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    db.all('SELECT * FROM tasks WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const newTask = req.body;
    newTask.id = Date.now().toString();
    db.run(`
      INSERT INTO tasks (id, userId, title, description, deadline, duration_hours, duration_minutes, consequence, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newTask.id,
      userId,
      newTask.title,
      newTask.description,
      newTask.deadline,
      newTask.duration.hours,
      newTask.duration.minutes,
      newTask.consequence,
      'ACTIVE',
      new Date().toISOString()
    ], function(err) {
      if (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Error creating task' });
      } else {
        res.json(newTask);
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  try {
    let query = `UPDATE tasks SET`;
    const updates = [];
    const values = [];

    if (req.body.title) {
      updates.push(`title = ?`);
      values.push(req.body.title);
    }
    if (req.body.description) {
      updates.push(`description = ?`);
      values.push(req.body.description);
    }
    if (req.body.deadline) {
      updates.push(`deadline = ?`);
      values.push(req.body.deadline);
    }
    if (req.body.duration && req.body.duration.hours) {
      updates.push(`duration_hours = ?`);
      values.push(req.body.duration.hours);
    }
    if (req.body.duration && req.body.duration.minutes) {
      updates.push(`duration_minutes = ?`);
      values.push(req.body.duration.minutes);
    }
    if (req.body.consequence) {
      updates.push(`consequence = ?`);
      values.push(req.body.consequence);
    }
    if (req.body.status) {
      updates.push(`status = ?`);
      values.push(req.body.status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    query += ` ${updates.join(', ')} WHERE id = ?`;
    values.push(id);

    db.run(query, values, function(err) {
      if (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Error updating task' });
      } else {
        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
          if (err || !row) {
            res.status(404).json({ message: 'Task not found' });
          } else {
            res.json(row);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error deleting task' });
    } else {
      res.json({ message: 'Task deleted' });
    }
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }

      if (row) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        created_at: new Date().toISOString()
      };

      db.run(`
        INSERT INTO users (id, email, password, created_at)
        VALUES (?, ?, ?, ?)
      `, [newUser.id, newUser.email, newUser.password, newUser.created_at], function(err) {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Error registering user' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set JWT as HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          maxAge: 3600000, // 1 hour
        });

        res.status(201).json({
          message: 'User registered successfully',
          id: newUser.id,
          email: newUser.email,
          name: newUser.email, // Replace with actual user name from the database
          createdAt: newUser.created_at,
          token: token,
        });
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ message: 'Error logging in' });
      }

      if (!row) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, row.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set JWT as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 3600000, // 1 hour
      });

      res.status(200).json({
        message: 'Logged in successfully',
        id: row.id,
        email: row.email,
        name: row.email, // Replace with actual user name from the database
        createdAt: row.created_at,
        token: token,
      });
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Fetch user from database
      db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, row) => {
        if (err) {
          console.error('Error fetching user:', err);
          return res.status(500).json({ message: 'Error fetching user' });
        }

        if (!row) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
          id: row.id,
          email: row.email,
          createdAt: row.created_at,
          name: row.email,
        });
      });
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
