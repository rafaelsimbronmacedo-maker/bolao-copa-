import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6zRV168ZZP9rr0AgG5ubY58rxJnGK65c",
  authDomain: "bolao-copa-9c616.firebaseapp.com",
  projectId: "bolao-copa-9c616",
  storageBucket: "bolao-copa-9c616.firebasestorage.app",
  messagingSenderId: "1047362773837",
  appId: "1:1047362773837:web:267c4f998dc3d04bdccd04"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const PTS = {
  resultado:3, golsMandante:1, golsVisitante:1, placarExato:3,
  classificado:5, liderGrupo:2,
  r32:4, oitavas:6, quartas:8, semi:12,
  campeao:25, vice:12, terceiro:8,
};

// 12 grupos FINAIS Copa do Mundo 2026
const GRUPOS = {
  A: ["México","África do Sul","Coreia do Sul","Rep. Tcheca"],
  B: ["Canadá","Itália","Catar","Suíça"],
  C: ["Brasil","Marrocos","Haiti","Escócia"],
  D: ["EUA","Paraguai","Austrália","Turquia"],
  E: ["Alemanha","Curaçao","Costa do Marfim","Equador"],
  F: ["Holanda","Japão","Suécia","Tunísia"],
  G: ["Bélgica","Egito","Irã","Nova Zelândia"],
  H: ["Espanha","Cabo Verde","Arábia Saudita","Uruguai"],
  I: ["França","Senegal","Iraque","Noruega"],
  J: ["Argentina","Argélia","Áustria","Jordânia"],
  K: ["Portugal","RD Congo","Uzbequistão","Colômbia"],
  L: ["Inglaterra","Croácia","Gana","Panamá"],
};

const ALL_TEAMS = Object.values(GRUPOS).flat();

const FLAGS = {
  "Brasil":"🇧🇷","Argentina":"🇦🇷","França":"🇫🇷","Alemanha":"🇩🇪",
  "Espanha":"🇪🇸","Portugal":"🇵🇹","Inglaterra":"🇬🇧","Holanda":"🇳🇱",
  "Bélgica":"🇧🇪","Croácia":"🇭🇷","Uruguai":"🇺🇾","México":"🇲🇽",
  "Senegal":"🇸🇳","Marrocos":"🇲🇦","Japão":"🇯🇵","Coreia do Sul":"🇰🇷",
  "Catar":"🇶🇦","EUA":"🇺🇸","Austrália":"🇦🇺","Canadá":"🇨🇦",
  "Gana":"🇬🇭","Suíça":"🇨🇭","Escócia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Itália":"🇮🇹",
  "África do Sul":"🇿🇦","Rep. Tcheca":"🇨🇿","Paraguai":"🇵🇾","Turquia":"🇹🇷",
  "Haiti":"🇭🇹","Curaçao":"🇨🇼","Costa do Marfim":"🇨🇮","Equador":"🇪🇨",
  "Tunísia":"🇹🇳","Suécia":"🇸🇪","Cabo Verde":"🇨🇻","Arábia Saudita":"🇸🇦",
  "Egito":"🇪🇬","Nova Zelândia":"🇳🇿","Irã":"🇮🇷","Argélia":"🇩🇿",
  "Áustria":"🇦🇹","Jordânia":"🇯🇴","Noruega":"🇳🇴","Iraque":"🇮🇶",
  "RD Congo":"🇨🇩","Colômbia":"🇨🇴","Uzbequistão":"🇺🇿","Panamá":"🇵🇦",
};

