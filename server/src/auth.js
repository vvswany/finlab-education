import jwt from 'jsonwebtoken';
const secret = () => process.env.JWT_SECRET;
export function signUser(user){ return jwt.sign({sub:user.id, role:user.role, username:user.username}, secret(), {expiresIn:'7d'}); }
export function requireAuth(req,res,next){
  const token=req.cookies?.finlab_token;
  if(!token) return res.status(401).json({error:'Требуется вход.'});
  try { req.user=jwt.verify(token, secret()); next(); }
  catch { return res.status(401).json({error:'Сессия истекла. Войди снова.'}); }
}
