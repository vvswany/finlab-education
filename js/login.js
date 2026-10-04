const form = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const classCodeBtn = document.getElementById('classCodeBtn');
const codeModal = document.getElementById('codeModal');
const codeInput = document.getElementById('classCode');
const codeError = document.getElementById('codeError');
function openCodeModal(){ codeModal.classList.add('open'); codeModal.setAttribute('aria-hidden','false'); setTimeout(()=>codeInput.focus(),50); }
function closeCodeModal(){ codeModal.classList.remove('open'); codeModal.setAttribute('aria-hidden','true'); codeError.textContent=''; }
classCodeBtn?.addEventListener('click', openCodeModal);
document.querySelectorAll('[data-close-code]').forEach(el=>el.addEventListener('click', closeCodeModal));
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeCodeModal(); });
togglePassword?.addEventListener('click', ()=>{ const visible=password.type==='text'; password.type=visible?'password':'text'; togglePassword.textContent=visible?'Показать':'Скрыть'; });
form?.addEventListener('submit', async e=>{
 e.preventDefault(); loginError.textContent='';
 const username=document.getElementById('login').value.trim(); const pass=password.value;
 if(!username||!pass){loginError.textContent='Заполни логин и пароль.';return;}
 const button=form.querySelector('.login-submit'); button.disabled=true;
 try{ const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({username,password:pass})}); const data=await r.json(); if(!r.ok) throw new Error(data.error||'Не удалось войти.'); window.location.href='path.html'; }
 catch(err){loginError.textContent=err.message;} finally{button.disabled=false;}
});
document.getElementById('classCodeSubmit')?.addEventListener('click', async ()=>{
 const code=codeInput.value.trim().toUpperCase(); codeError.textContent='';
 if(code.length<4){codeError.textContent='Введи код класса.';return;}
 try{ const r=await fetch('/api/classes/join',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({code})}); const data=await r.json(); if(!r.ok) throw new Error(data.error||'Не удалось подключиться.'); window.location.href='path.html'; }
 catch(err){codeError.textContent=err.message;}
});