// 72 jogos da fase de grupos (3 jogos x 4 times = 6 jogos por grupo x 12 grupos)
const GROUP_MATCHES = [
  // Grupo A
  {id:1,g:"A",h:"México",a:"África do Sul",d:"11/06"},
  {id:2,g:"A",h:"Coreia do Sul",a:"Rep. Tcheca",d:"11/06"},
  {id:3,g:"A",h:"México",a:"Coreia do Sul",d:"18/06"},
  {id:4,g:"A",h:"África do Sul",a:"Rep. Tcheca",d:"18/06"},
  {id:5,g:"A",h:"Rep. Tcheca",a:"México",d:"24/06"},
  {id:6,g:"A",h:"África do Sul",a:"Coreia do Sul",d:"24/06"},
  // Grupo B
  {id:7,g:"B",h:"Canadá",a:"Itália",d:"12/06"},
  {id:8,g:"B",h:"Catar",a:"Suíça",d:"13/06"},
  {id:9,g:"B",h:"Suíça",a:"Itália",d:"18/06"},
  {id:10,g:"B",h:"Canadá",a:"Catar",d:"18/06"},
  {id:11,g:"B",h:"Suíça",a:"Canadá",d:"24/06"},
  {id:12,g:"B",h:"Itália",a:"Catar",d:"24/06"},
  // Grupo C
  {id:13,g:"C",h:"Brasil",a:"Marrocos",d:"13/06"},
  {id:14,g:"C",h:"Haiti",a:"Escócia",d:"13/06"},
  {id:15,g:"C",h:"Escócia",a:"Marrocos",d:"19/06"},
  {id:16,g:"C",h:"Brasil",a:"Haiti",d:"19/06"},
  {id:17,g:"C",h:"Escócia",a:"Brasil",d:"24/06"},
  {id:18,g:"C",h:"Marrocos",a:"Haiti",d:"24/06"},
  // Grupo D
  {id:19,g:"D",h:"EUA",a:"Paraguai",d:"12/06"},
  {id:20,g:"D",h:"Austrália",a:"Turquia",d:"13/06"},
  {id:21,g:"D",h:"Turquia",a:"Paraguai",d:"19/06"},
  {id:22,g:"D",h:"EUA",a:"Austrália",d:"19/06"},
  {id:23,g:"D",h:"Turquia",a:"EUA",d:"25/06"},
  {id:24,g:"D",h:"Paraguai",a:"Austrália",d:"25/06"},
  // Grupo E
  {id:25,g:"E",h:"Alemanha",a:"Curaçao",d:"14/06"},
  {id:26,g:"E",h:"Costa do Marfim",a:"Equador",d:"14/06"},
  {id:27,g:"E",h:"Alemanha",a:"Costa do Marfim",d:"20/06"},
  {id:28,g:"E",h:"Equador",a:"Curaçao",d:"20/06"},
  {id:29,g:"E",h:"Equador",a:"Alemanha",d:"25/06"},
  {id:30,g:"E",h:"Curaçao",a:"Costa do Marfim",d:"25/06"},
  // Grupo F
  {id:31,g:"F",h:"Holanda",a:"Japão",d:"14/06"},
  {id:32,g:"F",h:"Suécia",a:"Tunísia",d:"14/06"},
  {id:33,g:"F",h:"Holanda",a:"Suécia",d:"20/06"},
  {id:34,g:"F",h:"Japão",a:"Tunísia",d:"21/06"},
  {id:35,g:"F",h:"Japão",a:"Suécia",d:"25/06"},
  {id:36,g:"F",h:"Tunísia",a:"Holanda",d:"25/06"},
  // Grupo G
  {id:37,g:"G",h:"Bélgica",a:"Egito",d:"15/06"},
  {id:38,g:"G",h:"Irã",a:"Nova Zelândia",d:"15/06"},
  {id:39,g:"G",h:"Bélgica",a:"Irã",d:"21/06"},
  {id:40,g:"G",h:"Nova Zelândia",a:"Egito",d:"21/06"},
  {id:41,g:"G",h:"Nova Zelândia",a:"Bélgica",d:"27/06"},
  {id:42,g:"G",h:"Egito",a:"Irã",d:"27/06"},
  // Grupo H
  {id:43,g:"H",h:"Espanha",a:"Cabo Verde",d:"15/06"},
  {id:44,g:"H",h:"Arábia Saudita",a:"Uruguai",d:"15/06"},
  {id:45,g:"H",h:"Espanha",a:"Arábia Saudita",d:"21/06"},
  {id:46,g:"H",h:"Uruguai",a:"Cabo Verde",d:"21/06"},
  {id:47,g:"H",h:"Uruguai",a:"Espanha",d:"26/06"},
  {id:48,g:"H",h:"Cabo Verde",a:"Arábia Saudita",d:"26/06"},
  // Grupo I
  {id:49,g:"I",h:"França",a:"Senegal",d:"16/06"},
  {id:50,g:"I",h:"Iraque",a:"Noruega",d:"16/06"},
  {id:51,g:"I",h:"França",a:"Iraque",d:"22/06"},
  {id:52,g:"I",h:"Noruega",a:"Senegal",d:"22/06"},
  {id:53,g:"I",h:"Noruega",a:"França",d:"26/06"},
  {id:54,g:"I",h:"Senegal",a:"Iraque",d:"26/06"},
  // Grupo J
  {id:55,g:"J",h:"Argentina",a:"Argélia",d:"16/06"},
  {id:56,g:"J",h:"Áustria",a:"Jordânia",d:"17/06"},
  {id:57,g:"J",h:"Argentina",a:"Áustria",d:"22/06"},
  {id:58,g:"J",h:"Jordânia",a:"Argélia",d:"23/06"},
  {id:59,g:"J",h:"Jordânia",a:"Argentina",d:"27/06"},
  {id:60,g:"J",h:"Argélia",a:"Áustria",d:"27/06"},
  // Grupo K
  {id:61,g:"K",h:"Portugal",a:"RD Congo",d:"17/06"},
  {id:62,g:"K",h:"Colômbia",a:"Uzbequistão",d:"17/06"},
  {id:63,g:"K",h:"Portugal",a:"Uzbequistão",d:"23/06"},
  {id:64,g:"K",h:"Colômbia",a:"RD Congo",d:"23/06"},
  {id:65,g:"K",h:"Colômbia",a:"Portugal",d:"27/06"},
  {id:66,g:"K",h:"RD Congo",a:"Uzbequistão",d:"27/06"},
  // Grupo L
  {id:67,g:"L",h:"Inglaterra",a:"Croácia",d:"17/06"},
  {id:68,g:"L",h:"Gana",a:"Panamá",d:"17/06"},
  {id:69,g:"L",h:"Inglaterra",a:"Gana",d:"23/06"},
  {id:70,g:"L",h:"Panamá",a:"Croácia",d:"23/06"},
  {id:71,g:"L",h:"Panamá",a:"Inglaterra",d:"27/06"},
  {id:72,g:"L",h:"Croácia",a:"Gana",d:"27/06"},
];

