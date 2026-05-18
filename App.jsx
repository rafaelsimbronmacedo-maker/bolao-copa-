import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// ─── FIREBASE ─────────────────────────────────────────────────────────────────
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

// ─── PONTUAÇÃO ────────────────────────────────────────────────────────────────
const PTS = {
  resultado: 3, golsMandante: 1, golsVisitante: 1, placarExato: 3,
  classificado: 5, liderGrupo: 2,
  oitavas: 6, quartas: 8, semi: 12,
  campeao: 25, vice: 12, terceiro: 8,
};

const GRUPOS = {
  A:["Catar","Equador","Senegal","Países Baixos"],
  B:["Inglaterra","Irã","EUA","País de Gales"],
  C:["Argentina","Arábia Saudita","México","Polônia"],
  D:["França","Austrália","Dinamarca","Tunísia"],
  E:["Espanha","Costa Rica","Alemanha","Japão"],
  F:["Bélgica","Canadá","Marrocos","Croácia"],
  G:["Brasil","Sérvia","Suíça","Camarões"],
  H:["Portugal","Gana","Uruguai","Coreia do Sul"],
};
const ALL_TEAMS = Object.values(GRUPOS).flat();

const FLAGS = {
  "Brasil":"🇧🇷","Argentina":"🇦🇷","França":"🇫🇷","Alemanha":"🇩🇪",
  "Espanha":"🇪🇸","Portugal":"🇵🇹","Inglaterra":"🇬🇧","Países Baixos":"🇳🇱",
  "Bélgica":"🇧🇪","Croácia":"🇭🇷","Uruguai":"🇺🇾","México":"🇲🇽",
  "Senegal":"🇸🇳","Marrocos":"🇲🇦","Japão":"🇯🇵","Coreia do Sul":"🇰🇷",
  "Catar":"🇶🇦","Equador":"🇪🇨","EUA":"🇺🇸","Irã":"🇮🇷",
  "País de Gales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Polônia":"🇵🇱","Arábia Saudita":"🇸🇦",
  "Austrália":"🇦🇺","Dinamarca":"🇩🇰","Tunísia":"🇹🇳","Costa Rica":"🇨🇷",
  "Canadá":"🇨🇦","Gana":"🇬🇭","Sérvia":"🇷🇸","Suíça":"🇨🇭","Camarões":"🇨🇲",
};

