import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import { signUser, requireAuth } from './auth.js';

dotenv.config();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(__dirname,'../..');
const app=express();
app.use(express.json());
app.use(cookieParser());

const cookieOptions={httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:7*24*60*60*1000};

app.get('/api/health',async(_req,res)=>{ try { await pool.query('SELECT 1'); res.json({ok:true,database:true}); } catch { res.status(503).json({ok:false,database:false}); }});

app.post('/api/auth/register',async(req,res)=>{
  try{
    const {username,password,displayName,classCode}=req.body;
    if(!username||!password||!displayName) return res.status(400).json({error:'Заполни имя, логин и пароль.'});
    if(password.length<6) return res.status(400).json({error:'Пароль должен быть не короче 6 символов.'});
    const exists=await pool.query('SELECT id FROM users WHERE username=$1',[username.trim().toLowerCase()]);
    if(exists.rowCount) return res.status(409).json({error:'Такой логин уже занят.'});
    let classId=null;
    if(classCode){ const c=await pool.query('SELECT id FROM classes WHERE code=$1',[classCode.trim().toUpperCase()]); if(!c.rowCount) return res.status(400).json({error:'Код класса не найден.'}); classId=c.rows[0].id; }
    const hash=await bcrypt.hash(password,12);
    const u=await pool.query('INSERT INTO users(username,password_hash,display_name,role) VALUES($1,$2,$3,$4) RETURNING id,username,display_name,role',[username.trim().toLowerCase(),hash,displayName.trim(),'student']);
    if(classId) await pool.query('INSERT INTO class_members(class_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[classId,u.rows[0].id]);
    res.cookie('finlab_token',signUser(u.rows[0]),cookieOptions).status(201).json({user:u.rows[0]});
  }catch(e){ console.error(e); res.status(500).json({error:'Ошибка сервера.'}); }
});

app.post('/api/auth/login',async(req,res)=>{
  try{
    const username=(req.body.username||'').trim().toLowerCase(); const password=req.body.password||'';
    const r=await pool.query('SELECT id,username,password_hash,display_name,role FROM users WHERE username=$1',[username]);
    if(!r.rowCount || !(await bcrypt.compare(password,r.rows[0].password_hash))) return res.status(401).json({error:'Неверный логин или пароль.'});
    const {password_hash,...user}=r.rows[0];
    res.cookie('finlab_token',signUser(user),cookieOptions).json({user});
  }catch(e){ console.error(e); res.status(500).json({error:'Ошибка сервера.'}); }
});

app.post('/api/auth/logout',(_req,res)=>{ res.clearCookie('finlab_token',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'}); res.json({ok:true}); });
app.get('/api/auth/me',requireAuth,async(req,res)=>{ const r=await pool.query('SELECT id,username,display_name,role FROM users WHERE id=$1',[req.user.sub]); if(!r.rowCount) return res.status(401).json({error:'Пользователь не найден.'}); res.json({user:r.rows[0]}); });

app.post('/api/classes/join',requireAuth,async(req,res)=>{
  const code=(req.body.code||'').trim().toUpperCase();
  if(!code) return res.status(400).json({error:'Введи код класса.'});
  const c=await pool.query('SELECT id,name,code FROM classes WHERE code=$1',[code]);
  if(!c.rowCount) return res.status(404).json({error:'Класс с таким кодом не найден.'});
  await pool.query('INSERT INTO class_members(class_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[c.rows[0].id,req.user.sub]);
  res.json({class:c.rows[0]});
});

app.get('/api/modules',async(_req,res)=>{ const r=await pool.query('SELECT id,number,title,description,slug FROM modules ORDER BY number'); res.json({modules:r.rows}); });

app.use(express.static(root));
app.get('*',(req,res)=>{ if(req.path.startsWith('/api/')) return res.status(404).json({error:'API route not found'}); res.sendFile(path.join(root,'index.html')); });

const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log(`FINLAB server: http://localhost:${port}`));