const ADMIN_PASS = "copa2026";

const C = {
  bg:"#f7f7f5", card:"#ffffff", border:"#e8e8e4",
  text:"#1a1a1a", sub:"#6b6b6b", muted:"#b0b0a8",
  accent:"#1a1a1a", gold:"#c9a84c", pill:"#f0f0ec",
};

function calcMatchPts(bet, result) {
  if (!result || result.h == null || result.h === "") return null;
  if (!bet || bet.h == null || bet.h === "") return 0;
  const rH=+result.h, rA=+result.a, bH=+bet.h, bA=+bet.a;
  const res=(h,a)=>h>a?"H":a>h?"A":"D";
  let pts=0;
  if(res(bH,bA)===res(rH,rA)) pts+=PTS.resultado;
  if(bH===rH) pts+=PTS.golsMandante;
  if(bA===rA) pts+=PTS.golsVisitante;
  if(bH===rH&&bA===rA) pts+=PTS.placarExato;
  return pts;
}

function calcTotal(pb, pgp, pfp, results, gr, fr) {
  let pts=0;
  GROUP_MATCHES.forEach(m=>{const p=calcMatchPts(pb?.[m.id],results?.[m.id]);if(p)pts+=p;});
  Object.keys(GRUPOS).forEach(g=>{
    const g2=gr?.[g]; if(!g2) return;
    const cl=[g2.first,g2.second].filter(Boolean);
    ["first","second"].forEach(k=>{
      const pick=pgp?.[g]?.[k];
      if(pick&&cl.includes(pick)){pts+=PTS.classificado;if(pick===g2.first)pts+=PTS.liderGrupo;}
    });
  });
  const f=fr||{};
  (pfp?.r32||[]).forEach(t=>{if((f.r32||[]).includes(t))pts+=PTS.r32;});
  (pfp?.oitavas||[]).forEach(t=>{if((f.oitavas||[]).includes(t))pts+=PTS.oitavas;});
  (pfp?.quartas||[]).forEach(t=>{if((f.quartas||[]).includes(t))pts+=PTS.quartas;});
  (pfp?.semi||[]).forEach(t=>{if((f.semi||[]).includes(t))pts+=PTS.semi;});
  if(pfp?.campeao&&pfp.campeao===f.campeao) pts+=PTS.campeao;
  if(pfp?.vice&&pfp.vice===f.vice) pts+=PTS.vice;
  if(pfp?.terceiro&&pfp.terceiro===f.terceiro) pts+=PTS.terceiro;
  return pts;
}

function Num({value, onChange, disabled, sm}) {
  return(
    <input type="number" min="0" max="30" value={value??""} disabled={disabled}
      onChange={e=>onChange?.(e.target.value)}
      style={{
        width:sm?32:42, textAlign:"center", fontSize:sm?13:17, fontWeight:700,
        background:disabled?"#f7f7f5":"#fff",
        border:`1.5px solid ${disabled?"#e8e8e4":"#1a1a1a"}`,
        borderRadius:6, color:disabled?"#b0b0a8":"#1a1a1a",
        padding:"4px 0", outline:"none", fontFamily:"inherit",
        cursor:disabled?"not-allowed":"text",
      }}/>
  );
}

