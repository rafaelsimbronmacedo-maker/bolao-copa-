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
  classificado:5, liderGrupo:2, melhorTerceiro:3,
  r32:3, oitavas:6, quartas:8, semi:12,
  campeao:25, vice:12, terceiro:8,
};

const GRUPOS = {
  A:["México","África do Sul","Coreia do Sul","Rep. Tcheca"],
  B:["Canadá","Bósnia e Herzegovina","Catar","Suíça"],
  C:["Brasil","Marrocos","Haiti","Escócia"],
  D:["EUA","Paraguai","Austrália","Turquia"],
  E:["Alemanha","Curaçao","Costa do Marfim","Equador"],
  F:["Holanda","Japão","Suécia","Tunísia"],
  G:["Bélgica","Egito","Irã","Nova Zelândia"],
  H:["Espanha","Cabo Verde","Arábia Saudita","Uruguai"],
  I:["França","Senegal","Iraque","Noruega"],
  J:["Argentina","Argélia","Áustria","Jordânia"],
  K:["Portugal","RD Congo","Uzbequistão","Colômbia"],
  L:["Inglaterra","Croácia","Gana","Panamá"],
};
const ALL_TEAMS = Object.values(GRUPOS).flat();

const FLAGS = {
  "Brasil":"🇧🇷","Argentina":"🇦🇷","França":"🇫🇷","Alemanha":"🇩🇪",
  "Espanha":"🇪🇸","Portugal":"🇵🇹","Inglaterra":"🇬🇧","Holanda":"🇳🇱",
  "Bélgica":"🇧🇪","Croácia":"🇭🇷","Uruguai":"🇺🇾","México":"🇲🇽",
  "Senegal":"🇸🇳","Marrocos":"🇲🇦","Japão":"🇯🇵","Coreia do Sul":"🇰🇷",
  "Catar":"🇶🇦","EUA":"🇺🇸","Austrália":"🇦🇺","Canadá":"🇨🇦",
  "Gana":"🇬🇭","Suíça":"🇨🇭","Escócia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Bósnia e Herzegovina":"🇧🇦",
  "África do Sul":"🇿🇦","Rep. Tcheca":"🇨🇿","Paraguai":"🇵🇾","Turquia":"🇹🇷",
  "Haiti":"🇭🇹","Curaçao":"🇨🇼","Costa do Marfim":"🇨🇮","Equador":"🇪🇨",
  "Tunísia":"🇹🇳","Suécia":"🇸🇪","Cabo Verde":"🇨🇻","Arábia Saudita":"🇸🇦",
  "Egito":"🇪🇬","Nova Zelândia":"🇳🇿","Irã":"🇮🇷","Argélia":"🇩🇿",
  "Áustria":"🇦🇹","Jordânia":"🇯🇴","Noruega":"🇳🇴","Iraque":"🇮🇶",
  "RD Congo":"🇨🇩","Colômbia":"🇨🇴","Uzbequistão":"🇺🇿","Panamá":"🇵🇦",
};

