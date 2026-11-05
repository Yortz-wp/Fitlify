const KEY = "fitlify-v01";
const defaults = { goals:{calories:1800,protein:130,carbs:180,fat:60}, entries:[], water:0, weights:[], streak:0, lastOpen:"" };
let state = loadState();

function loadState(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function entriesToday(){return state.entries.filter(e=>e.date===todayKey())}
function sum(key){return entriesToday().reduce((n,e)=>n+(Number(e[key])||0),0)}
function fmt(n){return Math.round(n).toLocaleString("en-US")}
function pct(n,g){return Math.min(100,g>0?n/g*100:0)}
function setBar(id,n,g){document.getElementById(id).style.width=pct(n,g)+"%"}
function render(){
 const e=entriesToday(), c=sum("calories"),p=sum("protein"),cb=sum("carbs"),f=sum("fat"),g=state.goals;
 document.getElementById("todayLabel").textContent=new Intl.DateTimeFormat("en-PH",{weekday:"long",month:"short",day:"numeric"}).format(new Date()).toUpperCase();
 document.getElementById("caloriesConsumed").textContent=fmt(c);document.getElementById("calorieGoal").textContent=fmt(g.calories)+" kcal";
 document.getElementById("caloriesRemaining").textContent=fmt(Math.max(0,g.calories-c))+" kcal";
 document.getElementById("calorieRing").style.background=`conic-gradient(var(--cyan) 0deg,var(--yellow) ${pct(c,g.calories)*3.6}deg,#263746 ${pct(c,g.calories)*3.6}deg)`;
 setBar("calorieBar",c,g.calories);
 [["proteinValue",p,"proteinGoal",g.protein,"proteinBar"],["carbsValue",cb,"carbsGoal",g.carbs,"carbsBar"],["fatValue",f,"fatGoal",g.fat,"fatBar"]].forEach(([v,n,gl,goal,b])=>{document.getElementById(v).innerHTML=`${fmt(n)}<span> g</span>`;document.getElementById(gl).textContent=`of ${fmt(goal)} g`;setBar(b,n,goal)});
 const groups=["Breakfast","Lunch","Dinner","Snack"];
 document.getElementById("mealGroups").innerHTML=groups.map(m=>{const list=e.filter(x=>x.meal===m);const total=list.reduce((a,x)=>a+x.calories,0);return `<div class="meal-group"><div class="meal-head"><b>${m}</b><span>${fmt(total)} kcal</span></div>${list.length?list.map(x=>`<div class="meal-entry"><div class="food-symbol">✦</div><div class="food-details"><b>${escapeHtml(x.name)}</b><small>P ${fmt(x.protein)}g · C ${fmt(x.carbs)}g · F ${fmt(x.fat)}g</small></div><span class="food-kcal">${fmt(x.calories)} kcal</span><button class="delete-food" data-delete="${x.id}" aria-label="Delete ${escapeHtml(x.name)}">×</button></div>`).join(""):`<div class="empty">No food logged yet</div>`}</div>`}).join("");
 document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{state.entries=state.entries.filter(x=>x.id!==b.dataset.delete);save()}));
 document.getElementById("waterCount").textContent=`${state.water} / 8 glasses`;
 document.getElementById("waterGlasses").innerHTML=Array.from({length:8},(_,i)=>`<button class="glass ${i<state.water?"filled":""}" data-water="${i}" aria-label="Set water to ${i+1} glasses">${i<state.water?"●":"○"}</button>`).join("");
 document.querySelectorAll("[data-water]").forEach(b=>b.addEventListener("click",()=>{state.water=Number(b.dataset.water)+1;save()}));
 document.getElementById("streakValue").textContent=state.streak||0;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function open(id){document.getElementById(id).showModal()}
function info(title,text){document.getElementById("infoTitle").textContent=title;document.getElementById("infoText").textContent=text;open("infoDialog")}
function resetForm(id){document.getElementById(id).reset()}
function addFood(){
 const name=document.getElementById("foodName").value.trim(),cal=Number(document.getElementById("foodCalories").value);
 if(!name||!Number.isFinite(cal)||cal<0)return;
 state.entries.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:todayKey(),name,meal:document.getElementById("foodMeal").value,calories:cal,protein:Number(document.getElementById("foodProtein").value)||0,carbs:Number(document.getElementById("foodCarbs").value)||0,fat:Number(document.getElementById("foodFat").value)||0});
 save();
}
document.getElementById("addFoodTop").onclick=()=>{resetForm("foodForm");open("foodDialog")};
document.getElementById("quickAdd").onclick=()=>{resetForm("foodForm");open("foodDialog")};
document.getElementById("foodForm").addEventListener("submit",e=>{if(e.submitter?.id==="saveFood"){e.preventDefault();addFood();document.getElementById("foodDialog").close()}});
document.getElementById("editGoals").onclick=()=>{for(const [id,key] of [["goalCalories","calories"],["goalProtein","protein"],["goalCarbs","carbs"],["goalFat","fat"]])document.getElementById(id).value=state.goals[key];open("goalsDialog")};
document.getElementById("goalsForm").addEventListener("submit",e=>{if(e.submitter?.value==="default"){e.preventDefault();state.goals={calories:Number(document.getElementById("goalCalories").value),protein:Number(document.getElementById("goalProtein").value),carbs:Number(document.getElementById("goalCarbs").value),fat:Number(document.getElementById("goalFat").value)};save();goalsDialog.close()}});
document.getElementById("quickWeight").onclick=()=>open("weightDialog");
document.getElementById("weightForm").addEventListener("submit",e=>{if(e.submitter?.value==="default"){e.preventDefault();const w=Number(document.getElementById("weightInput").value);if(w>0){state.weights.push({date:todayKey(),kg:w});save();weightDialog.close();info("Weight saved",`Your latest weight is ${w.toFixed(1)} kg. A full progress chart is planned for a later version.`)}}});
document.getElementById("quickExport").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="fitlify-backup.json";a.click();URL.revokeObjectURL(a.href)};
document.getElementById("settingsBtn").onclick=()=>info("Settings","Your data is saved on this device in this browser. Export a backup regularly. Clearing browser data may erase your entries.");
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x===b));if(b.dataset.tab!=="home")info(b.textContent.trim(),b.dataset.tab==="diary"?"Your full diary calendar and filters are coming in the next update.":"This section is planned for a future FITLIFY release.")});
const today=todayKey();if(state.lastOpen!==today){const y=new Date();y.setDate(y.getDate()-1);const yesterday=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}-${String(y.getDate()).padStart(2,"0")}`;state.streak=state.lastOpen===yesterday?(state.streak||0)+1:1;state.lastOpen=today;save()}else render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