function MatchRow({match, bet, onBet, result, onResult, isAdmin, showPts}) {
  const pts=showPts?calcMatchPts(bet,result):null;
  const exact=pts===8;
  return(
    <div style={{
      display:"flex", alignItems:"center", gap:7,
      background:exact?"#f0fdf4":pts>0?"#fafafa":"#fff",
      border:`1px solid ${exact?"#86efac":pts>0?"#e2e8e2":"#e8e8e4"}`,
      borderRadius:10, padding:"9px 11px", marginBottom:5,
    }}>
      <div style={{fontSize:10,color:C.muted,textAlign:"center",minWidth:40,lineHeight:1.6}}>
        <div style={{color:C.accent,fontWeight:800}}>G-{match.g}</div>
        <div>{match.d}</div>
      </div>
      <div style={{flex:1,textAlign:"right"}}>
        <div style={{fontSize:17}}>{FLAGS[match.h]||"🏳️"}</div>
        <div style={{fontSize:9,color:C.sub,marginTop:1,lineHeight:1}}>{match.h}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        <Num value={bet?.h} onChange={v=>onBet?.({...bet,h:v})} disabled={isAdmin||!onBet}/>
        <span style={{color:C.muted,fontSize:14}}>–</span>
        <Num value={bet?.a} onChange={v=>onBet?.({...bet,a:v})} disabled={isAdmin||!onBet}/>
      </div>
      <div style={{flex:1,textAlign:"left"}}>
        <div style={{fontSize:17}}>{FLAGS[match.a]||"🏳️"}</div>
        <div style={{fontSize:9,color:C.sub,marginTop:1,lineHeight:1}}>{match.a}</div>
      </div>
      {isAdmin&&(
        <div style={{display:"flex",alignItems:"center",gap:3,borderLeft:`1px solid ${C.border}`,paddingLeft:8}}>
          <Num value={result?.h} onChange={v=>onResult?.({...result,h:v})} sm/>
          <span style={{color:C.muted,fontSize:10}}>×</span>
          <Num value={result?.a} onChange={v=>onResult?.({...result,a:v})} sm/>
        </div>
      )}
      {showPts&&(
        <div style={{minWidth:30,textAlign:"center"}}>
          {pts===null?<span style={{fontSize:11,color:C.muted}}>–</span>:
          <span style={{fontSize:13,fontWeight:700,color:exact?"#16a34a":pts>0?"#2d6a4f":C.muted}}>
            {pts>0?`+${pts}`:"0"}
          </span>}
        </div>
      )}
    </div>
  );
}

