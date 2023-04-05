const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; // If the environment variable set then will take the value from there 


app.get('/', (req, res)=> {
    res.send('Api is runing')
})
app.listen(PORT, () => {
  console.log(`App listing to port ${PORT}`);
});