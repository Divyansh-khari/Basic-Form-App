const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}

var app=express()
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
  app.get('/cool', (req, res) => res.send(cool()))
  app.get('/times', (req, res) => res.send(showTimes()))
  app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM Customer');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  app.post('/adduser',(req,res)=> {
    console.log("post requset for /adduser");
    //var uname= req.body.uname;
    //var age= req.body.age;
    //res.send('username: ${uname},age: ${age}');
    res.send("Thanks for submitting application");
  });
  app.get('/users/:id', (req,res)=>{



  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
