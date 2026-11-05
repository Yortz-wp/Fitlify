const DB = [
  {id:"rice",name:"White rice, cooked",category:"Staples",base:100,unit:"100 g",kcal:130,p:2.7,c:28.2,f:0.3,servings:[["100 g",100],["1 cup cooked (158 g)",158],["1/2 cup cooked (79 g)",79]]},
  {id:"brownrice",name:"Brown rice, cooked",category:"Staples",base:100,unit:"100 g",kcal:123,p:2.7,c:25.6,f:1,servings:[["100 g",100],["1 cup cooked (195 g)",195]]},
  {id:"egg",name:"Chicken egg, whole, cooked",category:"Staples",base:50,unit:"1 large egg (50 g)",kcal:78,p:6.3,c:0.6,f:5.3,servings:[["1 large egg (50 g)",50],["2 large eggs (100 g)",100]]},
  {id:"chicken",name:"Chicken breast, skinless, cooked",category:"Protein",base:100,unit:"100 g",kcal:165,p:31,c:0,f:3.6,servings:[["100 g",100],["150 g",150],["200 g",200]]},
  {id:"porkadobo",name:"Pork adobo (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:250,p:17,c:4,f:18,servings:[["100 g",100],["1 serving (180 g)",180]]},
  {id:"chickenadobo",name:"Chicken adobo (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:190,p:25,c:3,f:8,servings:[["100 g",100],["1 serving (180 g)",180]]},
  {id:"sinigangpork",name:"Pork sinigang (meat and broth, estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:105,p:9,c:3,f:6,servings:[["100 g",100],["1 bowl (300 g)",300]]},
  {id:"sinigangfish",name:"Fish sinigang (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:75,p:12,c:2,f:2,servings:[["100 g",100],["1 bowl (300 g)",300]]},
  {id:"tinola",name:"Chicken tinola (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:85,p:11,c:3,f:3,servings:[["100 g",100],["1 bowl (300 g)",300]]},
  {id:"tapsilog",name:"Beef tapa, cooked (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:220,p:26,c:3,f:12,servings:[["100 g",100],["1 serving (100 g)",100]]},
  {id:"longganisa",name:"Pork longganisa, cooked (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:330,p:14,c:8,f:27,servings:[["1 piece (40 g)",40],["100 g",100]]},
  {id:"tocino",name:"Pork tocino, cooked (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:280,p:17,c:15,f:17,servings:[["100 g",100],["1 serving (80 g)",80]]},
  {id:"pancit",name:"Pancit bihon (estimated)",category:"Filipino dishes",base:100,unit:"100 g",kcal:160,p:6,c:25,f:4,servings:[["100 g",100],["1 cup (180 g)",180]]},
  {id:"lumpia",name:"Lumpiang shanghai, fried (estimated)",category:"Filipino dishes",base:1,unit:"1 piece",kcal: lumpiaKcal(),p:4,c:5,f:6,servings:[["1 piece",1],["3 pieces",3],["5 pieces",5]]},
  {id:"banana",name:"Banana, saba, boiled",category:"Fruit",base:100,unit:"100 g",kcal:120,p:1.3,c:31,f:0.3,servings:[["100 g",100],["1 medium saba (100 g)",100]]},
  {id:"apple",name:"Apple, raw",category:"Fruit",base:100,unit:"100 g",kcal:52,p:0.3,c:14,f:0.2,servings:[["1 medium apple (182 g)",182],["100 g",100]]},
  {id:"milk",name:"Low-fat milk, plain (generic estimate)",category:"Other",base:100,unit:"100 ml",kcal:46,p:3.4,c:4.8,f:1.5,servings:[["100 ml",100],["1 cup (240 ml)",240]]},
  {id:"tuna",name:"Canned tuna in water, drained (generic)",category:"Protein",base:100,unit:"100 g",kcal:116,p:26,c:0,f:1,servings:[["100 g",100],["1 can drained (120 g)",120]]},
  {id:"hotdog",name:"Hotdog, cooked (generic estimate)",category:"Protein",base:1,unit:"1 piece",kcal:150,p:6,c:3,f:13,servings:[["1 piece",1],["2 pieces",2]]},
  {id:"yumburger",name:"Jollibee Yumburger (approximate)",category:"Fast food",base:1,unit:"1 burger",kcal:250,p:11,c:30,f:10,servings:[["1 burger",1]]},
  {id:"fries",name:"French fries, fast-food style (estimate)",category:"Fast food",base:100,unit:"100 g",kcal:312,p:3.4,c:41,f:15,servings:[["small serving (70 g)",70],["100 g",100]]}
];
function lumpiaKcal(){return 90}
const CATS=["All","Filipino dishes","Staples","Protein","Fast food","Fruit","Other"];
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
let goals=JSON.parse(localStorage.getItem("fitlifyGoals")||'{"kcal":1800,"protein":130,"carbs":180,"fat":55}');
let logs=JSON.parse(localStorage.getItem("fitlifyLogs")||"{}");
let custom=JSON.parse(localStorage.getItem("fitlifyCustom")||"[]");
let selected=null, activeCat="All";
function save(){localStorage.setItem("fitlifyLogs",JSON.stringify(logs));localStorage.setItem("fitlifyGoals",JSON.stringify(goals));localStorage.setItem("fitlifyCustom",JSON.stringify(custom))}
function foods(){return [...DB,...custom]}
function round(n){return Math.round(n*10)/10}
function totals(){return (logs[today()]||[]).reduce((a,x)=>{a.kcal+=x.kcal;a.p+=x.p;a.c+=x.c;a.f+=x.f;return a},{kcal:0,p:0,c:0,f:0})}
function render(){
  const t=totals(), left=goals.kcal-t.kcal, pct=Math.min(100,t.kcal/goals.kcal*100);
  $("todayLabel").textContent=new Date().toLocaleDateString("en-PH",{weekday:"short",month:"short",day:"numeric"});
  $("caloriesLeft").textContent=Math.max(0,Math.round(left));$("caloriesIn").innerHTML=`${Math.round(t.kcal)} <i>kcal</i>`;$("calorieGoal").innerHTML=`${goals.kcal} <i>kcal</i>`;
  $("calorieRing").style.background=`conic-gradient(var(--cyan) ${pct*3.6}deg,#263544 0deg)`;
  [["protein",t.p,goals.protein],["carbs",t.c,goals.carbs],["fat",t.f,goals.fat]].forEach(([k,v,g])=>{$(k+"Text").textContent=`${round(v)} / ${g}g`;$(k+"Bar").style.width=Math.min(100,v/g*100)+"%"});
  $("mealSections").innerHTML=["Breakfast","Lunch","Dinner","Snacks"].map(meal=>{const entries=(logs[today()]||[]).filter(x=>x.meal===meal);const sum=entries.reduce((a,x)=>a+x.kcal,0);return `<article class="meal-card"><div class="meal-head"><h3>${meal}</h3><span class="meal-total">${Math.round(sum)} kcal</span></div>${entries.length?entries.map(x=>`<div class="food-entry"><div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.qtyLabel)} · P ${round(x.p)}g · C ${round(x.c)}g · F ${round(x.f)}g</small></div><div class="entry-right"><b>${Math.round(x.kcal)} kcal</b><button class="delete" data-delete="${x.id}" aria-label="Delete food">×</button></div></div>`).join(""):`<div class="empty">No food logged yet.</div>`}</article>`}).join("");
  document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{logs[today()]=logs[today()].filter(x=>x.id!==b.dataset.delete);save();render()});
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openFood(){ $("foodSearch").value="";activeCat="All";renderFilters();renderResults();$("foodDialog").showModal(); }
function renderFilters(){$("categoryFilters").innerHTML=CATS.map(c=>`<button class="filter ${c===activeCat?"active":""}" data-cat="${c}">${c}</button>`).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;renderFilters();renderResults()})}
function renderResults(){const q=$("foodSearch").value.toLowerCase();const list=foods().filter(f=>(activeCat==="All"||f.category===activeCat)&&(f.name.toLowerCase().includes(q)||f.category.toLowerCase().includes(q)));$("foodResults").innerHTML=list.length?list.map(f=>`<div class="food-result"><div><strong>${escapeHtml(f.name)}</strong><small>${f.category} · ${f.kcal} kcal · P ${f.p}g / C ${f.c}g / F ${f.f}g per ${f.unit}</small></div><button data-pick="${f.id}">Add</button></div>`).join(""):`<p class="empty">No matches. Try another search or create a custom food.</p>`;document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>chooseFood(b.dataset.pick))}
function chooseFood(id){selected=foods().find(f=>f.id===id);if(!selected)return;$("selectedFoodName").textContent=selected.name;$("selectedFoodInfo").textContent=`${selected.kcal} kcal · P ${selected.p}g · C ${selected.c}g · F ${selected.f}g per ${selected.unit}`;$("servingSelect").innerHTML=selected.servings.map((s,i)=>`<option value="${s[1]}">${s[0]}</option>`).join("");$("quantityInput").value=1;updatePreview();$("foodDialog").close();$("portionDialog").showModal()}
function updatePreview(){if(!selected)return;const factor=Number($("servingSelect").value)/selected.base*Number($("quantityInput").value||0);$("nutritionPreview").innerHTML=`Estimated total: <b>${round(selected.kcal*factor)} kcal</b><br>Protein ${round(selected.p*factor)}g · Carbs ${round(selected.c*factor)}g · Fat ${round(selected.f*factor)}g`}
$("confirmAdd").onclick=()=>{const factor=Number($("servingSelect").value)/selected.base*Number($("quantityInput").value);if(!factor||factor<0)return;const serving=$("servingSelect").selectedOptions[0].text;const entry={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:selected.name,meal:$("mealSelect").value,qtyLabel:`${$("quantityInput").value} × ${serving}`,kcal:round(selected.kcal*factor),p:round(selected.p*factor),c:round(selected.c*factor),f:round(selected.f*factor)};logs[today()]??=[];logs[today()].push(entry);save();$("portionDialog").close();render()};
$("foodSearch").addEventListener("input",renderResults);$("quantityInput").addEventListener("input",updatePreview);$("servingSelect").addEventListener("change",updatePreview);
$("openFood").onclick=openFood;$("browseFoods").onclick=openFood;
$("customFoodBtn").onclick=()=>{$("foodDialog").close();$("customForm").reset();$("customDialog").showModal()};
$("customForm").onsubmit=e=>{e.preventDefault();const f={id:"custom-"+Date.now(),name:$("customName").value.trim(),category:"Other",base:1,unit:$("customServing").value,kcal:Number($("customKcal").value),p:Number($("customProtein").value),c:Number($("customCarbs").value),f:Number($("customFat").value),servings:[[$("customServing").value,1]]};custom.push(f);save();$("customDialog").close();openFood();$("foodSearch").value=f.name;renderResults()};
$("settingsBtn").onclick=()=>{$("goalKcal").value=goals.kcal;$("goalProtein").value=goals.protein;$("goalCarbs").value=goals.carbs;$("goalFat").value=goals.fat;$("settingsDialog").showModal()};
$("goalsForm").onsubmit=e=>{e.preventDefault();goals={kcal:Number($("goalKcal").value),protein:Number($("goalProtein").value),carbs:Number($("goalCarbs").value),fat:Number($("goalFat").value)};save();$("settingsDialog").close();render()};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({goals,logs,custom},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="fitlify-backup.json";a.click();URL.revokeObjectURL(a.href)};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
["foodDialog","portionDialog","customDialog","settingsDialog"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target===$(id))$(id).close()}));
render();
if("serviceWorker"in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