const GROUP_MATCHES = [
  {id:1,g:"A",h:"México",a:"África do Sul",d:"11/06"},
  {id:2,g:"A",h:"Coreia do Sul",a:"Rep. Tcheca",d:"11/06"},
  {id:3,g:"A",h:"México",a:"Coreia do Sul",d:"18/06"},
  {id:4,g:"A",h:"África do Sul",a:"Rep. Tcheca",d:"18/06"},
  {id:5,g:"A",h:"Rep. Tcheca",a:"México",d:"24/06"},
  {id:6,g:"A",h:"África do Sul",a:"Coreia do Sul",d:"24/06"},
  {id:7,g:"B",h:"Canadá",a:"Bósnia e Herzegovina",d:"12/06"},
  {id:8,g:"B",h:"Catar",a:"Suíça",d:"13/06"},
  {id:9,g:"B",h:"Suíça",a:"Bósnia e Herzegovina",d:"18/06"},
  {id:10,g:"B",h:"Canadá",a:"Catar",d:"18/06"},
  {id:11,g:"B",h:"Suíça",a:"Canadá",d:"24/06"},
  {id:12,g:"B",h:"Bósnia e Herzegovina",a:"Catar",d:"24/06"},
  {id:13,g:"C",h:"Brasil",a:"Marrocos",d:"13/06"},
  {id:14,g:"C",h:"Haiti",a:"Escócia",d:"13/06"},
  {id:15,g:"C",h:"Escócia",a:"Marrocos",d:"19/06"},
  {id:16,g:"C",h:"Brasil",a:"Haiti",d:"19/06"},
  {id:17,g:"C",h:"Escócia",a:"Brasil",d:"24/06"},
  {id:18,g:"C",h:"Marrocos",a:"Haiti",d:"24/06"},
  {id:19,g:"D",h:"EUA",a:"Paraguai",d:"12/06"},
  {id:20,g:"D",h:"Austrália",a:"Turquia",d:"13/06"},
  {id:21,g:"D",h:"Turquia",a:"Paraguai",d:"19/06"},
  {id:22,g:"D",h:"EUA",a:"Austrália",d:"19/06"},
  {id:23,g:"D",h:"Turquia",a:"EUA",d:"25/06"},
  {id:24,g:"D",h:"Paraguai",a:"Austrália",d:"25/06"},
  {id:25,g:"E",h:"Alemanha",a:"Curaçao",d:"14/06"},
  {id:26,g:"E",h:"Costa do Marfim",a:"Equador",d:"14/06"},
  {id:27,g:"E",h:"Alemanha",a:"Costa do Marfim",d:"20/06"},
  {id:28,g:"E",h:"Equador",a:"Curaçao",d:"20/06"},
  {id:29,g:"E",h:"Equador",a:"Alemanha",d:"25/06"},
  {id:30,g:"E",h:"Curaçao",a:"Costa do Marfim",d:"25/06"},
  {id:31,g:"F",h:"Holanda",a:"Japão",d:"14/06"},
  {id:32,g:"F",h:"Suécia",a:"Tunísia",d:"14/06"},
  {id:33,g:"F",h:"Holanda",a:"Suécia",d:"20/06"},
  {id:34,g:"F",h:"Japão",a:"Tunísia",d:"21/06"},
  {id:35,g:"F",h:"Japão",a:"Suécia",d:"25/06"},
  {id:36,g:"F",h:"Tunísia",a:"Holanda",d:"25/06"},
  {id:37,g:"G",h:"Bélgica",a:"Egito",d:"15/06"},
  {id:38,g:"G",h:"Irã",a:"Nova Zelândia",d:"15/06"},
  {id:39,g:"G",h:"Bélgica",a:"Irã",d:"21/06"},
  {id:40,g:"G",h:"Nova Zelândia",a:"Egito",d:"21/06"},
  {id:41,g:"G",h:"Nova Zelândia",a:"Bélgica",d:"27/06"},
  {id:42,g:"G",h:"Egito",a:"Irã",d:"27/06"},
  {id:43,g:"H",h:"Espanha",a:"Cabo Verde",d:"15/06"},
  {id:44,g:"H",h:"Arábia Saudita",a:"Uruguai",d:"15/06"},
  {id:45,g:"H",h:"Espanha",a:"Arábia Saudita",d:"21/06"},
  {id:46,g:"H",h:"Uruguai",a:"Cabo Verde",d:"21/06"},
  {id:47,g:"H",h:"Uruguai",a:"Espanha",d:"26/06"},
  {id:48,g:"H",h:"Cabo Verde",a:"Arábia Saudita",d:"26/06"},
  {id:49,g:"I",h:"França",a:"Senegal",d:"16/06"},
  {id:50,g:"I",h:"Iraque",a:"Noruega",d:"16/06"},
  {id:51,g:"I",h:"França",a:"Iraque",d:"22/06"},
  {id:52,g:"I",h:"Noruega",a:"Senegal",d:"22/06"},
  {id:53,g:"I",h:"Noruega",a:"França",d:"26/06"},
  {id:54,g:"I",h:"Senegal",a:"Iraque",d:"26/06"},
  {id:55,g:"J",h:"Argentina",a:"Argélia",d:"16/06"},
  {id:56,g:"J",h:"Áustria",a:"Jordânia",d:"17/06"},
  {id:57,g:"J",h:"Argentina",a:"Áustria",d:"22/06"},
  {id:58,g:"J",h:"Jordânia",a:"Argélia",d:"23/06"},
  {id:59,g:"J",h:"Jordânia",a:"Argentina",d:"27/06"},
  {id:60,g:"J",h:"Argélia",a:"Áustria",d:"27/06"},
  {id:61,g:"K",h:"Portugal",a:"RD Congo",d:"17/06"},
  {id:62,g:"K",h:"Colômbia",a:"Uzbequistão",d:"17/06"},
  {id:63,g:"K",h:"Portugal",a:"Uzbequistão",d:"23/06"},
  {id:64,g:"K",h:"Colômbia",a:"RD Congo",d:"23/06"},
  {id:65,g:"K",h:"Colômbia",a:"Portugal",d:"27/06"},
  {id:66,g:"K",h:"RD Congo",a:"Uzbequistão",d:"27/06"},
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
  green:"#2d6a4f", greenBg:"#f0fdf4",
};

// ─── LÓGICA DE TABELA DE GRUPOS ──────────────────────────────────────────────
function calcGroupTable(groupId, results) {
  const teams = GRUPOS[groupId];
  const matches = GROUP_MATCHES.filter(m => m.g === groupId);
  const table = {};
  teams.forEach(t => { table[t] = {pts:0,j:0,v:0,e:0,d:0,gp:0,gc:0,sg:0}; });

  matches.forEach(m => {
    const r = results?.[m.id];
    if (!r || r.h === "" || r.h == null) return;
    const rH=+r.h, rA=+r.a;
    table[m.h].j++; table[m.a].j++;
    table[m.h].gp+=rH; table[m.h].gc+=rA; table[m.h].sg+=rH-rA;
    table[m.a].gp+=rA; table[m.a].gc+=rH; table[m.a].sg+=rA-rH;
    if(rH>rA){ table[m.h].pts+=3; table[m.h].v++; table[m.a].d++; }
    else if(rH<rA){ table[m.a].pts+=3; table[m.a].v++; table[m.h].d++; }
    else { table[m.h].pts+=1; table[m.h].e++; table[m.a].pts+=1; table[m.a].e++; }
  });

  return Object.entries(table)
    .map(([name,s])=>({name,...s}))
    .sort((a,b)=>b.pts-a.pts||b.sg-a.sg||b.gp-a.gp||a.name.localeCompare(b.name));
}

function getAllGroupTables(results) {
  const tables = {};
  Object.keys(GRUPOS).forEach(g => { tables[g] = calcGroupTable(g, results); });
  return tables;
}