const GROUP_MATCHES = [
  {id:1,g:"A",h:"Catar",a:"Equador",d:"20/11"},{id:2,g:"A",h:"Senegal",a:"Países Baixos",d:"21/11"},
  {id:3,g:"B",h:"Inglaterra",a:"Irã",d:"21/11"},{id:4,g:"B",h:"EUA",a:"País de Gales",d:"21/11"},
  {id:5,g:"C",h:"Argentina",a:"Arábia Saudita",d:"22/11"},{id:6,g:"C",h:"México",a:"Polônia",d:"22/11"},
  {id:7,g:"D",h:"França",a:"Austrália",d:"22/11"},{id:8,g:"D",h:"Dinamarca",a:"Tunísia",d:"22/11"},
  {id:9,g:"E",h:"Espanha",a:"Costa Rica",d:"23/11"},{id:10,g:"E",h:"Alemanha",a:"Japão",d:"23/11"},
  {id:11,g:"F",h:"Marrocos",a:"Croácia",d:"23/11"},{id:12,g:"F",h:"Bélgica",a:"Canadá",d:"23/11"},
  {id:13,g:"G",h:"Brasil",a:"Sérvia",d:"24/11"},{id:14,g:"G",h:"Suíça",a:"Camarões",d:"24/11"},
  {id:15,g:"H",h:"Portugal",a:"Gana",d:"24/11"},{id:16,g:"H",h:"Uruguai",a:"Coreia do Sul",d:"24/11"},
  {id:17,g:"A",h:"Catar",a:"Senegal",d:"25/11"},{id:18,g:"A",h:"Países Baixos",a:"Equador",d:"25/11"},
  {id:19,g:"B",h:"País de Gales",a:"Irã",d:"25/11"},{id:20,g:"B",h:"Inglaterra",a:"EUA",d:"25/11"},
  {id:21,g:"C",h:"Polônia",a:"Arábia Saudita",d:"26/11"},{id:22,g:"C",h:"Argentina",a:"México",d:"26/11"},
  {id:23,g:"D",h:"Tunísia",a:"Austrália",d:"26/11"},{id:24,g:"D",h:"França",a:"Dinamarca",d:"26/11"},
  {id:25,g:"E",h:"Japão",a:"Costa Rica",d:"27/11"},{id:26,g:"E",h:"Espanha",a:"Alemanha",d:"27/11"},
  {id:27,g:"F",h:"Croácia",a:"Canadá",d:"27/11"},{id:28,g:"F",h:"Bélgica",a:"Marrocos",d:"27/11"},
  {id:29,g:"G",h:"Camarões",a:"Sérvia",d:"28/11"},{id:30,g:"G",h:"Brasil",a:"Suíça",d:"28/11"},
  {id:31,g:"H",h:"Coreia do Sul",a:"Gana",d:"28/11"},{id:32,g:"H",h:"Portugal",a:"Uruguai",d:"28/11"},
  {id:33,g:"A",h:"Equador",a:"Senegal",d:"29/11"},{id:34,g:"A",h:"Países Baixos",a:"Catar",d:"29/11"},
  {id:35,g:"B",h:"País de Gales",a:"Inglaterra",d:"29/11"},{id:36,g:"B",h:"Irã",a:"EUA",d:"29/11"},
  {id:37,g:"C",h:"Polônia",a:"Argentina",d:"30/11"},{id:38,g:"C",h:"Arábia Saudita",a:"México",d:"30/11"},
  {id:39,g:"D",h:"Austrália",a:"Dinamarca",d:"30/11"},{id:40,g:"D",h:"Tunísia",a:"França",d:"30/11"},
  {id:41,g:"E",h:"Japão",a:"Espanha",d:"01/12"},{id:42,g:"E",h:"Costa Rica",a:"Alemanha",d:"01/12"},
  {id:43,g:"F",h:"Croácia",a:"Bélgica",d:"01/12"},{id:44,g:"F",h:"Canadá",a:"Marrocos",d:"01/12"},
  {id:45,g:"G",h:"Camarões",a:"Brasil",d:"02/12"},{id:46,g:"G",h:"Sérvia",a:"Suíça",d:"02/12"},
  {id:47,g:"H",h:"Coreia do Sul",a:"Portugal",d:"02/12"},{id:48,g:"H",h:"Gana",a:"Uruguai",d:"02/12"},
];

const ADMIN_PASS = "copa2026";

function calcMatchPts(bet, result) {
  if (!result || result.h == null || result.h === "") return null;
  if (!bet || bet.h == null || bet.h === "") return 0;
  const rH=+result.h, rA=+result.a, bH=+bet.h, bA=+bet.a;
  const res = (h,a) => h>a?"H":a>h?"A":"D";
  let pts = 0;
  if (res(bH,bA)===res(rH,rA)) pts += PTS.resultado;
  if (bH===rH) pts += PTS.golsMandante;
  if (bA===rA) pts += PTS.golsVisitante;
  if (bH===rH && bA===rA) pts += PTS.placarExato;
  return pts;
}

function calcTotal(playerBets, playerGroupPicks, playerFinalPicks, results, groupResults, finalResults) {
  let pts = 0;
  GROUP_MATCHES.forEach(m => {
    const p = calcMatchPts(playerBets?.[m.id], results?.[m.id]);
    if (p) pts += p;
  });
  Object.keys(GRUPOS).forEach(g => {
    const gr = groupResults?.[g];
    if (!gr) return;
    const classified = [gr.first, gr.second].filter(Boolean);
    ["first","second"].forEach(k => {
      const pick = playerGroupPicks?.[g]?.[k];
      if (pick && classified.includes(pick)) {
        pts += PTS.classificado;
        if (pick === gr.first) pts += PTS.liderGrupo;
      }
    });
  });
  const fr = finalResults || {};
  (playerFinalPicks?.oitavas||[]).forEach(t => { if((fr.oitavas||[]).includes(t)) pts+=PTS.oitavas; });
  (playerFinalPicks?.quartas||[]).forEach(t => { if((fr.quartas||[]).includes(t)) pts+=PTS.quartas; });
  (playerFinalPicks?.semi||[]).forEach(t => { if((fr.semi||[]).includes(t)) pts+=PTS.semi; });
  if (playerFinalPicks?.campeao && playerFinalPicks.campeao===fr.campeao) pts+=PTS.campeao;
  if (playerFinalPicks?.vice && playerFinalPicks.vice===fr.vice) pts+=PTS.vice;
  if (playerFinalPicks?.terceiro && playerFinalPicks.terceiro===fr.terceiro) pts+=PTS.terceiro;
  return pts;
}