function Picker({label, teams, value, onChange, multi, max, accent="#1a1a1a"}) {
  const sel=multi?(value||[]):value;
  return(
    <div style={{marginBottom:14}}>
      <div style={{fontSize:10,color:C.sub,fontWeight:700,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>
        {label}{multi&&max&&<span style={{color:C.muted,fontWeight:400}}> {sel.length}/{max}</span>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {teams.map(t=>{
          const on=multi?sel.includes(t):sel===t;
          const full=multi&&!on&&sel.length>=(max||999);
          return(
            <button key={t} onClick={()=>{
              if(full)return;
              if(multi)onChange(on?sel.filter(x=>x!==t):[...sel,t]);
              else onChange(on?"":t);
            }} style={{
              padding:"4px 9px", borderRadius:16, fontSize:11, fontWeight:600,
              border:`1.5px solid ${on?accent:C.border}`,
              background:on?accent:"#fff", color:on?"#fff":full?C.muted:C.text,
              cursor:full?"not-allowed":"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", gap:4,
            }}>{FLAGS[t]||""} {t}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [screen,setScreen]=useState("home");
  const [player,setPlayer]=useState(null);
  const [players,setPlayers]=useState([]);
  const [newName,setNewName]=useState("");
  const [isAdmin,setIsAdmin]=useState(false);
  const [adminPwd,setAdminPwd]=useState("");
  const [filterG,setFilterG]=useState("ALL");
  const [tab,setTab]=useState("jogos");
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [allData,setAllData]=useState({
    players:[],results:{},groupResults:{},finalResults:{},
    bets:{},groupPicks:{},finalPicks:{},
  });

  useEffect(()=>{
    const unsub=onSnapshot(doc(db,"bolao","data"),(snap)=>{
      if(snap.exists()){const d=snap.data();setAllData(d);setPlayers(d.players||[]);}
      setLoading(false);
    });
    return()=>unsub();
  },[]);

  async function save(nd){
    setSaving(true);
    try{await setDoc(doc(db,"bolao","data"),nd,{merge:true});}
    catch(e){console.error(e);}
    setSaving(false);
  }

  async function addPlayer(name){
    if(!name.trim()||players.length>=30||players.includes(name.trim()))return;
    const np=[...players,name.trim()];
    setPlayers(np);
    await save({...allData,players:np});
    setNewName("");
  }
  async function updateBet(id,val){
    await save({...allData,bets:{...allData.bets,[player]:{...(allData.bets?.[player]||{}),[id]:val}}});
  }
  async function updateResult(id,val){
    await save({...allData,results:{...(allData.results||{}),[id]:val}});
  }
  async function updateGroupPick(g,k,val){
    await save({...allData,groupPicks:{...allData.groupPicks,[player]:{
      ...(allData.groupPicks?.[player]||{}),
      [g]:{...(allData.groupPicks?.[player]?.[g]||{}),[k]:val}
    }}});
  }
  async function updateFinalPick(k,val){
    await save({...allData,finalPicks:{...allData.finalPicks,[player]:{...(allData.finalPicks?.[player]||{}),[k]:val}}});
  }
  async function updateGroupResult(g,k,val){
    await save({...allData,groupResults:{...(allData.groupResults||{}),[g]:{...(allData.groupResults?.[g]||{}),[k]:val}}});
  }
  async function updateFinalResult(k,val){
    await save({...allData,finalResults:{...(allData.finalResults||{}),[k]:val}});
  }

  const GS=["ALL","A","B","C","D","E","F","G","H","I","J","K","L"];
  const filtered=filterG==="ALL"?GROUP_MATCHES:GROUP_MATCHES.filter(m=>m.g===filterG);
  const playerTotal=(p)=>calcTotal(
    allData.bets?.[p],allData.groupPicks?.[p],allData.finalPicks?.[p],
    allData.results,allData.groupResults,allData.finalResults
  );

  const base={fontFamily:"'DM Sans','Helvetica Neue',Arial,sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"16px",maxWidth:480,margin:"0 auto"};
  const card={background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:10};
  const topBar={display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${C.border}`};
  const backBtn={background:"none",border:"none",color:C.sub,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,padding:0};
  const inp={background:"#f7f7f5",border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontFamily:"inherit",fontSize:13,outline:"none"};
  const lbl={fontSize:10,letterSpacing:2,color:C.sub,fontWeight:700,marginBottom:12,textTransform:"uppercase"};
  const tabBar={display:"flex",gap:0,marginBottom:14,background:C.pill,borderRadius:12,padding:3};
  const savingBar={position:"fixed",top:0,left:0,right:0,background:"#1a1a1a",color:"#fff",textAlign:"center",fontSize:11,padding:5,zIndex:999,letterSpacing:1};

  if(loading) return(
    <div style={{...base,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:10}}>⚽</div>
        <div style={{fontSize:12,color:C.sub,letterSpacing:2}}>CARREGANDO...</div>
      </div>
    </div>
  );

  // ── HOME ────────────────────────────────────────────────────────────────
  if(screen==="home") return(
    <div style={base}>
      {saving&&<div style={savingBar}>SALVANDO...</div>}
      <div style={{textAlign:"center",padding:"28px 0 20px"}}>
        <div style={{fontSize:48,marginBottom:8}}>⚽</div>
        <div style={{fontSize:10,letterSpacing:6,color:C.sub,fontWeight:700,marginBottom:4}}>BOLÃO</div>
        <div style={{fontSize:26,fontWeight:800,letterSpacing:-0.5}}>Copa do Mundo 2026</div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>EUA · Canadá · México · {players.length} participantes</div>
      </div>

      <div style={card}>
        <div style={lbl}>Jogadores</div>
        {players.length===0&&<div style={{fontSize:13,color:C.muted,marginBottom:12}}>Nenhum jogador ainda.</div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
          {players.map(p=>(
            <button key={p} onClick={()=>{setPlayer(p);setScreen("bets");setTab("jogos");}} style={{
              padding:"8px 15px",borderRadius:20,border:`1.5px solid ${C.border}`,
              background:"#fff",color:C.text,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,
            }}>{p}</button>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:7}}>Adicionar jogador</div>
          <div style={{display:"flex",gap:7}}>
            <input value={newName} onChange={e=>setNewName(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")addPlayer(newName);}}
              placeholder="Nome..." style={{...inp,flex:1}}/>
            <button onClick={()=>addPlayer(newName)} style={{background:"#1a1a1a",border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",padding:"9px 16px",fontFamily:"inherit"}}>+</button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={()=>setScreen("ranking")} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📊 Ranking</button>
        <button onClick={()=>setScreen("admin")} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>⚙️ Admin</button>
      </div>

      <div style={card}>
        <div style={lbl}>Pontuação</div>
        <div style={{fontSize:11,color:C.sub,fontWeight:700,marginBottom:6}}>Por jogo — máx 8 pts</div>
        {[["Resultado certo (V/E/D)","3 pts"],["+ Gols mandante","1 pt"],["+ Gols visitante","1 pt"],["+ Placar exato","3 pts bônus"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.sub}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
          </div>
        ))}
        <div style={{fontSize:11,color:C.sub,fontWeight:700,marginTop:10,marginBottom:6}}>Grupos e mata-mata</div>
        {[["Classificado de grupo","5 pts"],["Bônus: líder do grupo","+2 pts"],["32 avos de final","4 pts"],["Oitavas de final","6 pts"],["Quartas de final","8 pts"],["Semifinal","12 pts"],["🥇 Campeão","25 pts"],["🥈 Vice","12 pts"],["🥉 3º lugar","8 pts"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.sub}}>{l}</span>
            <span style={{fontWeight:700,color:l.includes("Campeão")?C.gold:"inherit"}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── APOSTAS ─────────────────────────────────────────────────────────────
  if(screen==="bets") {
    const myBets=allData.bets?.[player]||{};
    const myGP=allData.groupPicks?.[player]||{};
    const myFP=allData.finalPicks?.[player]||{};
    return(
      <div style={base}>
        {saving&&<div style={savingBar}>SALVANDO...</div>}
        <div style={topBar}>
          <button onClick={()=>setScreen("home")} style={backBtn}>← Voltar</button>
          <div style={{fontWeight:800,fontSize:14}}>⚽ {player}</div>
          <div style={{fontSize:13,fontWeight:800,background:C.pill,padding:"4px 10px",borderRadius:20}}>{playerTotal(player)} pts</div>
        </div>

        <div style={tabBar}>
          {[["jogos","🎯 Jogos"],["grupos","🏅 Grupos"],["knockout","⚔️ Mata-mata"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              flex:1,padding:"8px 3px",border:"none",borderRadius:9,
              background:tab===k?"#fff":"transparent",
              color:tab===k?C.text:C.sub,
              fontWeight:tab===k?700:500,fontSize:11,cursor:"pointer",fontFamily:"inherit",
              boxShadow:tab===k?"0 1px 3px rgba(0,0,0,0.08)":"none",
            }}>{l}</button>
          ))}
        </div>

        {tab==="jogos"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {GS.map(g=>(
              <button key={g} onClick={()=>setFilterG(g)} style={{
                padding:"5px 11px",borderRadius:18,
                border:`1.5px solid ${filterG===g?"#1a1a1a":C.border}`,
                background:filterG===g?"#1a1a1a":"#fff",
                color:filterG===g?"#fff":C.sub,
                cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,
                whiteSpace:"nowrap",flexShrink:0,
              }}>{g==="ALL"?"Todos":`G-${g}`}</button>
            ))}
          </div>
          {filtered.map(m=>(
            <MatchRow key={m.id} match={m}
              bet={myBets[m.id]||{}} onBet={v=>updateBet(m.id,v)}
              result={allData.results?.[m.id]} onResult={null}
              isAdmin={false} showPts={true}/>
          ))}
          <div style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:8,marginBottom:20}}>
            Pontuação aparece quando o admin inserir os resultados
          </div>
        </>}

        {tab==="grupos"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:14,textAlign:"center",lineHeight:1.5}}>
            Escolha 1º e 2º de cada grupo<br/>
            <span style={{fontSize:11,color:C.muted}}>5 pts por classificado · +2 bônus se acertar o líder</span>
          </div>
          {Object.entries(GRUPOS).map(([g,teams])=>(
            <div key={g} style={card}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>Grupo {g}</div>
              {["first","second"].map((k,i)=>(
                <div key={k} style={{marginBottom:i===0?10:0}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1}}>
                    {i===0?"🥇 1º COLOCADO":"🥈 2º COLOCADO"}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {teams.filter(t=>k==="second"?t!==myGP[g]?.first:true).map(t=>{
                      const on=myGP[g]?.[k]===t;
                      return(
                        <button key={t} onClick={()=>updateGroupPick(g,k,on?"":t)} style={{
                          padding:"4px 8px",borderRadius:14,fontSize:11,fontWeight:600,
                          border:`1.5px solid ${on?(i===0?"#c9a84c":"#1a1a1a"):C.border}`,
                          background:on?(i===0?"#fef9ec":"#1a1a1a"):"#fff",
                          color:on?(i===0?"#92711a":"#fff"):C.sub,
                          cursor:"pointer",fontFamily:"inherit",
                          display:"flex",alignItems:"center",gap:3,
                        }}>{FLAGS[t]||""} {t}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>}

        {tab==="knockout"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:14,textAlign:"center"}}>
            Palpites do mata-mata · atualize a cada fase
          </div>
          <div style={card}>
            <Picker label={`32 AVOS → 32 classificados (${PTS.r32} pts cada)`} teams={ALL_TEAMS}
              value={myFP.r32||[]} onChange={v=>updateFinalPick("r32",v)} multi max={32}/>
          </div>
          <div style={card}>
            <Picker label={`OITAVAS → 16 times (${PTS.oitavas} pts cada)`} teams={ALL_TEAMS}
              value={myFP.oitavas||[]} onChange={v=>updateFinalPick("oitavas",v)} multi max={16} accent="#2d6a4f"/>
          </div>
          <div style={card}>
            <Picker label={`QUARTAS → 8 times (${PTS.quartas} pts cada)`} teams={ALL_TEAMS}
              value={myFP.quartas||[]} onChange={v=>updateFinalPick("quartas",v)} multi max={8} accent="#1d4ed8"/>
          </div>
          <div style={card}>
            <Picker label={`SEMIFINAL → 4 times (${PTS.semi} pts cada)`} teams={ALL_TEAMS}
              value={myFP.semi||[]} onChange={v=>updateFinalPick("semi",v)} multi max={4} accent="#7c3aed"/>
          </div>
          <div style={card}>
            <Picker label={`🥇 CAMPEÃO (${PTS.campeao} pts)`} teams={ALL_TEAMS}
              value={myFP.campeao||""} onChange={v=>updateFinalPick("campeao",v)} accent="#c9a84c"/>
            <Picker label={`🥈 VICE (${PTS.vice} pts)`} teams={ALL_TEAMS}
              value={myFP.vice||""} onChange={v=>updateFinalPick("vice",v)} accent="#6b6b6b"/>
            <Picker label={`🥉 3º LUGAR (${PTS.terceiro} pts)`} teams={ALL_TEAMS}
              value={myFP.terceiro||""} onChange={v=>updateFinalPick("terceiro",v)} accent="#92711a"/>
          </div>
        </>}
      </div>
    );
  }

  // ── ADMIN ───────────────────────────────────────────────────────────────
  if(screen==="admin") {
    if(!isAdmin) return(
      <div style={base}>
        <div style={topBar}>
          <button onClick={()=>setScreen("home")} style={backBtn}>← Voltar</button>
          <div style={{fontWeight:700,fontSize:14}}>Admin</div>
          <div/>
        </div>
        <div style={{...card,textAlign:"center",marginTop:40}}>
          <div style={{fontSize:36,marginBottom:14}}>🔐</div>
          <input type="password" value={adminPwd} onChange={e=>setAdminPwd(e.target.value)}
            placeholder="Senha de administrador"
            style={{...inp,width:"100%",marginBottom:12,boxSizing:"border-box",textAlign:"center"}}
            onKeyDown={e=>{if(e.key==="Enter"&&adminPwd===ADMIN_PASS)setIsAdmin(true);}}/>
          <button onClick={()=>{if(adminPwd===ADMIN_PASS)setIsAdmin(true);}}
            style={{width:"100%",background:"#1a1a1a",border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",padding:"12px",fontFamily:"inherit"}}>
            Entrar
          </button>
          <div style={{fontSize:11,color:C.muted,marginTop:10}}>Senha: copa2026</div>
        </div>
      </div>
    );

    return(
      <div style={base}>
        {saving&&<div style={savingBar}>SALVANDO...</div>}
        <div style={topBar}>
          <button onClick={()=>{setScreen("home");setIsAdmin(false);}} style={backBtn}>← Sair</button>
          <div style={{fontWeight:700,fontSize:14}}>⚙️ Resultados</div>
          <div/>
        </div>

        <div style={tabBar}>
          {[["jogos","Jogos"],["grupos","Classificados"],["knockout","Mata-mata"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              flex:1,padding:"8px 3px",border:"none",borderRadius:9,
              background:tab===k?"#fff":"transparent",
              color:tab===k?C.text:C.sub,
              fontWeight:tab===k?700:500,fontSize:12,cursor:"pointer",fontFamily:"inherit",
              boxShadow:tab===k?"0 1px 3px rgba(0,0,0,0.08)":"none",
            }}>{l}</button>
          ))}
        </div>

        {tab==="jogos"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {GS.map(g=>(
              <button key={g} onClick={()=>setFilterG(g)} style={{
                padding:"5px 11px",borderRadius:18,
                border:`1.5px solid ${filterG===g?"#1a1a1a":C.border}`,
                background:filterG===g?"#1a1a1a":"#fff",
                color:filterG===g?"#fff":C.sub,
                cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,
                whiteSpace:"nowrap",flexShrink:0,
              }}>{g==="ALL"?"Todos":`G-${g}`}</button>
            ))}
          </div>
          {filtered.map(m=>(
            <MatchRow key={m.id} match={m}
              bet={{}} onBet={null}
              result={allData.results?.[m.id]||{}} onResult={v=>updateResult(m.id,v)}
              isAdmin={true} showPts={false}/>
          ))}
        </>}

        {tab==="grupos"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:12,textAlign:"center"}}>
            Defina os classificados reais de cada grupo
          </div>
          {Object.entries(GRUPOS).map(([g,teams])=>(
            <div key={g} style={card}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>Grupo {g}</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {["first","second"].map((k,i)=>(
                  <div key={k}>
                    <div style={{fontSize:10,color:C.muted,marginBottom:5,letterSpacing:1}}>
                      {i===0?"🥇 1º LUGAR":"🥈 2º LUGAR"}
                    </div>
                    <select value={allData.groupResults?.[g]?.[k]||""}
                      onChange={e=>updateGroupResult(g,k,e.target.value)}
                      style={{...inp,padding:"5px 8px",fontSize:12}}>
                      <option value="">— selecionar —</option>
                      {teams.map(t=><option key={t} value={t}>{FLAGS[t]||""} {t}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}

        {tab==="knockout"&&<>
          <div style={card}>
            <Picker label="32 AVOS → 32 classificados" teams={ALL_TEAMS}
              value={allData.finalResults?.r32||[]} onChange={v=>updateFinalResult("r32",v)} multi max={32}/>
          </div>
          <div style={card}>
            <Picker label="OITAVAS → 16 times" teams={ALL_TEAMS}
              value={allData.finalResults?.oitavas||[]} onChange={v=>updateFinalResult("oitavas",v)} multi max={16} accent="#2d6a4f"/>
          </div>
          <div style={card}>
            <Picker label="QUARTAS → 8 times" teams={ALL_TEAMS}
              value={allData.finalResults?.quartas||[]} onChange={v=>updateFinalResult("quartas",v)} multi max={8} accent="#1d4ed8"/>
          </div>
          <div style={card}>
            <Picker label="SEMIFINAL → 4 times" teams={ALL_TEAMS}
              value={allData.finalResults?.semi||[]} onChange={v=>updateFinalResult("semi",v)} multi max={4} accent="#7c3aed"/>
          </div>
          <div style={card}>
            <Picker label="🥇 Campeão" teams={ALL_TEAMS}
              value={allData.finalResults?.campeao||""} onChange={v=>updateFinalResult("campeao",v)} accent="#c9a84c"/>
            <Picker label="🥈 Vice" teams={ALL_TEAMS}
              value={allData.finalResults?.vice||""} onChange={v=>updateFinalResult("vice",v)} accent="#6b6b6b"/>
            <Picker label="🥉 3º lugar" teams={ALL_TEAMS}
              value={allData.finalResults?.terceiro||""} onChange={v=>updateFinalResult("terceiro",v)} accent="#92711a"/>
          </div>
        </>}
      </div>
    );
  }

  // ── RANKING ─────────────────────────────────────────────────────────────
  if(screen==="ranking") {
    const rows=players.map(p=>({name:p,pts:playerTotal(p)}))
      .sort((a,b)=>b.pts-a.pts||a.name.localeCompare(b.name));
    const medals=["🥇","🥈","🥉"];
    return(
      <div style={base}>
        <div style={topBar}>
          <button onClick={()=>setScreen("home")} style={backBtn}>← Voltar</button>
          <div style={{fontWeight:700,fontSize:14}}>📊 Ranking</div>
          <div/>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:10}}>
          <div style={{background:"#1a1a1a",padding:"10px 14px",fontSize:10,fontWeight:800,color:"#fff",letterSpacing:3}}>
            CLASSIFICAÇÃO GERAL
          </div>
          {rows.length===0&&(
            <div style={{padding:20,textAlign:"center",color:C.muted,fontSize:13}}>
              Nenhuma pontuação ainda
            </div>
          )}
          {rows.map((r,i)=>(
            <div key={r.name} style={{
              display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
              borderBottom:i<rows.length-1?`1px solid ${C.border}`:"none",
              background:i===0?"#fafaf7":"#fff",
            }}>
              <div style={{fontSize:i<3?18:12,minWidth:26,textAlign:"center"}}>
                {i<3?medals[i]:`${i+1}º`}
              </div>
              <div style={{flex:1,fontWeight:i<3?700:500,fontSize:14}}>{r.name}</div>
              <div style={{fontFamily:"monospace",fontWeight:800,fontSize:i<3?17:13,
                color:i===0?C.gold:i===1?"#6b6b6b":i===2?"#92711a":C.muted}}>
                {r.pts} pts
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={lbl}>Critério de desempate</div>
          {["1. Mais placares exatos","2. Mais acertos de classificados","3. Mais pontos no mata-mata","4. Palpite do campeão","5. Sorteio"].map(l=>(
            <div key={l} style={{fontSize:12,color:C.sub,marginBottom:5}}>{l}</div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
