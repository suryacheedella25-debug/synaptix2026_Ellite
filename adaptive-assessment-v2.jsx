import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #070b14; color: #e8eaf0; font-family: 'Lato', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0d1120; }
  ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(99,179,237,0.2)} 50%{box-shadow:0 0 40px rgba(99,179,237,0.5)} }
  @keyframes scanLine { from{top:-4px} to{top:100%} }
  @keyframes particleDrift { 0%{transform:translateY(0) translateX(0);opacity:0.6} 100%{transform:translateY(-80px) translateX(20px);opacity:0} }
  @keyframes borderRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideRight { from{width:0} to{width:var(--w)} }

  .fade-up   { animation: fadeUp 0.5s ease forwards; }
  .fade-in   { animation: fadeIn 0.4s ease forwards; }
  .float-anim { animation: float 4s ease-in-out infinite; }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #0d1829 inset !important;
    -webkit-text-fill-color: #e8eaf0 !important;
  }

  button { font-family: 'Lato', sans-serif; }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 13px 28px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(59,130,246,0.4); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .card {
    background: #0d1829;
    border: 1px solid #1a2840;
    border-radius: 16px;
    padding: 24px;
  }

  .tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 12px; font-family: 'IBM Plex Mono'; font-weight: 500;
  }
`;

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#070b14", surface: "#0d1829", surfaceAlt: "#111f35",
  border: "#1a2840", borderHover: "#2a3f60",
  blue: "#3b82f6", cyan: "#06b6d4", purple: "#8b5cf6",
  green: "#10b981", gold: "#f59e0b", red: "#ef4444",
  text: "#e8eaf0", textMuted: "#64748b", textDim: "#94a3b8",
};

// ─── DEMO CREDENTIALS ─────────────────────────────────────────────────────────
const DEMO_USERS = [
  { email: "student@demo.com", password: "demo123", name: "Alex Kumar" },
  { email: "test@test.com",    password: "test123",  name: "Sam Patel"  },
];

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
const TOPICS = ["C", "Java", "Python"];

const QUESTIONS = {
  C: {
    easy: [
      { id:"c1", q:"Which keyword is used to define a constant in C?", opts:["const","#define","static","let"], ans:0, explanation:"The 'const' keyword declares a variable as read-only." },
      { id:"c2", q:"What is the correct format specifier for printing an integer in C?", opts:["%d","%s","%f","%c"], ans:0, explanation:"%d is the format specifier for integers in printf/scanf." },
      { id:"c3", q:"Which function is used to allocate memory dynamically in C?", opts:["malloc()","alloc()","new()","create()"], ans:0, explanation:"malloc() allocates a block of memory of specified size and returns a pointer." },
      { id:"c4", q:"What does 'sizeof' operator return in C?", opts:["Size in bytes","Size in bits","Number of elements","Memory address"], ans:0, explanation:"sizeof returns the size of a variable or data type in bytes." },
    ],
    medium: [
      { id:"c5", q:"What is the output of: int x=5; printf('%d', x++);", opts:["5","6","4","Error"], ans:0, explanation:"Post-increment returns the original value (5) before incrementing." },
      { id:"c6", q:"Which of these is a valid pointer declaration in C?", opts:["int *p;","int p*;","*int p;","pointer int p;"], ans:0, explanation:"Pointer declaration syntax is: datatype *pointer_name;" },
      { id:"c7", q:"What does 'static' mean for a local variable in C?", opts:["Retains value between calls","Cannot be changed","Stored in heap","Accessible globally"], ans:0, explanation:"Static local variables retain their value between function calls." },
      { id:"c8", q:"What is the result of 7 % 3 in C?", opts:["1","2","3","0"], ans:0, explanation:"7 divided by 3 is 2 remainder 1, so 7 % 3 = 1." },
    ],
    hard: [
      { id:"c9", q:"What is a dangling pointer?", opts:["Points to freed memory","Null pointer","Uninitialized pointer","Wild pointer"], ans:0, explanation:"A dangling pointer points to memory that has already been freed/deallocated." },
      { id:"c10", q:"What does the 'volatile' keyword do in C?", opts:["Prevents compiler optimization","Makes variable constant","Allocates to register","None of these"], ans:0, explanation:"volatile tells the compiler not to optimize the variable, as it may change unexpectedly." },
      { id:"c11", q:"Output of: printf('%d', sizeof('A')) in a 32-bit system?", opts:["4","1","2","8"], ans:0, explanation:"Character literals in C are of type int, so sizeof('A') = 4 on a 32-bit system." },
    ],
  },
  Java: {
    easy: [
      { id:"j1", q:"Which method is the entry point of a Java program?", opts:["public static void main(String[] args)","void start()","public void run()","init()"], ans:0, explanation:"The JVM looks for public static void main(String[] args) to start execution." },
      { id:"j2", q:"Which keyword prevents a class from being subclassed in Java?", opts:["final","static","abstract","sealed"], ans:0, explanation:"A class declared as 'final' cannot be extended by any other class." },
      { id:"j3", q:"What is the default value of a boolean in Java?", opts:["false","true","0","null"], ans:0, explanation:"Default value for boolean instance variables is false in Java." },
      { id:"j4", q:"Which of these is NOT a primitive type in Java?", opts:["String","int","char","boolean"], ans:0, explanation:"String is a class (reference type), not a primitive type in Java." },
    ],
    medium: [
      { id:"j5", q:"What is method overloading in Java?", opts:["Same method name, different parameters","Same method name, different return types","Overriding parent method","Using abstract methods"], ans:0, explanation:"Overloading means multiple methods with the same name but different parameter lists." },
      { id:"j6", q:"Which collection does NOT allow duplicate elements?", opts:["HashSet","ArrayList","LinkedList","Vector"], ans:0, explanation:"HashSet implements the Set interface, which does not allow duplicates." },
      { id:"j7", q:"What does JVM stand for?", opts:["Java Virtual Machine","Java Variable Model","Joint Verification Module","Java Validated Memory"], ans:0, explanation:"JVM (Java Virtual Machine) executes Java bytecode on any platform." },
      { id:"j8", q:"What is the output of: System.out.println(10 / 3) in Java?", opts:["3","3.33","3.0","Error"], ans:0, explanation:"Integer division in Java truncates the decimal — 10/3 = 3." },
    ],
    hard: [
      { id:"j9", q:"What is the purpose of the 'transient' keyword in Java?", opts:["Prevents serialization of a field","Makes field thread-safe","Declares a constant","Marks volatile memory"], ans:0, explanation:"transient fields are not serialized when the object is serialized." },
      { id:"j10", q:"Which design pattern does Java's Iterator implement?", opts:["Behavioral","Creational","Structural","Architectural"], ans:0, explanation:"Iterator is a Behavioral design pattern that allows sequential access to collection elements." },
      { id:"j11", q:"What is the difference between '==' and '.equals()' for Strings in Java?", opts:["== checks reference; .equals() checks value","== checks value; .equals() checks reference","Both check value","Both check reference"], ans:0, explanation:"== compares object references; .equals() compares the actual string content." },
    ],
  },
  Python: {
    easy: [
      { id:"p1", q:"Which keyword is used to define a function in Python?", opts:["def","function","fun","define"], ans:0, explanation:"'def' is the keyword to define a function in Python." },
      { id:"p2", q:"What is the output of: print(type(3.14))?", opts:["<class 'float'>","<class 'int'>","<class 'double'>","<class 'number'>"], ans:0, explanation:"3.14 is a floating-point number, so type() returns <class 'float'>." },
      { id:"p3", q:"Which data structure uses key-value pairs in Python?", opts:["Dictionary","List","Tuple","Set"], ans:0, explanation:"Dictionaries store data as key-value pairs using curly braces {}." },
      { id:"p4", q:"What does len([1,2,3,4]) return?", opts:["4","3","5","Error"], ans:0, explanation:"len() returns the number of elements — the list has 4 elements." },
    ],
    medium: [
      { id:"p5", q:"What is a lambda function in Python?", opts:["Anonymous one-line function","A recursive function","A class method","An async function"], ans:0, explanation:"Lambda creates small anonymous functions: lambda x: x*2" },
      { id:"p6", q:"What does the 'self' parameter represent in a Python class?", opts:["The current instance","The class itself","The parent class","The module"], ans:0, explanation:"'self' refers to the current object instance calling the method." },
      { id:"p7", q:"What is the output of: print(2**10)?", opts:["1024","20","512","100"], ans:0, explanation:"** is the exponentiation operator. 2^10 = 1024." },
      { id:"p8", q:"Which method removes and returns the last item of a list?", opts:["pop()","remove()","delete()","splice()"], ans:0, explanation:"list.pop() removes and returns the last element (or element at given index)." },
    ],
    hard: [
      { id:"p9", q:"What is a Python generator?", opts:["Function using yield to produce values lazily","A class that generates numbers","A list comprehension","A type of decorator"], ans:0, explanation:"Generators use 'yield' to produce values one at a time, saving memory." },
      { id:"p10", q:"What is the GIL in Python?", opts:["Global Interpreter Lock","General Import Library","Global Index List","Generic Interface Layer"], ans:0, explanation:"GIL (Global Interpreter Lock) allows only one thread to execute Python bytecode at a time." },
      { id:"p11", q:"What does @staticmethod decorator do?", opts:["Defines a method that doesn't receive instance/class","Prevents method override","Creates a class variable","Makes method private"], ans:0, explanation:"@staticmethod defines a method that doesn't implicitly receive 'self' or 'cls'." },
    ],
  },
};

// ─── ADAPTIVE ENGINE ──────────────────────────────────────────────────────────
function nextDiff(current, correct) {
  if (correct) return current === "easy" ? "medium" : "hard";
  return current === "hard" ? "medium" : "easy";
}

function pickQ(topic, difficulty, usedIds) {
  const pool = QUESTIONS[topic][difficulty].filter(q => !usedIds.has(q.id));
  if (!pool.length) {
    const all = Object.values(QUESTIONS[topic]).flat().filter(q => !usedIds.has(q.id));
    return all[0] || null;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function computeProfile(history) {
  const profile = {};
  TOPICS.forEach(t => { profile[t] = { correct:0, total:0, diffs:[], score:0, mastery:"" }; });
  history.forEach(h => {
    profile[h.topic].total++;
    if (h.correct) profile[h.topic].correct++;
    profile[h.topic].diffs.push(h.difficulty);
  });
  TOPICS.forEach(t => {
    const d = profile[t];
    if (!d.total) { d.score = 0; d.mastery = "Not Assessed"; return; }
    const acc = d.correct / d.total;
    const dw = d.diffs.reduce((s,x)=>s+(x==="easy"?1:x==="medium"?2:3),0)/d.diffs.length;
    d.score = Math.round((acc*0.6 + (dw/3)*0.4)*100);
    d.mastery = d.score>=80?"Mastered":d.score>=50?"Developing":"Needs Work";
  });
  return profile;
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const LANG_ICONS = { C:"⚙️", Java:"☕", Python:"🐍" };
const LANG_COLORS = { C:"#3b82f6", Java:"#f59e0b", Python:"#10b981" };

function DiffBadge({ level }) {
  const cfg = { easy:{color:C.green,label:"Easy"}, medium:{color:C.gold,label:"Medium"}, hard:{color:C.red,label:"Hard"} };
  const c = cfg[level];
  return <span className="tag" style={{ border:`1px solid ${c.color}50`, color:c.color, background:`${c.color}12` }}>{c.label}</span>;
}

function ProgressRing({ pct, size=80, stroke=5, color=C.blue }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round"
        style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%",transition:"stroke-dashoffset 0.8s ease"}}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={color}
        fontSize={size/5} fontFamily="IBM Plex Mono" fontWeight="600">{pct}%</text>
    </svg>
  );
}

function FloatingParticles() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {[...Array(18)].map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          width: Math.random()*3+1,
          height: Math.random()*3+1,
          borderRadius:"50%",
          background:`rgba(${i%2?99:6},${i%2?179:182},${i%2?237:212},${Math.random()*0.4+0.1})`,
          left:`${Math.random()*100}%`,
          top:`${Math.random()*100}%`,
          animation:`particleDrift ${Math.random()*6+4}s ease-in-out ${Math.random()*4}s infinite`
        }}/>
      ))}
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email===email && u.password===password);
      if (user) { onLogin(user); }
      else { setError("Invalid email or password. Try student@demo.com / demo123"); setLoading(false); }
    }, 900);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{GLOBAL_CSS}</style>
      <FloatingParticles />

      {/* bg glows */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 55%)"}}/>

      {/* left decorative code lines */}
      <div style={{position:"absolute",left:32,top:"50%",transform:"translateY(-50%)",opacity:0.07,fontFamily:"IBM Plex Mono",fontSize:11,lineHeight:2,color:C.cyan,display:"none"}} className="lg-only">
        {["#include <stdio.h>","public class Main {","def __init__(self):","int main() {","  return 0;","}"].map((l,i)=><div key={i}>{l}</div>)}
      </div>

      <div style={{width:"100%",maxWidth:440,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36,animation:"fadeUp 0.5s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#3b82f6,#06b6d4)",marginBottom:16,boxShadow:"0 0 40px rgba(59,130,246,0.3)"}}>
            <span style={{fontSize:28}}>⚡</span>
          </div>
          <h1 style={{fontFamily:"Syne",fontSize:26,fontWeight:800,letterSpacing:"-0.03em"}}>AdaptIQ</h1>
          <p style={{color:C.textMuted,fontSize:14,marginTop:4}}>Adaptive Intelligence Assessment</p>
        </div>

        {/* Card */}
        <div style={{background:"#0d1829",border:"1px solid #1a2840",borderRadius:20,padding:36,boxShadow:"0 24px 60px rgba(0,0,0,0.5)",animation:"fadeUp 0.5s ease 0.1s both"}}>
          <h2 style={{fontFamily:"Syne",fontSize:20,fontWeight:700,marginBottom:6}}>Welcome back</h2>
          <p style={{color:C.textMuted,fontSize:14,marginBottom:28}}>Sign in to continue your learning journey</p>

          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,color:C.textDim,marginBottom:6,fontWeight:600}}>Email</label>
            <input value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
              placeholder="student@demo.com"
              style={{width:"100%",background:"#0a1220",border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"12px 16px",fontSize:15,color:C.text,outline:"none",transition:"border-color 0.2s"}}
              onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=error?C.red:C.border}/>
          </div>

          <div style={{marginBottom:8}}>
            <label style={{display:"block",fontSize:13,color:C.textDim,marginBottom:6,fontWeight:600}}>Password</label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                type={showPw?"text":"password"} placeholder="••••••••"
                style={{width:"100%",background:"#0a1220",border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"12px 48px 12px 16px",fontSize:15,color:C.text,outline:"none",transition:"border-color 0.2s"}}
                onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=error?C.red:C.border}/>
              <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:16}}>
                {showPw?"🙈":"👁️"}
              </button>
            </div>
          </div>

          {error && <div style={{color:C.red,fontSize:13,marginBottom:16,padding:"10px 14px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{error}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={!email||!password||loading}
            style={{width:"100%",marginTop:20,height:48,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading ? <><div style={{width:18,height:18,border:`2px solid rgba(255,255,255,0.3)`,borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> Signing in…</> : "Sign In →"}
          </button>

          <div style={{marginTop:20,padding:14,background:"rgba(59,130,246,0.06)",borderRadius:10,border:"1px solid rgba(59,130,246,0.15)"}}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:6,fontFamily:"IBM Plex Mono"}}>Demo credentials:</div>
            <div style={{fontSize:12,color:C.textDim,fontFamily:"IBM Plex Mono"}}>student@demo.com / demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ user, onStartQuiz, onLogout }) {
  const features = [
    { icon:"🧠", title:"Adaptive Difficulty", desc:"Questions get harder or easier based on your real-time performance." },
    { icon:"📊", title:"Competency Profile", desc:"Get a detailed breakdown of strengths and areas for improvement." },
    { icon:"🎯", title:"Topic Mastery", desc:"Track mastery levels across C, Java, and Python separately." },
    { icon:"⚡", title:"Instant Feedback", desc:"See explanations after every answer to reinforce learning." },
  ];

  const stats = [
    { label:"Questions", value:"30+", color:C.blue },
    { label:"Topics", value:"3",     color:C.cyan },
    { label:"Levels", value:"3",     color:C.purple },
    { label:"~Time",  value:"10min", color:C.green },
  ];

  return (
    <div style={{minHeight:"100vh",position:"relative",overflow:"hidden"}}>
      <style>{GLOBAL_CSS}</style>
      <FloatingParticles/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 10% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(6,182,212,0.05) 0%, transparent 50%)"}}/>

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(7,11,20,0.85)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#3b82f6,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
          <span style={{fontFamily:"Syne",fontWeight:800,fontSize:18,letterSpacing:"-0.02em"}}>AdaptIQ</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14}}>
            {user.name[0]}
          </div>
          <span style={{fontSize:14,color:C.textDim}}>{user.name}</span>
          <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.textMuted,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}
            onMouseOver={e=>{e.target.style.borderColor=C.red;e.target.style.color=C.red;}}
            onMouseOut={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.textMuted;}}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:56,animation:"fadeUp 0.5s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:20,padding:"6px 18px",marginBottom:24,fontSize:13,color:C.blue}}>
            👋 Welcome back, {user.name.split(" ")[0]}!
          </div>
          <h1 style={{fontFamily:"Syne",fontSize:"clamp(2.2rem,5vw,3.6rem)",fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.1,marginBottom:16}}>
            Master Code with<br/>
            <span style={{background:"linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Adaptive Intelligence
            </span>
          </h1>
          <p style={{color:C.textMuted,fontSize:16,lineHeight:1.7,maxWidth:520,margin:"0 auto 40px"}}>
            Our AI-powered assessment dynamically adjusts to your skill level, delivering the perfect challenge across C, Java, and Python.
          </p>
          <button className="btn-primary" onClick={onStartQuiz} style={{padding:"16px 52px",fontSize:17,borderRadius:12,boxShadow:"0 0 50px rgba(59,130,246,0.35)"}}>
            Start Assessment →
          </button>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:56,animation:"fadeUp 0.5s ease 0.1s both"}}>
          {stats.map(s=>(
            <div key={s.label} className="card" style={{textAlign:"center",minWidth:100,padding:"20px 24px"}}>
              <div style={{fontFamily:"IBM Plex Mono",fontSize:28,fontWeight:600,color:s.color}}>{s.value}</div>
              <div style={{color:C.textMuted,fontSize:12,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{marginBottom:56,animation:"fadeUp 0.5s ease 0.2s both"}}>
          <h2 style={{fontFamily:"Syne",fontSize:22,fontWeight:700,marginBottom:24,textAlign:"center"}}>Topics Covered</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
            {TOPICS.map(lang=>(
              <div key={lang} className="card" style={{border:`1px solid ${LANG_COLORS[lang]}30`,position:"relative",overflow:"hidden",cursor:"pointer",transition:"all 0.2s"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=`${LANG_COLORS[lang]}70`;e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=`${LANG_COLORS[lang]}30`;e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${LANG_COLORS[lang]},${LANG_COLORS[lang]}00)`}}/>
                <div style={{fontSize:36,marginBottom:12}}>{LANG_ICONS[lang]}</div>
                <div style={{fontFamily:"Syne",fontWeight:700,fontSize:20,marginBottom:6}}>{lang === "C" ? "C Language" : lang}</div>
                <div style={{color:C.textMuted,fontSize:13,lineHeight:1.6}}>
                  {lang==="C"   && "Pointers, memory, arrays, structs & more"}
                  {lang==="Java"&& "OOP, collections, JVM concepts & more"}
                  {lang==="Python"&& "Functions, classes, data structures & more"}
                </div>
                <div style={{display:"flex",gap:6,marginTop:14}}>
                  {["Easy","Medium","Hard"].map(d=>(
                    <span key={d} className="tag" style={{fontSize:11,padding:"2px 8px",background:`${LANG_COLORS[lang]}12`,color:LANG_COLORS[lang],border:`1px solid ${LANG_COLORS[lang]}30`}}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{animation:"fadeUp 0.5s ease 0.3s both"}}>
          <h2 style={{fontFamily:"Syne",fontSize:22,fontWeight:700,marginBottom:24,textAlign:"center"}}>How It Works</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
            {features.map((f,i)=>(
              <div key={i} className="card" style={{padding:22}}>
                <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
                <div style={{fontFamily:"Syne",fontWeight:600,marginBottom:6,fontSize:15}}>{f.title}</div>
                <div style={{color:C.textMuted,fontSize:13,lineHeight:1.6}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",marginTop:56,padding:40,background:"linear-gradient(135deg,rgba(59,130,246,0.06),rgba(6,182,212,0.06))",border:"1px solid rgba(59,130,246,0.15)",borderRadius:20,animation:"fadeUp 0.5s ease 0.4s both"}}>
          <h3 style={{fontFamily:"Syne",fontSize:22,fontWeight:700,marginBottom:8}}>Ready to test your skills?</h3>
          <p style={{color:C.textMuted,marginBottom:24,fontSize:15}}>12 adaptive questions · personalized profile at the end</p>
          <button className="btn-primary" onClick={onStartQuiz} style={{padding:"14px 40px",fontSize:16}}>Begin Now →</button>
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ SCREEN ──────────────────────────────────────────────────────────────
function QuizScreen({ user, onFinish, onHome }) {
  const TOTAL = 12;
  const [history, setHistory]       = useState([]);
  const [qIdx, setQIdx]             = useState(0);
  const [topicIdx, setTopicIdx]     = useState(0);
  const [diff, setDiff]             = useState("easy");
  const [usedIds, setUsedIds]       = useState(new Set());
  const [currentQ, setCurrentQ]     = useState(null);
  const [selected, setSelected]     = useState(null);
  const [confirmed, setConfirmed]   = useState(false);
  const [analyzing, setAnalyzing]   = useState(false);

  useEffect(()=>{
    const t = TOPICS[0];
    setCurrentQ({ q:pickQ(t,"easy",new Set()), topic:t, diff:"easy" });
  }, []);

  if (!currentQ) return null;

  const { q, topic, diff:qDiff } = currentQ;
  const progress = (qIdx/TOTAL)*100;

  const handleConfirm = () => {
    if (selected===null||confirmed) return;
    setConfirmed(true);
    setAnalyzing(true);
    setTimeout(()=>{
      setAnalyzing(false);
      setTimeout(()=>{
        const correct = selected===q.ans;
        const newHistory = [...history, { topic, difficulty:qDiff, correct, selectedOpt:q.opts[selected], correctOpt:q.opts[q.ans] }];
        setHistory(newHistory);
        const ni = qIdx+1;
        if (ni>=TOTAL) { onFinish(newHistory); return; }
        const nti = Math.min(Math.floor(ni/4), TOPICS.length-1);
        const nt  = TOPICS[nti];
        const nd  = nti!==topicIdx ? "easy" : nextDiff(qDiff, correct);
        const nu  = new Set([...usedIds, q.id]);
        setHistory(newHistory);
        setQIdx(ni); setTopicIdx(nti); setDiff(nd); setUsedIds(nu);
        setSelected(null); setConfirmed(false);
        setCurrentQ({ q:pickQ(nt,nd,nu), topic:nt, diff:nd });
      }, 1000);
    }, 800);
  };

  const isCorrect = confirmed && selected===q.ans;
  const letters = ["A","B","C","D"];

  return (
    <div style={{minHeight:"100vh",position:"relative"}}>
      <style>{GLOBAL_CSS}</style>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(7,11,20,0.9)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <button onClick={onHome} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>← Home</button>
        <div style={{fontFamily:"IBM Plex Mono",color:C.textMuted,fontSize:13}}>
          Q<span style={{color:C.text,fontWeight:600}}>{qIdx+1}</span>/{TOTAL}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:18}}>{LANG_ICONS[topic]}</span>
          <DiffBadge level={qDiff}/>
        </div>
      </nav>

      {/* Progress */}
      <div style={{height:3,background:C.border}}>
        <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#3b82f6,#06b6d4)",transition:"width 0.5s ease"}}/>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"32px 24px"}}>
        {/* Topic pills */}
        <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
          {TOPICS.map(t=>{
            const done = history.filter(h=>h.topic===t).length;
            const active = t===topic;
            return (
              <div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:20,background:active?`${LANG_COLORS[t]}15`:C.surface,border:`1px solid ${active?LANG_COLORS[t]+"50":C.border}`,transition:"all 0.3s"}}>
                <span style={{fontSize:14}}>{LANG_ICONS[t]}</span>
                <span style={{fontSize:13,color:active?LANG_COLORS[t]:C.textMuted,fontWeight:active?600:400}}>{t}</span>
                {done>0&&<span style={{width:18,height:18,borderRadius:"50%",background:`${LANG_COLORS[t]}25`,color:LANG_COLORS[t],fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"IBM Plex Mono",fontWeight:600}}>{done}</span>}
              </div>
            );
          })}
        </div>

        {/* Question card */}
        <div key={qIdx} className="fade-up card" style={{marginBottom:16,position:"relative",overflow:"hidden",border:`1px solid ${LANG_COLORS[topic]}25`,padding:28}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${LANG_COLORS[topic]},${LANG_COLORS[topic]}00)`}}/>
          <p style={{fontSize:"clamp(1rem,2.5vw,1.2rem)",fontWeight:500,lineHeight:1.65,color:C.text}}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{display:"grid",gap:10,marginBottom:20}} className="fade-up">
          {q.opts.map((opt,i)=>{
            let bg=C.surface, border=C.border, color=C.text;
            if (selected===i&&!confirmed) { bg=`${LANG_COLORS[topic]}10`; border=LANG_COLORS[topic]; color=LANG_COLORS[topic]; }
            if (confirmed) {
              if (i===q.ans) { bg="rgba(16,185,129,0.1)"; border=C.green; color=C.green; }
              else if (i===selected) { bg="rgba(239,68,68,0.1)"; border=C.red; color=C.red; }
            }
            return (
              <button key={i} onClick={()=>!confirmed&&setSelected(i)}
                style={{display:"flex",alignItems:"center",gap:14,background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"13px 18px",cursor:confirmed?"default":"pointer",textAlign:"left",transition:"all 0.2s",color,width:"100%"}}>
                <span style={{width:30,height:30,borderRadius:8,background:`${border}25`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"IBM Plex Mono",fontSize:12,fontWeight:700,flexShrink:0,color}}>
                  {letters[i]}
                </span>
                <span style={{fontSize:14.5,flex:1}}>{opt}</span>
                {confirmed&&i===q.ans&&<span style={{fontSize:18,marginLeft:"auto"}}>✓</span>}
                {confirmed&&i===selected&&i!==q.ans&&<span style={{fontSize:18,marginLeft:"auto"}}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {confirmed&&(
          <div style={{background:isCorrect?"rgba(16,185,129,0.07)":"rgba(239,68,68,0.07)",border:`1px solid ${isCorrect?C.green:C.red}30`,borderRadius:12,padding:16,marginBottom:16,animation:"fadeUp 0.3s ease"}}>
            <div style={{color:isCorrect?C.green:C.red,fontWeight:700,marginBottom:4,fontSize:14}}>{isCorrect?"✓ Correct!":"✗ Incorrect"}</div>
            <p style={{color:C.textDim,fontSize:13.5,lineHeight:1.65}}>{q.explanation}</p>
          </div>
        )}

        {/* Analyzing */}
        {analyzing&&(
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:16,height:16,border:`2px solid ${C.border}`,borderTopColor:LANG_COLORS[topic],borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
            <span style={{color:C.textMuted,fontSize:13}}>Adapting next question…</span>
          </div>
        )}

        {/* Confirm */}
        {!confirmed&&(
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button className="btn-primary" onClick={handleConfirm} disabled={selected===null}
              style={{padding:"12px 28px",background:selected!==null?`linear-gradient(135deg,${LANG_COLORS[topic]},${LANG_COLORS[topic]}cc)`:C.border,color:selected!==null?"#fff":C.textMuted}}>
              Confirm →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ user, history, onRetake, onHome }) {
  const profile   = computeProfile(history);
  const overall   = Math.round(TOPICS.reduce((s,t)=>s+(profile[t].score||0),0)/TOPICS.length);
  const correct   = history.filter(h=>h.correct).length;
  const strengths = TOPICS.filter(t=>profile[t].mastery==="Mastered");
  const focus     = TOPICS.filter(t=>profile[t].mastery==="Needs Work");

  const mastColor = s => s==="Mastered"?C.green:s==="Developing"?C.gold:s==="Needs Work"?C.red:C.textMuted;

  return (
    <div style={{minHeight:"100vh",position:"relative"}}>
      <style>{GLOBAL_CSS}</style>
      <FloatingParticles/>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(7,11,20,0.9)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <button onClick={onHome} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13}}>← Home</button>
        <span style={{fontFamily:"Syne",fontWeight:700,fontSize:15}}>Competency Report</span>
        <button className="btn-primary" onClick={onRetake} style={{padding:"7px 18px",fontSize:13}}>Retake</button>
      </nav>

      <div style={{maxWidth:960,margin:"0 auto",padding:"40px 24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:44,animation:"fadeUp 0.5s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:20,padding:"6px 18px",marginBottom:20,fontSize:13,color:C.green}}>
            ✦ Assessment Complete
          </div>
          <h1 style={{fontFamily:"Syne",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:8}}>
            {user.name}'s Profile
          </h1>
          <p style={{color:C.textMuted}}>Based on {history.length} questions across C, Java & Python</p>
        </div>

        {/* Overall card */}
        <div className="card" style={{border:`1px solid rgba(59,130,246,0.3)`,marginBottom:28,display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",position:"relative",overflow:"hidden",animation:"fadeUp 0.5s ease 0.1s both",padding:28}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#3b82f6,#06b6d4,#8b5cf6)"}}/>
          <ProgressRing pct={overall} size={90} stroke={6} color={overall>=70?C.green:overall>=50?C.gold:C.red}/>
          <div style={{flex:1,minWidth:200}}>
            <div style={{color:C.textMuted,fontSize:13,marginBottom:4}}>Overall Competency Score</div>
            <div style={{fontFamily:"Syne",fontSize:"clamp(1.2rem,2.5vw,1.8rem)",fontWeight:800,marginBottom:10}}>
              {overall>=70?"Strong Performance 🎯":overall>=50?"Developing Skills 📈":"Needs Reinforcement 📚"}
            </div>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              <div><span style={{color:C.green,fontFamily:"IBM Plex Mono",fontWeight:700}}>{correct}</span><span style={{color:C.textMuted,fontSize:13}}> correct</span></div>
              <div><span style={{color:C.red,fontFamily:"IBM Plex Mono",fontWeight:700}}>{history.length-correct}</span><span style={{color:C.textMuted,fontSize:13}}> incorrect</span></div>
              <div><span style={{color:C.blue,fontFamily:"IBM Plex Mono",fontWeight:700}}>{Math.round(correct/history.length*100)}%</span><span style={{color:C.textMuted,fontSize:13}}> accuracy</span></div>
            </div>
          </div>
        </div>

        {/* Topic cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:28}}>
          {TOPICS.map((t,i)=>{
            const d=profile[t]; const mc=mastColor(d.mastery);
            return (
              <div key={t} className="card" style={{border:`1px solid ${LANG_COLORS[t]}25`,position:"relative",overflow:"hidden",animation:"fadeUp 0.5s ease both",animationDelay:`${0.2+i*0.1}s`,opacity:0}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${LANG_COLORS[t]},${LANG_COLORS[t]}00)`}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:22}}>{LANG_ICONS[t]}</span>
                      <span style={{fontFamily:"Syne",fontWeight:700,fontSize:16}}>{t === "C" ? "C Language" : t}</span>
                    </div>
                    <span style={{padding:"3px 12px",borderRadius:12,background:`${mc}18`,color:mc,fontSize:12,fontWeight:600}}>{d.mastery}</span>
                  </div>
                  <ProgressRing pct={d.score} size={60} stroke={4} color={mc}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1,background:C.bg,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{color:C.textMuted,fontSize:11,marginBottom:2}}>Correct</div>
                    <div style={{color:C.green,fontFamily:"IBM Plex Mono",fontWeight:600,fontSize:15}}>{d.correct}/{d.total}</div>
                  </div>
                  <div style={{flex:1,background:C.bg,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{color:C.textMuted,fontSize:11,marginBottom:2}}>Accuracy</div>
                    <div style={{fontFamily:"IBM Plex Mono",fontWeight:600,fontSize:15}}>{d.total?Math.round(d.correct/d.total*100):0}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:32,animation:"fadeUp 0.5s ease 0.5s both"}}>
          {strengths.length>0&&(
            <div className="card" style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)"}}>
              <div style={{color:C.green,fontWeight:700,marginBottom:10}}>💪 Strengths</div>
              {strengths.map(t=><div key={t} style={{display:"flex",alignItems:"center",gap:8,color:C.textDim,fontSize:14,marginBottom:6}}><span>{LANG_ICONS[t]}</span>{t === "C" ? "C Language" : t}</div>)}
              <p style={{color:C.textMuted,fontSize:13,marginTop:8,lineHeight:1.6}}>Excellent work! Consider exploring advanced topics in these areas.</p>
            </div>
          )}
          {focus.length>0&&(
            <div className="card" style={{background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)"}}>
              <div style={{color:C.red,fontWeight:700,marginBottom:10}}>📌 Focus Areas</div>
              {focus.map(t=><div key={t} style={{display:"flex",alignItems:"center",gap:8,color:C.textDim,fontSize:14,marginBottom:6}}><span>{LANG_ICONS[t]}</span>{t === "C" ? "C Language" : t}</div>)}
              <p style={{color:C.textMuted,fontSize:13,marginTop:8,lineHeight:1.6}}>Review foundational concepts and practice with structured exercises.</p>
            </div>
          )}
          <div className="card" style={{background:"rgba(139,92,246,0.05)",border:"1px solid rgba(139,92,246,0.2)"}}>
            <div style={{color:C.purple,fontWeight:700,marginBottom:10}}>⚡ Adaptive Summary</div>
            <p style={{color:C.textMuted,fontSize:13,lineHeight:1.7}}>
              The engine made <strong style={{color:C.text}}>{history.length}</strong> adaptive adjustments. You reached hard difficulty in{" "}
              <strong style={{color:C.text}}>{history.filter(h=>h.difficulty==="hard").length}</strong> questions, demonstrating solid depth.
            </p>
          </div>
        </div>

        {/* History table */}
        <div className="card" style={{overflow:"hidden",padding:0,animation:"fadeUp 0.5s ease 0.6s both"}}>
          <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,fontFamily:"Syne",fontWeight:600}}>Response History</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:C.bg}}>
                  {["#","Topic","Difficulty","Result","Your Answer"].map(h=>(
                    <th key={h} style={{padding:"10px 18px",textAlign:"left",color:C.textMuted,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h,i)=>(
                  <tr key={i} style={{borderTop:`1px solid ${C.border}`,transition:"background 0.15s"}}
                    onMouseOver={e=>e.currentTarget.style.background=C.surfaceAlt}
                    onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 18px",fontFamily:"IBM Plex Mono",color:C.textMuted}}>{i+1}</td>
                    <td style={{padding:"10px 18px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <span>{LANG_ICONS[h.topic]}</span>
                        <span style={{color:LANG_COLORS[h.topic],fontWeight:600}}>{h.topic}</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 18px"}}><DiffBadge level={h.difficulty}/></td>
                    <td style={{padding:"10px 18px",color:h.correct?C.green:C.red,fontWeight:700,fontFamily:"IBM Plex Mono"}}>{h.correct?"✓":"✗"}</td>
                    <td style={{padding:"10px 18px",color:C.textDim,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.selectedOpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]   = useState("login");
  const [user, setUser]       = useState(null);
  const [results, setResults] = useState([]);

  const handleLogin  = (u) => { setUser(u); setScreen("home"); };
  const handleLogout = ()  => { setUser(null); setScreen("login"); };
  const handleStart  = ()  => setScreen("quiz");
  const handleFinish = (h) => { setResults(h); setScreen("profile"); };
  const handleRetake = ()  => setScreen("quiz");
  const handleHome   = ()  => setScreen("home");

  if (screen==="login")   return <LoginScreen onLogin={handleLogin}/>;
  if (screen==="home")    return <HomeScreen user={user} onStartQuiz={handleStart} onLogout={handleLogout}/>;
  if (screen==="quiz")    return <QuizScreen user={user} onFinish={handleFinish} onHome={handleHome}/>;
  if (screen==="profile") return <ProfileScreen user={user} history={results} onRetake={handleRetake} onHome={handleHome}/>;
  return null;
}