function Num({ value, onChange, disabled, sm }) {
  return (
    <input type="number" min="0" max="30" value={value??""} disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      style={{
        width:sm?36:44, textAlign:"center", fontSize:sm?14:18, fontWeight:800,
        background:disabled?"#0d120d":"#152015",
        border:`2px solid ${disabled?"#1e2e1e":"#4caf50"}`,
        borderRadius:7, color:disabled?"#333":"#c8e6c9",
        padding:"3px 0", outline:"none", fontFamily:"inherit",
        cursor:disabled?"not-allowed":"text",
      }} />
  );
}

function MatchRow({match, bet, onBet, result, onResult, isAdmin, showPts}) {
  const pts = showPts ? calcMatchPts(bet, result) : null;
  const exact = pts === 8;
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:7,
      background:exact?"#162e06":pts>0?"#0f1e0f":"#090e09",
      border:`1px solid ${exact?"#7fff0055":pts>0?"#2a4a2a":"#121e12"}`,
      borderRadius:10, padding:"9px 10px", marginBottom:5,
    }}>
      <div style={{fontSize:10,color:"#2a5a2a",textAlign:"center",minWidth:38,lineHeight:1.5}}>
        <div style={{color:"#4caf50",fontWeight:800}}>G-{match.g}</div>
        <div>{match.d}</div>
      </div>
      <div style={{flex:1,textAlign:"right"}}>
        <div style={{fontSize:16}}>{FLAGS[match.h]||"🏳️"}</div>
        <div style={{fontSize:10,color:"#7a9a7a",lineHeight:1}}>{match.h}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <Num value={bet?.h} onChange={v=>onBet?.({...bet,h:v})} disabled={isAdmin||!onBet} />
        <span style={{color:"#4caf50",fontWeight:900,fontSize:13}}>×</span>
        <Num value={bet?.a} onChange={v=>onBet?.({...bet,a:v})} disabled={isAdmin||!onBet} />
      </div>
      <div style={{flex:1,textAlign:"left"}}>
        <div style={{fontSize:16}}>{FLAGS[match.a]||"🏳️"}</div>
        <div style={{fontSize:10,color:"#7a9a7a",lineHeight:1}}>{match.a}</div>
      </div>
      {isAdmin && (
        <div style={{display:"flex",alignItems:"center",gap:4,borderLeft:"1px solid #1a2a1a",paddingLeft:8}}>
          <Num value={result?.h} onChange={v=>onResult?.({...result,h:v})} sm />
          <span style={{color:"#2a4a2a",fontSize:11}}>×</span>
          <Num value={result?.a} onChange={v=>onResult?.({...result,a:v})} sm />
        </div>
      )}
      {showPts && (
        <div style={{minWidth:30,textAlign:"center",fontWeight:900,fontSize:13,
          color:exact?"#7fff00":pts>0?"#4caf50":"#1e3a1e"}}>
          {pts===null?"–":pts>0?`+${pts}`:"0"}
        </div>
      )}
    </div>
  );
}

