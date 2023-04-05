const express = require('express');
const app = express();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000; // If the environment variable set then will take the value from there 

// connect DB
connectDB();
app.use(express.json({extended: false}));
app.get('/', (req, res)=> {
    res.send('Api is runing')
})
app.use('/api/users', require('./routes/api/users'));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

app.listen(PORT, () => {
  console.log(`App listing to port ${PORT}`);
});