function getClassified(results) {
  const tables = getAllGroupTables(results);
  const firsts = {}, seconds = {}, thirds = [];

  Object.entries(tables).forEach(([g, rows]) => {
    if(rows[0]) firsts[g] = rows[0].name;
    if(rows[1]) seconds[g] = rows[1].name;
    if(rows[2]) thirds.push({...rows[2], group:g});
  });

  // 8 melhores terceiros por pts, saldo, gols
  const best8thirds = [...thirds]
    .sort((a,b)=>b.pts-a.pts||b.sg-a.sg||b.gp-a.gp)
    .slice(0,8)
    .map(t=>t.name);

  return { firsts, seconds, thirds: best8thirds, allThirds: thirds };
}

// ─── PONTUAÇÃO ───────────────────────────────────────────────────────────────
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

function calcPlayerTotal(pb, pgp, pfp, results, koResults) {
  let pts = 0;

  // Jogos fase de grupos
  GROUP_MATCHES.forEach(m => {
    const p = calcMatchPts(pb?.[m.id], results?.[m.id]);
    if(p) pts += p;
  });

  // Classificados de grupos (automático pelos resultados)
  const {firsts, seconds, thirds: best8} = getClassified(results);
  Object.keys(GRUPOS).forEach(g => {
    const p1 = pgp?.[g]?.first, p2 = pgp?.[g]?.second;
    if(p1 && firsts[g] === p1) { pts += PTS.classificado + PTS.liderGrupo; }
    else if(p1 && seconds[g] === p1) { pts += PTS.classificado; }
    if(p2 && seconds[g] === p2) { pts += PTS.classificado; }
    else if(p2 && firsts[g] === p2) { pts += PTS.classificado; }
  });

  // Melhor terceiro apostado
  (pgp?.thirds||[]).forEach(t => {
    if(best8.includes(t)) pts += PTS.melhorTerceiro;
  });

  // Jogos do mata-mata (placar por jogo)
  const ko = koResults || {};
  const myKoBets = pfp?.koBets || {};

  ["r32","oitavas","quartas","semi","final","terceiro"].forEach(fase => {
    (ko[fase]||[]).forEach((jogo,i) => {
      const bet = myKoBets?.[fase]?.[i];
      const p = calcMatchPts(bet, jogo.result);
      if(p) pts += p;
      // bônus por acertar o vencedor do jogo
      if(jogo.result && bet) {
        const rH=+jogo.result.h, rA=+jogo.result.a;
        const bH=+bet.h, bA=+bet.a;
        if(bH!=null&&bA!=null&&rH!=null&&rA!=null) {
          const rWin = rH>rA?jogo.home:rA>rH?jogo.away:"empate";
          const bWin = bH>bA?jogo.home:bA>bH?jogo.away:"empate";
          if(rWin===bWin && rWin!=="empate") {
            const bonuses = {r32:PTS.r32,oitavas:PTS.oitavas,quartas:PTS.quartas,semi:PTS.semi,final:PTS.campeao,terceiro:PTS.terceiro};
            pts += bonuses[fase]||0;
          }
        }
      }
    });
  });

  return pts;
}

// ─── COMPONENTES ─────────────────────────────────────────────────────────────
const C2 = C;

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

