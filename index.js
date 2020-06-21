const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var app=express()
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
  app.get('/db', async (req, res) => {
    var getUserQuery=`SELECT * FROM Person`;
    pool.query(getUserQuery,(error,result) =>{
      if(error){
        res.end(error);
      }
      var results ={'rows': result.rows}
      res.render('pages/db', results);
      })
  });
  app.post('/seeuseratt', async(req,res)=>{
    var name= req.body.uname;
    var getUserQuery=`SELECT * FROM Person WHERE name='${name}'`;
    pool.query(getUserQuery,(error,result) =>{
      if(error){
        res.end(error);
      }
      var results ={'rows': result.rows}
      res.render('pages/see', results);
      })



  });
  app.post('/adduser',async (req,res)=> {
    var name= req.body.uname;
    var size= req.body.usize;
    var height=req.body.uheight;
    var type=req.body.utype;
    var salary=req.body.usalary;
    const client = await pool.connect();
    try{

    var insertQuery=`INSERT INTO Person VALUES('${name}',${size},${height},'${type}',${salary})`;
    const result = await client.query(insertQuery);
         client.release();
       } catch (err) {
         console.error(err);
         res.send("Error " + err);
       }
       res.send(`Thanks for submitting application`);

      });

      app.post('/update',async (req,res)=>{
        var name= req.body.uname;
        var size= req.body.usize;
        var height=req.body.uheight;
        var type=req.body.utype;
        var salary=req.body.usalary;
        const client = await pool.connect();
        try{
          var upadateQuery=`UPDATE Person SET size=${size},height=${height},type='${type}', salary=${salary} WHERE name='${name}'`;
          const result = await client.query(upadateQuery);
               client.release();
             } catch (err) {
               console.error(err);
               res.send("Error " + err);
             }
             res.send(`Thanks for updating the application information`);
      })
      app.post('/mydelete',async(req,res)=>{
        var name= req.body.uname;
        const client = await pool.connect();
        try{
          var deleteQuery=`DELETE FROM Person WHERE name='${name}'`;
          const result = await client.query(deleteQuery);
               client.release();
             } catch (err) {
               console.error(err);
               res.send("Error " + err);
             }
             res.send(`Thanks for updating the application information`);
      })

  app.get('/users/:id', (req,res)=>{
    console.log(req.params.id);
    res.send("got it");
  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