function Picker({label, teams, value, onChange, multi, max, color="#4caf50"}) {
  const sel = multi ? (value||[]) : value;
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:10,color,fontWeight:800,letterSpacing:2,marginBottom:7}}>
        {label}{multi&&max&&<span style={{color:"#2a4a2a"}}> ({sel.length}/{max})</span>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {teams.map(t => {
          const on = multi ? sel.includes(t) : sel===t;
          const full = multi && !on && sel.length>=(max||999);
          return (
            <button key={t} onClick={() => {
              if (full) return;
              if (multi) onChange(on ? sel.filter(x=>x!==t) : [...sel,t]);
              else onChange(on?"":t);
            }} style={{
              padding:"4px 9px", borderRadius:16, fontSize:11, fontWeight:600,
              border:`1.5px solid ${on?color:"#1a2a1a"}`,
              background:on?color+"22":"#090e09",
              color:on?color:full?"#1a2a1a":"#4a7a4a",
              cursor:full?"not-allowed":"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", gap:4,
            }}>{FLAGS[t]} {t}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [filterG, setFilterG] = useState("ALL");
  const [tab, setTab] = useState("jogos");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({
    players:[], results:{}, groupResults:{}, finalResults:{},
    bets:{}, groupPicks:{}, finalPicks:{},
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "bolao", "data"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setAllData(d);
        setPlayers(d.players || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function save(newData) {
    setSaving(true);
    try { await setDoc(doc(db, "bolao", "data"), newData, { merge: true }); }
    catch(e) { console.error(e); }
    setSaving(false);
  }

  async function addPlayer(name) {
    if (!name.trim() || players.length >= 30 || players.includes(name.trim())) return;
    const newPlayers = [...players, name.trim()];
    setPlayers(newPlayers);
    await save({ ...allData, players: newPlayers });
    setNewName("");
  }

  async function updateBet(matchId, val) {
    const newBets = { ...allData.bets, [player]: { ...(allData.bets?.[player]||{}), [matchId]: val } };
    await save({ ...allData, bets: newBets });
  }

  async function updateResult(matchId, val) {
    await save({ ...allData, results: { ...(allData.results||{}), [matchId]: val } });
  }

  async function updateGroupPick(g, k, val) {
    const newGP = { ...allData.groupPicks, [player]: {
      ...(allData.groupPicks?.[player]||{}),
      [g]: { ...(allData.groupPicks?.[player]?.[g]||{}), [k]: val }
    }};
    await save({ ...allData, groupPicks: newGP });
  }

  async function updateFinalPick(k, val) {
    const newFP = { ...allData.finalPicks, [player]: { ...(allData.finalPicks?.[player]||{}), [k]: val } };
    await save({ ...allData, finalPicks: newFP });
  }

  async function updateGroupResult(g, k, val) {
    const newGR = { ...(allData.groupResults||{}), [g]: { ...(allData.groupResults?.[g]||{}), [k]: val } };
    await save({ ...allData, groupResults: newGR });
  }

  async function updateFinalResult(k, val) {
    await save({ ...allData, finalResults: { ...(allData.finalResults||{}), [k]: val } });
  }

  const GS = ["ALL","A","B","C","D","E","F","G","H"];
  const filtered = filterG==="ALL" ? GROUP_MATCHES : GROUP_MATCHES.filter(m=>m.g===filterG);
  const playerTotal = (p) => calcTotal(
    allData.bets?.[p], allData.groupPicks?.[p], allData.finalPicks?.[p],
    allData.results, allData.groupResults, allData.finalResults
  );
  const S = st;

  if (loading) return (
    <div style={{...S.root,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚽</div>
        <div style={{color:"#4caf50",fontSize:14,fontWeight:700}}>Carregando...</div>
      </div>
    </div>
  );

  if (screen==="home") return (
    <div style={S.root}>
      {saving && <div style={S.savingBar}>Salvando...</div>}
      <div style={{textAlign:"center",padding:"30px 0 22px"}}>
        <div style={{fontSize:56,filter:"drop-shadow(0 0 28px #4caf5066)",marginBottom:6}}>⚽</div>
        <div style={{fontSize:40,fontWeight:900,letterSpacing:6,color:"#fff",lineHeight:1}}>BOLÃO</div>
        <div style={{fontSize:14,fontWeight:700,letterSpacing:8,color:"#4caf50",marginTop:2,marginBottom:8}}>COPA DO MUNDO</div>
        <div style={{fontSize:11,color:"#2a4a2a"}}>{players.length}/30 participantes</div>
      </div>
      <div style={S.card}>
        <div style={S.lbl}>ENTRAR COMO JOGADOR</div>
        {players.length===0 && <div style={{fontSize:12,color:"#2a4a2a",marginBottom:12}}>Nenhum jogador ainda. Adicione abaixo!</div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
          {players.map(p => (
            <button key={p} onClick={()=>{setPlayer(p);setScreen("bets");setTab("jogos");}} style={S.pBtn}>{p}</button>
          ))}
        </div>
        <div style={{borderTop:"1px solid #0f1f0f",paddingTop:12}}>
          <div style={{fontSize:11,color:"#2a4a2a",marginBottom:7}}>Adicionar jogador</div>
          <div style={{display:"flex",gap:7}}>
            <input value={newName} onChange={e=>setNewName(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")addPlayer(newName);}}
              placeholder="Nome..." style={{...S.inp,flex:1}} />
            <button onClick={()=>addPlayer(newName)} style={{...S.btnG,padding:"8px 16px"}}>+</button>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={()=>setScreen("ranking")} style={{...S.btnO,flex:1}}>📊 Ranking</button>
        <button onClick={()=>setScreen("admin")} style={{...S.btnO,flex:1}}>⚙️ Admin</button>
      </div>
      <div style={S.card}>
        <div style={S.lbl}>PONTUAÇÃO</div>
        <div style={{fontSize:11,color:"#4caf50",fontWeight:700,marginBottom:6}}>Por jogo (máx 8 pts)</div>
        {[["Resultado certo","3 pts"],["+ Gols mandante","1 pt"],["+ Gols visitante","1 pt"],["+ Placar exato","3 pts bônus"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
            <span style={{color:"#3a5a3a"}}>{l}</span><span style={{color:"#a5d6a7",fontWeight:700}}>{v}</span>
          </div>
        ))}
        <div style={{borderTop:"1px solid #0f1f0f",margin:"10px 0"}}/>
        <div style={{fontSize:11,color:"#4caf50",fontWeight:700,marginBottom:6}}>Grupos / Mata-mata</div>
        {[["Classificado grupo","5 pts"],["Bônus líder","+2 pts"],["Oitavas","6 pts"],["Quartas","8 pts"],["Semi","12 pts"],["🥇 Campeão","25 pts"],["🥈 Vice","12 pts"],["🥉 3º","8 pts"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
            <span style={{color:"#3a5a3a"}}>{l}</span><span style={{color:l.includes("Campeão")?"#ffd700":"#a5d6a7",fontWeight:700}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen==="bets") {
    const myBets=allData.bets?.[player]||{}, myGP=allData.groupPicks?.[player]||{}, myFP=allData.finalPicks?.[player]||{};
    return (
      <div style={S.root}>
        {saving && <div style={S.savingBar}>Salvando...</div>}
        <div style={S.bar}>
          <button onClick={()=>setScreen("home")} style={S.back}>← Sair</button>
          <div style={{fontWeight:800,color:"#4caf50",fontSize:15}}>⚽ {player}</div>
          <div style={{fontSize:14,color:"#7fff00",fontWeight:900}}>{playerTotal(player)} pts</div>
        </div>
        <div style={{display:"flex",gap:0,marginBottom:14,border:"1px solid #1a2a1a",borderRadius:10,overflow:"hidden"}}>
          {[["jogos","🎯 Jogos"],["grupos","🏅 Grupos"],["knockout","⚔️ Mata-mata"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 3px",border:"none",background:tab===k?"#1a3a1a":"#090e09",color:tab===k?"#7fff00":"#2a4a2a",fontWeight:tab===k?800:500,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
        {tab==="jogos"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {GS.map(g=>(<button key={g} onClick={()=>setFilterG(g)} style={{...S.chip,flexShrink:0,background:filterG===g?"#4caf50":"#090e09",color:filterG===g?"#000":"#2a4a2a",borderColor:filterG===g?"#4caf50":"#1a2a1a"}}>{g==="ALL"?"Todos":`G-${g}`}</button>))}
          </div>
          {filtered.map(m=>(<MatchRow key={m.id} match={m} bet={myBets[m.id]||{}} onBet={v=>updateBet(m.id,v)} result={allData.results?.[m.id]} onResult={null} isAdmin={false} showPts={true}/>))}
          <div style={{fontSize:11,color:"#1a3a1a",textAlign:"center",marginTop:10,marginBottom:20}}>Pontuação aparece quando o admin inserir os resultados</div>
        </>}
        {tab==="grupos"&&<>
          <div style={{fontSize:11,color:"#2a4a2a",marginBottom:14,textAlign:"center"}}>Escolha 1º e 2º de cada grupo · 5 pts + 2 bônus se acertar o líder</div>
          {Object.entries(GRUPOS).map(([g,teams])=>(
            <div key={g} style={{...S.card,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:800,color:"#4caf50",marginBottom:10}}>Grupo {g}</div>
              {["first","second"].map((k,i)=>(
                <div key={k} style={{marginBottom:i===0?12:0}}>
                  <div style={{fontSize:10,color:"#2a4a2a",marginBottom:6}}>{i===0?"🥇 1º colocado":"🥈 2º colocado"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {teams.filter(t=>k==="second"?t!==myGP[g]?.first:true).map(t=>{
                      const on=myGP[g]?.[k]===t;
                      return(<button key={t} onClick={()=>updateGroupPick(g,k,on?"":t)} style={{padding:"4px 9px",borderRadius:16,fontSize:11,fontWeight:600,border:`1.5px solid ${on?(i===0?"#ffd700":"#4caf50"):"#1a2a1a"}`,background:on?(i===0?"#ffd70022":"#4caf5022"):"#090e09",color:on?(i===0?"#ffd700":"#4caf50"):"#4a6a4a",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>{FLAGS[t]} {t}</button>);
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>}
        {tab==="knockout"&&<>
          <div style={{fontSize:11,color:"#2a4a2a",marginBottom:14,textAlign:"center"}}>Palpites do mata-mata · pode atualizar a cada fase</div>
          <div style={S.card}><Picker label={`OITAVAS (${PTS.oitavas} pts cada)`} teams={ALL_TEAMS} value={myFP.oitavas||[]} onChange={v=>updateFinalPick("oitavas",v)} multi max={16}/></div>
          <div style={S.card}><Picker label={`QUARTAS (${PTS.quartas} pts cada)`} teams={ALL_TEAMS} value={myFP.quartas||[]} onChange={v=>updateFinalPick("quartas",v)} multi max={8} color="#81c784"/></div>
          <div style={S.card}><Picker label={`SEMI (${PTS.semi} pts cada)`} teams={ALL_TEAMS} value={myFP.semi||[]} onChange={v=>updateFinalPick("semi",v)} multi max={4} color="#a5d6a7"/></div>
          <div style={S.card}>
            <Picker label={`🥇 CAMPEÃO (${PTS.campeao} pts)`} teams={ALL_TEAMS} value={myFP.campeao||""} onChange={v=>updateFinalPick("campeao",v)} color="#ffd700"/>
            <Picker label={`🥈 VICE (${PTS.vice} pts)`} teams={ALL_TEAMS} value={myFP.vice||""} onChange={v=>updateFinalPick("vice",v)} color="#c0c0c0"/>
            <Picker label={`🥉 3º LUGAR (${PTS.terceiro} pts)`} teams={ALL_TEAMS} value={myFP.terceiro||""} onChange={v=>updateFinalPick("terceiro",v)} color="#cd7f32"/>
          </div>
        </>}
      </div>
    );
  }

  if (screen==="admin") {
    if (!isAdmin) return (
      <div style={S.root}>
        <div style={S.bar}><button onClick={()=>setScreen("home")} style={S.back}>← Voltar</button><div style={{fontWeight:700,color:"#4caf50"}}>⚙️ Admin</div><div/></div>
        <div style={{...S.card,textAlign:"center",marginTop:50}}>
          <div style={{fontSize:40,marginBottom:16}}>🔐</div>
          <input type="password" value={adminPwd} onChange={e=>setAdminPwd(e.target.value)} placeholder="Senha de administrador" style={{...S.inp,width:"100%",marginBottom:12,textAlign:"center"}} onKeyDown={e=>{if(e.key==="Enter"&&adminPwd===ADMIN_PASS)setIsAdmin(true);}}/>
          <button onClick={()=>{if(adminPwd===ADMIN_PASS)setIsAdmin(true);}} style={{...S.btnG,width:"100%"}}>Entrar</button>
          <div style={{fontSize:11,color:"#1a3a1a",marginTop:10}}>Senha: copa2026</div>
        </div>
      </div>
    );
    return (
      <div style={S.root}>
        {saving && <div style={S.savingBar}>Salvando...</div>}
        <div style={S.bar}><button onClick={()=>{setScreen("home");setIsAdmin(false);}} style={S.back}>← Sair</button><div style={{fontWeight:800,color:"#4caf50"}}>⚙️ Resultados</div><div/></div>
        <div style={{display:"flex",gap:0,marginBottom:12,border:"1px solid #1a2a1a",borderRadius:10,overflow:"hidden"}}>
          {[["jogos","Jogos"],["grupos","Classificados"],["knockout","Mata-mata"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 3px",border:"none",background:tab===k?"#1a3a1a":"#090e09",color:tab===k?"#7fff00":"#2a4a2a",fontWeight:tab===k?800:500,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
        {tab==="jogos"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {GS.map(g=>(<button key={g} onClick={()=>setFilterG(g)} style={{...S.chip,flexShrink:0,background:filterG===g?"#4caf50":"#090e09",color:filterG===g?"#000":"#2a4a2a",borderColor:filterG===g?"#4caf50":"#1a2a1a"}}>{g==="ALL"?"Todos":`G-${g}`}</button>))}
          </div>
          {filtered.map(m=>(<MatchRow key={m.id} match={m} bet={{}} onBet={null} result={allData.results?.[m.id]||{}} onResult={v=>updateResult(m.id,v)} isAdmin={true} showPts={false}/>))}
        </>}
        {tab==="grupos"&&<>
          <div style={{fontSize:11,color:"#2a4a2a",marginBottom:14,textAlign:"center"}}>Defina os classificados reais para calcular bônus</div>
          {Object.entries(GRUPOS).map(([g,teams])=>(
            <div key={g} style={{...S.card,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:800,color:"#4caf50",marginBottom:10}}>Grupo {g}</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {["first","second"].map((k,i)=>(
                  <div key={k}>
                    <div style={{fontSize:10,color:"#2a4a2a",marginBottom:5}}>{i===0?"🥇 1º":"🥈 2º"}</div>
                    <select value={allData.groupResults?.[g]?.[k]||""} onChange={e=>updateGroupResult(g,k,e.target.value)} style={{...S.inp,padding:"5px 8px",fontSize:12}}>
                      <option value="">— selecionar —</option>
                      {teams.map(t=><option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}
        {tab==="knockout"&&<>
          <div style={S.card}><Picker label="OITAVAS → 16 classificados" teams={ALL_TEAMS} value={allData.finalResults?.oitavas||[]} onChange={v=>updateFinalResult("oitavas",v)} multi max={16}/></div>
          <div style={S.card}><Picker label="QUARTAS → 8 classificados" teams={ALL_TEAMS} value={allData.finalResults?.quartas||[]} onChange={v=>updateFinalResult("quartas",v)} multi max={8} color="#81c784"/></div>
          <div style={S.card}><Picker label="SEMI → 4 semifinalistas" teams={ALL_TEAMS} value={allData.finalResults?.semi||[]} onChange={v=>updateFinalResult("semi",v)} multi max={4} color="#a5d6a7"/></div>
          <div style={S.card}>
            <Picker label="🥇 Campeão" teams={ALL_TEAMS} value={allData.finalResults?.campeao||""} onChange={v=>updateFinalResult("campeao",v)} color="#ffd700"/>
            <Picker label="🥈 Vice" teams={ALL_TEAMS} value={allData.finalResults?.vice||""} onChange={v=>updateFinalResult("vice",v)} color="#c0c0c0"/>
            <Picker label="🥉 3º lugar" teams={ALL_TEAMS} value={allData.finalResults?.terceiro||""} onChange={v=>updateFinalResult("terceiro",v)} color="#cd7f32"/>
          </div>
        </>}
      </div>
    );
  }

  if (screen==="ranking") {
    const rows = players.map(p=>({name:p,pts:playerTotal(p)})).sort((a,b)=>b.pts-a.pts||a.name.localeCompare(b.name));
    const M=["🥇","🥈","🥉"];
    return (
      <div style={S.root}>
        <div style={S.bar}><button onClick={()=>setScreen("home")} style={S.back}>← Voltar</button><div style={{fontWeight:800,color:"#4caf50"}}>📊 Ranking</div><div/></div>
        <div style={{background:"#090e09",border:"1px solid #1a2a1a",borderRadius:12,overflow:"hidden",marginBottom:12}}>
          <div style={{background:"#152015",padding:"9px 14px",fontSize:11,fontWeight:800,color:"#4caf50",letterSpacing:2}}>🏆 CLASSIFICAÇÃO GERAL</div>
          {rows.length===0&&<div style={{padding:20,textAlign:"center",color:"#1a3a1a",fontSize:13}}>Nenhuma pontuação ainda</div>}
          {rows.map((r,i)=>(
            <div key={r.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<rows.length-1?"1px solid #0d150d":"none",background:i===0?"#152e05":i===1?"#101810":"transparent"}}>
              <div style={{fontSize:i<3?18:13,minWidth:26,textAlign:"center"}}>{i<3?M[i]:`${i+1}º`}</div>
              <div style={{flex:1,fontWeight:i<3?700:400,fontSize:14}}>{r.name}</div>
              <div style={{fontFamily:"monospace",fontWeight:900,fontSize:i<3?18:14,color:i===0?"#7fff00":i===1?"#c8e6c9":i===2?"#81c784":"#2a4a2a"}}>{r.pts} pts</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.lbl}>CRITÉRIO DE DESEMPATE</div>
          {["1. Mais placares exatos","2. Mais acertos de classificados","3. Mais pontos no mata-mata","4. Palpite do campeão","5. Sorteio"].map(l=>(<div key={l} style={{fontSize:12,color:"#2a4a2a",marginBottom:5}}>{l}</div>))}
        </div>
      </div>
    );
  }

  return null;
}

const st = {
  root:{minHeight:"100vh",background:"#060d06",color:"#c8e6c9",fontFamily:"'Oswald','Impact','Arial Narrow',sans-serif",padding:"14px",maxWidth:480,margin:"0 auto"},
  card:{background:"#090e09",border:"1px solid #1a2a1a",borderRadius:12,padding:14,marginBottom:12},
  lbl:{fontSize:10,color:"#4caf50",fontWeight:800,letterSpacing:2,marginBottom:12},
  bar:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:12,borderBottom:"1px solid #0d150d"},
  back:{background:"none",border:"none",color:"#4caf50",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700},
  inp:{background:"#090e09",border:"1.5px solid #1a2a1a",borderRadius:8,color:"#c8e6c9",padding:"7px 10px",fontFamily:"inherit",fontSize:13,outline:"none"},
  pBtn:{padding:"7px 14px",borderRadius:18,border:"1.5px solid #1a2a1a",background:"#090e09",color:"#4a7a4a",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600},
  btnG:{background:"#1e4a1e",border:"none",borderRadius:9,color:"#7fff00",fontWeight:800,fontSize:14,cursor:"pointer",padding:"10px 20px",fontFamily:"inherit",letterSpacing:1},
  btnO:{background:"#090e09",border:"1.5px solid #1a2a1a",borderRadius:9,color:"#4caf50",fontWeight:700,fontSize:13,cursor:"pointer",padding:"10px",fontFamily:"inherit"},
  chip:{padding:"5px 10px",borderRadius:18,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700},
  savingBar:{position:"fixed",top:0,left:0,right:0,background:"#4caf50",color:"#000",textAlign:"center",fontSize:11,fontWeight:800,padding:4,zIndex:999},
};