function MatchRow({match, bet, onBet, result, onResult, isAdmin, showPts, label}) {
  const pts = showPts ? calcMatchPts(bet, result) : null;
  const exact = pts === 8;
  return(
    <div style={{
      display:"flex", alignItems:"center", gap:7,
      background:exact?"#f0fdf4":pts>0?"#fafafa":"#fff",
      border:`1px solid ${exact?"#86efac":pts>0?"#e2e8e2":"#e8e8e4"}`,
      borderRadius:10, padding:"9px 11px", marginBottom:5,
    }}>
      <div style={{fontSize:9,color:C.muted,textAlign:"center",minWidth:36,lineHeight:1.5}}>
        {label?<div style={{color:C.accent,fontWeight:800,fontSize:9}}>{label}</div>:
        <><div style={{color:C.accent,fontWeight:800}}>G-{match.g}</div><div>{match.d}</div></>}
      </div>
      <div style={{flex:1,textAlign:"right"}}>
        <div style={{fontSize:16}}>{FLAGS[match.h]||"🏳️"}</div>
        <div style={{fontSize:9,color:C.sub,marginTop:1,lineHeight:1}}>{match.h}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        <Num value={bet?.h} onChange={v=>onBet?.({...bet,h:v})} disabled={isAdmin||!onBet}/>
        <span style={{color:C.muted,fontSize:14}}>–</span>
        <Num value={bet?.a} onChange={v=>onBet?.({...bet,a:v})} disabled={isAdmin||!onBet}/>
      </div>
      <div style={{flex:1,textAlign:"left"}}>
        <div style={{fontSize:16}}>{FLAGS[match.a]||"🏳️"}</div>
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

function GroupTable({groupId, results}) {
  const rows = calcGroupTable(groupId, results);
  const allPlayed = GROUP_MATCHES.filter(m=>m.g===groupId).every(m=>results?.[m.id]?.h!=null&&results?.[m.id]?.h!=="");
  return(
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:700,color:C.sub,marginBottom:5,letterSpacing:1}}>GRUPO {groupId}</div>
      <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"24px 1fr 28px 28px 28px 28px 28px",gap:0,background:C.pill,padding:"5px 8px",fontSize:9,fontWeight:700,color:C.muted,letterSpacing:1}}>
          <div>#</div><div>Seleção</div><div style={{textAlign:"center"}}>J</div>
          <div style={{textAlign:"center"}}>P</div><div style={{textAlign:"center"}}>SG</div>
          <div style={{textAlign:"center"}}>GP</div><div style={{textAlign:"center"}}>GC</div>
        </div>
        {rows.map((r,i)=>(
          <div key={r.name} style={{
            display:"grid",gridTemplateColumns:"24px 1fr 28px 28px 28px 28px 28px",
            gap:0,padding:"6px 8px",fontSize:11,
            borderTop:`1px solid ${C.border}`,
            background: allPlayed&&i<2?"#f0fdf4":"#fff",
          }}>
            <div style={{fontWeight:700,color:allPlayed&&i<2?"#16a34a":C.muted}}>{i+1}</div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span>{FLAGS[r.name]||""}</span>
              <span style={{fontSize:10,color:C.text,fontWeight:i<2?700:400}}>{r.name}</span>
            </div>
            <div style={{textAlign:"center",color:C.sub}}>{r.j}</div>
            <div style={{textAlign:"center",fontWeight:700,color:C.text}}>{r.pts}</div>
            <div style={{textAlign:"center",color:r.sg>0?"#16a34a":r.sg<0?"#c0392b":C.sub}}>{r.sg>0?"+":""}{r.sg}</div>
            <div style={{textAlign:"center",color:C.sub}}>{r.gp}</div>
            <div style={{textAlign:"center",color:C.sub}}>{r.gc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KoMatchRow({match, bet, onBet, onResult, isAdmin, showPts, fase}) {
  const pts = showPts ? calcMatchPts(bet, match.result) : null;
  const exact = pts === 8;
  const hasTeams = match.home && match.away;

  if(!hasTeams && !isAdmin) return(
    <div style={{background:"#f7f7f5",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px",marginBottom:5,textAlign:"center",fontSize:11,color:C.muted}}>
      A definir após fase de grupos
    </div>
  );

  return(
    <div style={{
      display:"flex",alignItems:"center",gap:7,
      background:exact?"#f0fdf4":pts>0?"#fafafa":"#fff",
      border:`1px solid ${exact?"#86efac":pts>0?"#e2e8e2":"#e8e8e4"}`,
      borderRadius:10,padding:"9px 11px",marginBottom:5,
    }}>
      <div style={{fontSize:9,color:C.muted,textAlign:"center",minWidth:36}}>
        <div style={{color:C.accent,fontWeight:800,fontSize:8}}>{fase}</div>
      </div>
      <div style={{flex:1,textAlign:"right"}}>
        <div style={{fontSize:16}}>{FLAGS[match.home]||"❓"}</div>
        <div style={{fontSize:9,color:C.sub,marginTop:1,lineHeight:1}}>{match.home||"?"}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        <Num value={bet?.h} onChange={v=>onBet?.({...bet,h:v})} disabled={isAdmin||!onBet||!hasTeams}/>
        <span style={{color:C.muted,fontSize:14}}>–</span>
        <Num value={bet?.a} onChange={v=>onBet?.({...bet,a:v})} disabled={isAdmin||!onBet||!hasTeams}/>
      </div>
      <div style={{flex:1,textAlign:"left"}}>
        <div style={{fontSize:16}}>{FLAGS[match.away]||"❓"}</div>
        <div style={{fontSize:9,color:C.sub,marginTop:1,lineHeight:1}}>{match.away||"?"}</div>
      </div>
      {isAdmin&&(
        <div style={{display:"flex",alignItems:"center",gap:3,borderLeft:`1px solid ${C.border}`,paddingLeft:8}}>
          <Num value={match.result?.h} onChange={v=>onResult?.({...match.result,h:v})} sm/>
          <span style={{color:C.muted,fontSize:10}}>×</span>
          <Num value={match.result?.a} onChange={v=>onResult?.({...match.result,a:v})} sm/>
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

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("home");
  const [player,setPlayer]=useState(null);
  const [players,setPlayers]=useState([]);
  const [isAdmin,setIsAdmin]=useState(false);
  const [adminPwd,setAdminPwd]=useState("");
  const [filterG,setFilterG]=useState("ALL");
  const [tab,setTab]=useState("jogos");
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [allData,setAllData]=useState({
    players:{}, results:{}, bets:{}, groupPicks:{}, finalPicks:{},
    koMatches:{}, // chaveamento do mata-mata gerado pelo admin
  });
  const [loginName,setLoginName]=useState("");
  const [loginPwd,setLoginPwd]=useState("");
  const [loginError,setLoginError]=useState("");
  const [newName,setNewName]=useState("");
  const [newPwd,setNewPwd]=useState("");

  useEffect(()=>{
    const unsub=onSnapshot(doc(db,"bolao","data"),(snap)=>{
      if(snap.exists()){
        const d=snap.data();
        setAllData(d);
        setPlayers(Object.keys(d.players||{}));
      }
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

  async function addPlayer(name,pwd){
    if(!name.trim()||!pwd.trim()||players.length>=30) return;
    const np={...(allData.players||{}),[name.trim()]:{senha:pwd.trim()}};
    await save({...allData,players:np});
    setNewName(""); setNewPwd("");
  }

  async function removePlayer(name){
    const np={...(allData.players||{})};
    delete np[name];
    await save({...allData,players:np});
  }

  function handleLogin(){
    const name=loginName.trim(), pwd=loginPwd.trim();
    if(!allData.players?.[name]){setLoginError("Jogador não encontrado.");return;}
    if(allData.players[name].senha!==pwd){setLoginError("Senha incorreta.");return;}
    setPlayer(name); setLoginError(""); setLoginPwd("");
    setScreen("bets"); setTab("jogos");
  }

  async function updateBet(id,val){
    await save({...allData,bets:{...allData.bets,[player]:{...(allData.bets?.[player]||{}),[id]:val}}});
  }

  async function updateGroupPick(g,k,val){
    await save({...allData,groupPicks:{...allData.groupPicks,[player]:{
      ...(allData.groupPicks?.[player]||{}),
      [g]:{...(allData.groupPicks?.[player]?.[g]||{}),[k]:val}
    }}});
  }

  async function updateThirdsPick(val){
    await save({...allData,groupPicks:{...allData.groupPicks,[player]:{
      ...(allData.groupPicks?.[player]||{}), thirds:val
    }}});
  }

  async function updateKoBet(fase,idx,val){
    const fp = allData.finalPicks?.[player] || {};
    const koBets = fp.koBets || {};
    const faseBets = koBets[fase] ? [...koBets[fase]] : [];
    faseBets[idx] = val;
    await save({...allData,finalPicks:{...allData.finalPicks,[player]:{
      ...fp, koBets:{...koBets,[fase]:faseBets}
    }}});
  }

  async function updateResult(id,val){
    await save({...allData,results:{...(allData.results||{}),[id]:val}});
  }

  async function updateKoMatch(fase,idx,field,val){
    const ko = allData.koMatches || {};
    const fase_arr = ko[fase] ? JSON.parse(JSON.stringify(ko[fase])) : [];
    if(!fase_arr[idx]) fase_arr[idx]={home:"",away:"",result:{}};
    if(field==="result"){
      fase_arr[idx].result = val;
    } else {
      fase_arr[idx][field] = val;
    }
    await save({...allData,koMatches:{...ko,[fase]:fase_arr}});
  }

  // Auto-gerar chaveamento dos 32 avos com base nos resultados
  async function generateR32(){
    const {firsts,seconds} = getClassified(allData.results||{});
    // Chaveamento fixo Copa 2026 (1º vs 2º de grupos opostos)
    const pairs = [
      [firsts["A"],seconds["C"]],[firsts["C"],seconds["A"]],
      [firsts["B"],seconds["D"]],[firsts["D"],seconds["B"]],
      [firsts["E"],seconds["G"]],[firsts["G"],seconds["E"]],
      [firsts["F"],seconds["H"]],[firsts["H"],seconds["F"]],
      [firsts["I"],seconds["K"]],[firsts["K"],seconds["I"]],
      [firsts["J"],seconds["L"]],[firsts["L"],seconds["J"]],
      // Os 8 melhores terceiros são distribuídos nos slots restantes
      ["T3-1","T3-2"],[firsts["T3-3"]||"?","T3-4"],
      ["T3-5","T3-6"],["T3-7","T3-8"],
    ];
    const {thirds} = getClassified(allData.results||{});
    // Montar jogos reais
    const r32 = [
      {home:firsts["A"]||"?",away:seconds["C"]||"?",result:{}},
      {home:firsts["C"]||"?",away:seconds["A"]||"?",result:{}},
      {home:firsts["B"]||"?",away:seconds["D"]||"?",result:{}},
      {home:firsts["D"]||"?",away:seconds["B"]||"?",result:{}},
      {home:firsts["E"]||"?",away:seconds["G"]||"?",result:{}},
      {home:firsts["G"]||"?",away:seconds["E"]||"?",result:{}},
      {home:firsts["F"]||"?",away:seconds["H"]||"?",result:{}},
      {home:firsts["H"]||"?",away:seconds["F"]||"?",result:{}},
      {home:firsts["I"]||"?",away:seconds["K"]||"?",result:{}},
      {home:firsts["K"]||"?",away:seconds["I"]||"?",result:{}},
      {home:firsts["J"]||"?",away:seconds["L"]||"?",result:{}},
      {home:firsts["L"]||"?",away:seconds["J"]||"?",result:{}},
      {home:thirds[0]||"?",away:thirds[1]||"?",result:{}},
      {home:thirds[2]||"?",away:thirds[3]||"?",result:{}},
      {home:thirds[4]||"?",away:thirds[5]||"?",result:{}},
      {home:thirds[6]||"?",away:thirds[7]||"?",result:{}},
    ];
    const ko = allData.koMatches || {};
    await save({...allData, koMatches:{...ko, r32}});
  }

  const GS=["ALL","A","B","C","D","E","F","G","H","I","J","K","L"];
  const filtered=filterG==="ALL"?GROUP_MATCHES:GROUP_MATCHES.filter(m=>m.g===filterG);

  const playerTotal=(p)=>calcPlayerTotal(
    allData.bets?.[p], allData.groupPicks?.[p], allData.finalPicks?.[p],
    allData.results, allData.koMatches
  );

  const {firsts,seconds,thirds:best8,allThirds} = getClassified(allData.results||{});

  const base={fontFamily:"'DM Sans','Helvetica Neue',Arial,sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"16px",maxWidth:480,margin:"0 auto"};
  const card={background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10};
  const topBar={display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${C.border}`};
  const backBtn={background:"none",border:"none",color:C.sub,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,padding:0};
  const inp={background:"#f7f7f5",border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontFamily:"inherit",fontSize:13,outline:"none"};
  const lbl={fontSize:10,letterSpacing:2,color:C.sub,fontWeight:700,marginBottom:10,textTransform:"uppercase"};
  const tabBar={display:"flex",gap:0,marginBottom:14,background:C.pill,borderRadius:12,padding:3};
  const savingBar={position:"fixed",top:0,left:0,right:0,background:"#1a1a1a",color:"#fff",textAlign:"center",fontSize:11,padding:5,zIndex:999,letterSpacing:1};
  const btnPrimary={background:"#1a1a1a",border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",padding:"11px 20px",fontFamily:"inherit"};

  const KO_FASES = [
    {key:"r32",label:"32 Avos",pts:PTS.r32},
    {key:"oitavas",label:"Oitavas",pts:PTS.oitavas},
    {key:"quartas",label:"Quartas",pts:PTS.quartas},
    {key:"semi",label:"Semifinal",pts:PTS.semi},
    {key:"final",label:"Final",pts:PTS.campeao},
    {key:"terceiro",label:"3º Lugar",pts:PTS.terceiro},
  ];

  if(loading) return(
    <div style={{...base,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:10}}>⚽</div>
        <div style={{fontSize:12,color:C.sub,letterSpacing:2}}>CARREGANDO...</div>
      </div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if(screen==="home") return(
    <div style={base}>
      {saving&&<div style={savingBar}>SALVANDO...</div>}
      <div style={{textAlign:"center",padding:"24px 0 20px"}}>
        <div style={{fontSize:44,marginBottom:6}}>⚽</div>
        <div style={{fontSize:10,letterSpacing:6,color:C.sub,fontWeight:700,marginBottom:3}}>BOLÃO</div>
        <div style={{fontSize:24,fontWeight:800,letterSpacing:-0.5}}>Copa do Mundo 2026</div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>EUA · Canadá · México · {players.length} participantes</div>
      </div>

      <div style={card}>
        <div style={lbl}>Entrar</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <input value={loginName} onChange={e=>setLoginName(e.target.value)}
            placeholder="Seu nome..." style={{...inp,width:"100%",boxSizing:"border-box"}}
            list="players-list"/>
          <datalist id="players-list">{players.map(p=><option key={p} value={p}/>)}</datalist>
          <input type="password" value={loginPwd} onChange={e=>setLoginPwd(e.target.value)}
            placeholder="Sua senha..." style={{...inp,width:"100%",boxSizing:"border-box"}}
            onKeyDown={e=>{if(e.key==="Enter")handleLogin();}}/>
          {loginError&&<div style={{fontSize:12,color:"#c0392b",fontWeight:600}}>{loginError}</div>}
          <button onClick={handleLogin} style={{...btnPrimary,width:"100%"}}>Entrar →</button>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={()=>setScreen("ranking")} style={{flex:1,padding:"11px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📊 Ranking</button>
        <button onClick={()=>setScreen("tabela")} style={{flex:1,padding:"11px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📋 Tabela</button>
        <button onClick={()=>setScreen("admin")} style={{flex:1,padding:"11px",borderRadius:12,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>⚙️</button>
      </div>

      <div style={card}>
        <div style={lbl}>Pontuação</div>
        <div style={{fontSize:11,fontWeight:700,color:C.sub,marginBottom:6}}>Por jogo (fase de grupos e mata-mata)</div>
        {[["Resultado certo (V/E/D)","3 pts"],["+ Gols mandante","1 pt"],["+ Gols visitante","1 pt"],["+ Placar exato","3 pts bônus"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.sub}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
          </div>
        ))}
        <div style={{fontSize:11,fontWeight:700,color:C.sub,marginTop:10,marginBottom:6}}>Classificados</div>
        {[["1º do grupo","5+2 pts"],["2º do grupo","5 pts"],["Melhor terceiro","3 pts"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.sub}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
          </div>
        ))}
        <div style={{fontSize:11,fontWeight:700,color:C.sub,marginTop:10,marginBottom:6}}>Bônus por vencedor do jogo no mata-mata</div>
        {[["32 avos","3 pts"],["Oitavas","6 pts"],["Quartas","8 pts"],["Semifinal","12 pts"],["🥇 Final","25 pts"],["🥉 3º lugar","8 pts"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,paddingBottom:4,borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.sub}}>{l}</span><span style={{fontWeight:700,color:l.includes("Final")?C.gold:"inherit"}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TABELA DE GRUPOS ──────────────────────────────────────────────────────
  if(screen==="tabela") return(
    <div style={base}>
      <div style={topBar}>
        <button onClick={()=>setScreen("home")} style={backBtn}>← Voltar</button>
        <div style={{fontWeight:700,fontSize:14}}>📋 Tabela de Grupos</div>
        <div/>
      </div>
      {best8.length>0&&(
        <div style={{...card,background:"#f0fdf4",border:"1px solid #86efac",marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,color:"#16a34a",letterSpacing:2,marginBottom:8}}>🏅 8 MELHORES TERCEIROS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {best8.map(t=>(
              <span key={t} style={{fontSize:11,fontWeight:600,background:"#fff",border:"1px solid #86efac",borderRadius:12,padding:"3px 8px"}}>
                {FLAGS[t]||""} {t}
              </span>
            ))}
          </div>
        </div>
      )}
      {Object.keys(GRUPOS).map(g=>(
        <GroupTable key={g} groupId={g} results={allData.results}/>
      ))}
    </div>
  );

  // ── APOSTAS ───────────────────────────────────────────────────────────────
  if(screen==="bets") {
    const myBets=allData.bets?.[player]||{};
    const myGP=allData.groupPicks?.[player]||{};
    const myFP=allData.finalPicks?.[player]||{};
    const myKoBets=myFP.koBets||{};

    return(
      <div style={base}>
        {saving&&<div style={savingBar}>SALVANDO...</div>}
        <div style={topBar}>
          <button onClick={()=>{setScreen("home");setPlayer(null);}} style={backBtn}>← Sair</button>
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
                padding:"5px 10px",borderRadius:18,flexShrink:0,
                border:`1.5px solid ${filterG===g?"#1a1a1a":C.border}`,
                background:filterG===g?"#1a1a1a":"#fff",
                color:filterG===g?"#fff":C.sub,
                cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,whiteSpace:"nowrap",
              }}>{g==="ALL"?"Todos":`G-${g}`}</button>
            ))}
          </div>
          {filtered.map(m=>(
            <MatchRow key={m.id} match={m}
              bet={myBets[m.id]||{}} onBet={v=>updateBet(m.id,v)}
              result={allData.results?.[m.id]}
              isAdmin={false} showPts={true}/>
          ))}
          <div style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:8,marginBottom:20}}>
            Pontuação aparece após o admin inserir os resultados
          </div>
        </>}

        {tab==="grupos"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:14,textAlign:"center",lineHeight:1.6}}>
            Escolha 1º e 2º de cada grupo<br/>
            <span style={{fontSize:11,color:C.muted}}>1º = 7 pts · 2º = 5 pts</span><br/>
            <span style={{fontSize:11,color:C.muted}}>+ escolha 8 melhores terceiros (3 pts cada)</span>
          </div>
          {Object.entries(GRUPOS).map(([g,teams])=>(
            <div key={g} style={card}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>Grupo {g}</div>
              {["first","second"].map((k,i)=>(
                <div key={k} style={{marginBottom:i===0?10:0}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1}}>
                    {i===0?"🥇 1º COLOCADO (7 pts)":"🥈 2º COLOCADO (5 pts)"}
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
          <div style={card}>
            <div style={{fontSize:10,color:C.muted,marginBottom:8,letterSpacing:1,fontWeight:700}}>
              🏅 8 MELHORES TERCEIROS (3 pts cada) — escolha 8
              <span style={{color:C.muted,fontWeight:400}}> {(myGP.thirds||[]).length}/8</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {ALL_TEAMS.map(t=>{
                const on=(myGP.thirds||[]).includes(t);
                const full=!on&&(myGP.thirds||[]).length>=8;
                return(
                  <button key={t} onClick={()=>{
                    if(full)return;
                    const curr=myGP.thirds||[];
                    updateThirdsPick(on?curr.filter(x=>x!==t):[...curr,t]);
                  }} style={{
                    padding:"4px 8px",borderRadius:14,fontSize:11,fontWeight:600,
                    border:`1.5px solid ${on?"#2d6a4f":C.border}`,
                    background:on?"#2d6a4f":"#fff",
                    color:on?"#fff":full?C.muted:C.sub,
                    cursor:full?"not-allowed":"pointer",fontFamily:"inherit",
                    display:"flex",alignItems:"center",gap:3,
                  }}>{FLAGS[t]||""} {t}</button>
                );
              })}
            </div>
          </div>
        </>}

        {tab==="knockout"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:6,textAlign:"center",lineHeight:1.5}}>
            Aposta o placar de cada jogo + bônus por acertar o vencedor
          </div>
          {KO_FASES.map(({key,label,pts})=>{
            const jogos = allData.koMatches?.[key]||[];
            if(jogos.length===0) return(
              <div key={key} style={{...card,opacity:0.5}}>
                <div style={{fontSize:11,fontWeight:700,color:C.sub,marginBottom:6}}>{label} <span style={{color:C.muted,fontWeight:400}}>(+{pts} pts por vencedor)</span></div>
                <div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"8px 0"}}>Disponível após fase anterior</div>
              </div>
            );
            return(
              <div key={key} style={card}>
                <div style={{fontSize:11,fontWeight:700,color:C.sub,marginBottom:10}}>
                  {label} <span style={{color:C.muted,fontWeight:400}}>(+{pts} pts por vencedor)</span>
                </div>
                {jogos.map((jogo,i)=>(
                  <KoMatchRow key={i} match={jogo}
                    bet={myKoBets?.[key]?.[i]||{}}
                    onBet={v=>updateKoBet(key,i,v)}
                    isAdmin={false} showPts={true} fase={label}/>
                ))}
              </div>
            );
          })}
        </>}
      </div>
    );
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
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
        style={{...btnPrimary,width:"100%"}}>Entrar</button>
        </div>
      </div>
    );

    return(
      <div style={base}>
        {saving&&<div style={savingBar}>SALVANDO...</div>}
        <div style={topBar}>
          <button onClick={()=>{setScreen("home");setIsAdmin(false);}} style={backBtn}>← Sair</button>
          <div style={{fontWeight:700,fontSize:14}}>⚙️ Admin</div>
          <div/>
        </div>

        <div style={{...tabBar,marginBottom:14}}>
          {[["jogadores","👥"],["grupos","⚽"],["tabela","📋"],["knockout","⚔️"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              flex:1,padding:"8px 2px",border:"none",borderRadius:9,
              background:tab===k?"#fff":"transparent",
              color:tab===k?C.text:C.sub,
              fontWeight:tab===k?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",
              boxShadow:tab===k?"0 1px 3px rgba(0,0,0,0.08)":"none",
            }}>{l}</button>
          ))}
        </div>

        {tab==="jogadores"&&<>
          <div style={card}>
            <div style={lbl}>Adicionar jogador</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="Nome..." style={{...inp,width:"100%",boxSizing:"border-box"}}/>
              <input value={newPwd} onChange={e=>setNewPwd(e.target.value)}
                placeholder="Senha..." style={{...inp,width:"100%",boxSizing:"border-box"}}/>
              <button onClick={()=>addPlayer(newName,newPwd)} style={btnPrimary}>+ Adicionar</button>
            </div>
          </div>
          <div style={card}>
            <div style={lbl}>Jogadores ({players.length}/30)</div>
            {players.map(p=>(
              <div key={p} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{p}</div>
                  <div style={{fontSize:11,color:C.muted}}>Senha: {allData.players?.[p]?.senha} · {playerTotal(p)} pts</div>
                </div>
                <button onClick={()=>removePlayer(p)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:"#c0392b",cursor:"pointer",fontSize:11,padding:"4px 8px",fontFamily:"inherit"}}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </>}

        {tab==="grupos"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {GS.map(g=>(
              <button key={g} onClick={()=>setFilterG(g)} style={{
                padding:"5px 10px",borderRadius:18,flexShrink:0,
                border:`1.5px solid ${filterG===g?"#1a1a1a":C.border}`,
                background:filterG===g?"#1a1a1a":"#fff",
                color:filterG===g?"#fff":C.sub,
                cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,whiteSpace:"nowrap",
              }}>{g==="ALL"?"Todos":`G-${g}`}</button>
            ))}
          </div>
          {filtered.map(m=>(
            <MatchRow key={m.id} match={m}
              bet={{}} onBet={null}
              result={allData.results?.[m.id]||{}}
              onResult={v=>updateResult(m.id,v)}
              isAdmin={true} showPts={false}/>
          ))}
        </>}

        {tab==="tabela"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:12,textAlign:"center"}}>
            Calculado automaticamente pelos resultados inseridos
          </div>
          {best8.length>0&&(
            <div style={{...card,background:"#f0fdf4",border:"1px solid #86efac"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#16a34a",letterSpacing:2,marginBottom:8}}>🏅 8 MELHORES TERCEIROS CLASSIFICADOS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {best8.map(t=>(
                  <span key={t} style={{fontSize:11,fontWeight:600,background:"#fff",border:"1px solid #86efac",borderRadius:12,padding:"3px 8px"}}>
                    {FLAGS[t]||""} {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {Object.keys(GRUPOS).map(g=>(
            <GroupTable key={g} groupId={g} results={allData.results}/>
          ))}
          <button onClick={generateR32} style={{...btnPrimary,width:"100%",marginTop:8,background:"#2d6a4f"}}>
            ⚡ Gerar chaveamento dos 32 avos automaticamente
          </button>
        </>}

        {tab==="knockout"&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:12,textAlign:"center"}}>
            Insira os resultados dos jogos do mata-mata
          </div>
          {KO_FASES.map(({key,label})=>{
            const jogos = allData.koMatches?.[key]||[];
            return(
              <div key={key} style={card}>
                <div style={{fontSize:11,fontWeight:700,color:C.sub,marginBottom:10,letterSpacing:1}}>{label.toUpperCase()}</div>
                {jogos.length===0?(
                  <div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"6px 0"}}>
                    {key==="r32"?"Gere o chaveamento na aba Tabela":"Preencha a fase anterior primeiro"}
                  </div>
                ):jogos.map((jogo,i)=>(
                  <KoMatchRow key={i} match={jogo}
                    onResult={v=>updateKoMatch(key,i,"result",v)}
                    isAdmin={true} showPts={false} fase={label}/>
                ))}
                {key!=="r32"&&key!=="final"&&key!=="terceiro"&&(
                  <button onClick={async()=>{
                    // Gerar próxima fase a partir dos vencedores da atual
                    const prevJogos = allData.koMatches?.[key]||[];
                    const vencedores = prevJogos.map(j=>{
                      if(!j.result||j.result.h==null||j.result.h==="") return null;
                      const rH=+j.result.h, rA=+j.result.a;
                      return rH>rA?j.home:rA>rH?j.away:null;
                    }).filter(Boolean);
                    const nextFaseMap={r32:"oitavas",oitavas:"quartas",quartas:"semi",semi:"final"};
                    const nextFase=nextFaseMap[key];
                    if(!nextFase||vencedores.length<2) return;
                    const nextJogos=[];
                    for(let i=0;i<vencedores.length;i+=2){
                      nextJogos.push({home:vencedores[i]||"?",away:vencedores[i+1]||"?",result:{}});
                    }
                    const ko=allData.koMatches||{};
                    await save({...allData,koMatches:{...ko,[nextFase]:nextJogos}});
                  }} style={{...btnPrimary,background:"#2d6a4f",width:"100%",marginTop:8,fontSize:12,padding:"8px"}}>
                    ⚡ Gerar próxima fase automaticamente
                  </button>
                )}
              </div>
            );
          })}
        </>}
      </div>
    );
  }

  // ── RANKING ───────────────────────────────────────────────────────────────
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
          {rows.length===0&&<div style={{padding:20,textAlign:"center",color:C.muted,fontSize:13}}>Nenhuma pontuação ainda</div>}
          {rows.map((r,i)=>(
            <div key={r.name} style={{
              display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
              borderBottom:i<rows.length-1?`1px solid ${C.border}`:"none",
              background:i===0?"#fafaf7":"#fff",
            }}>
              <div style={{fontSize:i<3?18:12,minWidth:26,textAlign:"center"}}>{i<3?medals[i]:`${i+1}º`}</div>
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
