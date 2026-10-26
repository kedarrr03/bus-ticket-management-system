/* SmartBus Go demo frontend. Data is stored locally in this browser only. */
const $ = (id) => document.getElementById(id);
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const buses = [
 {id:1,name:'Royal Volvo Multi-Axle',type:'AC Volvo',from:'Pune',to:'Mumbai',depart:'06:30 AM',arrive:'10:15 AM',price:799,seats:18,rating:4.9,comfort:5,women:true,speed:1},
 {id:2,name:'SmartBus Gold Sleeper',type:'AC Sleeper',from:'Pune',to:'Mumbai',depart:'09:00 PM',arrive:'01:30 AM',price:999,seats:12,rating:4.8,comfort:5,women:true,speed:2},
 {id:3,name:'Express Comfort Coach',type:'Non-AC Seater',from:'Pune',to:'Mumbai',depart:'11:00 AM',arrive:'03:45 PM',price:499,seats:24,rating:4.5,comfort:3,women:false,speed:3},
 {id:4,name:'Coastal Dream Sleeper',type:'AC Sleeper',from:'Mumbai',to:'Goa',depart:'08:30 PM',arrive:'07:00 AM',price:1399,seats:9,rating:4.9,comfort:5,women:true,speed:2},
 {id:5,name:'Deccan Premium Volvo',type:'AC Volvo',from:'Mumbai',to:'Pune',depart:'07:00 AM',arrive:'10:45 AM',price:749,seats:15,rating:4.8,comfort:4,women:true,speed:1},
 {id:6,name:'Himalayan Night Rider',type:'AC Sleeper',from:'Delhi',to:'Manali',depart:'08:00 PM',arrive:'07:30 AM',price:1599,seats:10,rating:4.7,comfort:5,women:true,speed:2},
 {id:7,name:'CityLink Executive',type:'AC Volvo',from:'Bangalore',to:'Hyderabad',depart:'09:15 PM',arrive:'06:00 AM',price:999,seats:16,rating:4.6,comfort:4,women:false,speed:1},
 {id:8,name:'Jaipur FastTrack',type:'AC Seater',from:'Delhi',to:'Jaipur',depart:'06:00 AM',arrive:'11:00 AM',price:599,seats:20,rating:4.6,comfort:3,women:true,speed:1},
 {id:9,name:'Western Star Coach',type:'AC Volvo',from:'Mumbai',to:'Ahmedabad',depart:'10:00 PM',arrive:'06:00 AM',price:1199,seats:11,rating:4.8,comfort:4,women:true,speed:2},
 {id:10,name:'Southern Crown',type:'AC Sleeper',from:'Bangalore',to:'Chennai',depart:'10:30 PM',arrive:'05:30 AM',price:899,seats:13,rating:4.7,comfort:4,women:true,speed:2}
];
let sortMode='DEFAULT', selectedBus=null, selectedSeat=null, addons={}, wallet=Number(localStorage.getItem('smartbusWallet')||0), bookings=JSON.parse(localStorage.getItem('smartbusBookings')||'[]');
function toast(msg){const el=$('toast');if(!el){alert(msg);return}el.textContent=msg;el.classList.add('show');clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
function switchTab(id){document.querySelectorAll('.tab-content').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));const map={'booking-tab':'btn-booking','pnr-tab':'btn-pnr','admin-tab':'btn-admin'};if(map[id]&&$(map[id]))$(map[id]).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});return false}
function swapLocations(){const a=$('search-source'),b=$('search-destination');if(a&&b){[a.value,b.value]=[b.value,a.value]}}
function quickFillRoute(a,b){if($('search-source'))$('search-source').value=a;if($('search-destination'))$('search-destination').value=b;handleBusSearch(null)}
function handleBusSearch(e){if(e)e.preventDefault();renderBuses();$('bus-cards-container')?.scrollIntoView({behavior:'smooth',block:'start'});return false}
function setSmartSort(mode){sortMode=mode;document.querySelectorAll('.sort-chip').forEach(b=>b.classList.remove('active'));const map={DEFAULT:'sort-default',COMFORT:'sort-comfort',VALUE:'sort-value',FASTEST:'sort-fastest',WOMEN_FRIENDLY:'sort-women_friendly'};if($(map[mode]))$(map[mode]).classList.add('active');renderBuses()}
function renderBuses(){const box=$('bus-cards-container');if(!box)return;const source=($('search-source')?.value||'').trim().toLowerCase(),dest=($('search-destination')?.value||'').trim().toLowerCase(),type=$('filter-type')?.value||'ALL',priceSort=$('sort-price')?.value||'DEFAULT';let list=buses.filter(b=>(!source||b.from.toLowerCase().includes(source))&&(!dest||b.to.toLowerCase().includes(dest))&&(type==='ALL'||b.type.toLowerCase().includes(type.toLowerCase())));if(!list.length&&source&&dest){list=buses.filter(b=>(b.from.toLowerCase().includes(source)||b.to.toLowerCase().includes(source)||b.from.toLowerCase().includes(dest)||b.to.toLowerCase().includes(dest))&&(type==='ALL'||b.type.toLowerCase().includes(type.toLowerCase())))}if(sortMode==='COMFORT')list.sort((a,b)=>b.comfort-a.comfort);if(sortMode==='VALUE')list.sort((a,b)=>(b.rating/b.price)-(a.rating/a.price));if(sortMode==='FASTEST')list.sort((a,b)=>a.speed-b.speed);if(sortMode==='WOMEN_FRIENDLY')list.sort((a,b)=>Number(b.women)-Number(a.women));if(priceSort==='LOW')list.sort((a,b)=>a.price-b.price);if(priceSort==='HIGH')list.sort((a,b)=>b.price-a.price);if(!list.length){box.innerHTML='<div class="empty-state"><i class="fa-solid fa-bus"></i><h3>No exact coach found</h3><p>Try a different route or choose a popular route above.</p></div>';return}box.innerHTML=list.map(b=>`<article class="bus-card"><div class="bus-card-top"><div><h3>${b.name}</h3><div class="bus-city">Verified SmartBus operator</div></div><span class="bus-type-tag">${b.type}</span></div><div class="bus-route"><div><div class="bus-time">${b.depart}</div><div class="bus-city">${b.from}</div></div><div class="route-line"></div><div style="text-align:right"><div class="bus-time">${b.arrive}</div><div class="bus-city">${b.to}</div></div></div><div class="bus-meta-row"><span><i class="fa-solid fa-star text-gold"></i> ${b.rating}</span><span><i class="fa-solid fa-chair"></i> ${b.seats} seats left</span><span><i class="fa-solid fa-shield-heart"></i> ${b.women?'Women-friendly':'Verified coach'}</span><span><i class="fa-solid fa-satellite-dish"></i> GPS demo</span></div><div class="bus-card-bottom"><div><div class="bus-city">All-in fare</div><div class="bus-price">${money(b.price)}</div></div><div class="bus-card-actions"><button class="btn-outline" onclick="openTrackingModal(${b.id})"><i class="fa-solid fa-location-crosshairs"></i> Track</button><button class="btn-primary" onclick="openSeatModal(${b.id})">Select Seats <i class="fa-solid fa-arrow-right"></i></button></div></div></article>`).join('')}
function showModal(id){const el=$(id);if(el){el.classList.add('open');el.style.display='flex';el.setAttribute('aria-modal','true')}}function hideModal(id){const el=$(id);if(el){el.classList.remove('open');el.style.display='none'}}
function findBus(id){return buses.find(b=>b.id===Number(id))||buses[0]}
function openSeatModal(id){selectedBus=findBus(id);selectedSeat=null;const title=$('seat-bus-title');if(title)title.textContent=selectedBus.name+' — '+selectedBus.from+' to '+selectedBus.to;const grid=$('seat-grid');if(grid){grid.innerHTML=Array.from({length:24},(_,i)=>{const n=i+1,taken=[3,8,12,17,21].includes(n);return `<button type="button" class="seat ${taken?'booked':''}" ${taken?'disabled':''} onclick="chooseSeat(${n})" style="border:1px solid ${taken?'#fb7185':'#ffffff30'};background:${taken?'#512435':'#0b1c30'};color:${taken?'#fda4af':'white'};padding:10px;border-radius:8px">${n}</button>`}).join('')}const price=$('seat-total');if(price)price.textContent=money(selectedBus.price);showModal('seat-modal')}
function chooseSeat(n){selectedSeat=n;document.querySelectorAll('#seat-grid .seat').forEach(b=>{if(Number(b.textContent)===n){b.style.background='var(--gold)';b.style.color='#172238'}else if(!b.disabled){b.style.background='#0b1c30';b.style.color='white'}});if($('seat-selected'))$('seat-selected').textContent='Seat '+n;}
function closeSeatModal(){hideModal('seat-modal')}
function openCheckoutModal(){if(!selectedBus){toast('Please select a coach first.');return}if(!selectedSeat){toast('Please choose a seat first.');return}if($('checkout-summary'))$('checkout-summary').innerHTML=`<strong>${selectedBus.name}</strong><p>${selectedBus.from} → ${selectedBus.to} · Seat ${selectedSeat}</p><h3>${money(selectedBus.price+(Object.values(addons).reduce((a,b)=>a+b,0)))}</h3>`;hideModal('seat-modal');showModal('checkout-modal')}
function closeCheckoutModal(){hideModal('checkout-modal')}
function executeUpiPayment(){if(!selectedBus||!selectedSeat){toast('Select a coach and seat first.');return}const pnr='PNR-'+Math.floor(100000+Math.random()*899999);const record={pnr,bus:selectedBus.name,from:selectedBus.from,to:selectedBus.to,seat:selectedSeat,fare:selectedBus.price,date:new Date().toLocaleDateString('en-IN'),status:'Confirmed'};bookings.push(record);localStorage.setItem('smartbusBookings',JSON.stringify(bookings));if($('ticket-pnr'))$('ticket-pnr').textContent=pnr;if($('ticket-details'))$('ticket-details').innerHTML=`${record.bus}<br>${record.from} → ${record.to}<br>Seat ${record.seat} · ${money(record.fare)}`;hideModal('checkout-modal');showModal('ticket-modal');refreshAdminDashboard();toast('Demo booking confirmed! PNR: '+pnr)}
function closeTicketModal(){hideModal('ticket-modal')}
function printTicket(){window.print()}
function searchPNR(e){if(e)e.preventDefault();const code=($('pnr-input')?.value||'').trim().toUpperCase();const demo={ 'PNR-108422':{pnr:'PNR-108422',bus:'Royal Volvo Multi-Axle',from:'Pune',to:'Mumbai',seat:'12',status:'Confirmed'},'PNR-108423':{pnr:'PNR-108423',bus:'Jaipur FastTrack',from:'Delhi',to:'Jaipur',seat:'08',status:'Delayed — demo ₹100 wallet credit eligible'}};const b=bookings.find(x=>x.pnr===code)||demo[code];const box=$('pnr-result-box');if(box){box.style.display='block';box.innerHTML=b?`<h3><i class="fa-solid fa-circle-check text-gold"></i> Booking Found</h3><p><strong>${b.pnr}</strong> · ${b.status}</p><p>${b.bus}<br>${b.from} → ${b.to}<br>Seat: ${b.seat}</p>${code==='PNR-108423'?'<button class="btn-primary" onclick="claimWalletCredit()">Claim ₹100 demo wallet credit</button>':''}`:'<h3>PNR not found</h3><p>Please check the number. Try demo PNR-108422 or PNR-108423.</p>'}return false}
function claimWalletCredit(){wallet+=100;localStorage.setItem('smartbusWallet',wallet);if($('nav-wallet-balance'))$('nav-wallet-balance').textContent=money(wallet);toast('₹100 demo wallet credit added!')}
function openTrackingModal(id){const b=findBus(id);if($('track-bus-title'))$('track-bus-title').textContent=b.name;if($('track-route-sub'))$('track-route-sub').textContent=b.from+' → '+b.to;if($('track-current-loc'))$('track-current-loc').textContent='Live demo: Expressway toward '+b.to;if($('track-live-speed'))$('track-live-speed').textContent='68 km/h';showModal('tracking-modal')}
function closeTrackingModal(){hideModal('tracking-modal')}function callDriverPrompt(){toast('Demo call action: contact details are displayed in the tracking panel.')}
function shareTripWhatsapp(){const text=encodeURIComponent('I am travelling with SmartBus Go. This is my demo trip update.');window.open('https://wa.me/?text='+text,'_blank','noopener')}
function copyTripLink(){if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(()=>toast('Trip page link copied.')).catch(()=>toast(location.href));else toast(location.href)}
function openSosModal(){showModal('sos-modal')}function closeSosModal(){hideModal('sos-modal')}function triggerEmergencyBroadcast(){hideModal('sos-modal');toast('DEMO ONLY: SOS flow activated. No emergency services were contacted.');}
function openLoyaltyModal(){showModal('loyalty-modal')}function closeLoyaltyModal(){hideModal('loyalty-modal')}function redeemSmartCoins(){const coins=Number($('nav-loyalty-coins')?.textContent||250);if(coins<50){toast('You need at least 50 SmartCoins.');return}if($('nav-loyalty-coins'))$('nav-loyalty-coins').textContent=coins-50;wallet+=50;localStorage.setItem('smartbusWallet',wallet);if($('nav-wallet-balance'))$('nav-wallet-balance').textContent=money(wallet);toast('50 demo SmartCoins redeemed for ₹50 wallet credit.')}
function openPriceDropModal(){const a=$('search-source')?.value||'Pune',b=$('search-destination')?.value||'Mumbai';if($('price-drop-route-title'))$('price-drop-route-title').textContent=a+' ➔ '+b;showModal('price-drop-modal')}function closePriceDropModal(){hideModal('price-drop-modal')}
function handleAiTripSearch(){const q=($('ai-trip-query-input')?.value||'').trim();if(!q){toast('Enter your trip request first.');return}const lower=q.toLowerCase();const cities=['Pune','Mumbai','Goa','Delhi','Manali','Bangalore','Hyderabad','Chennai','Jaipur','Ahmedabad'];let found=cities.filter(c=>lower.includes(c.toLowerCase()));if(found.length>=2){if($('search-source'))$('search-source').value=found[0];if($('search-destination'))$('search-destination').value=found[1]}const budget=(q.match(/(?:under|below|budget|₹)\s*₹?\s*([0-9,]+)/i)||[])[1];if(budget){const val=Number(budget.replace(/,/g,''));if(val&&$('sort-price'))$('sort-price').value='LOW';}const card=$('ai-response-card');if(card){card.style.display='block';card.innerHTML=`<strong><i class="fa-solid fa-wand-magic-sparkles text-gold"></i> Smart trip suggestion</strong><p>Based on your request: “${q.replace(/[<>]/g,'')}”. Showing available demo coaches. Confirm route, date and fare before booking.</p><button class="btn-primary" onclick="handleBusSearch(null)">Show matching coaches</button>`}renderBuses()}
function quickAiPrompt(q){if($('ai-trip-query-input'))$('ai-trip-query-input').value=q;handleAiTripSearch()}
function changeLanguage(lang){document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));if($('lang-'+lang))$('lang-'+lang).classList.add('active');const labels={en:'Language set to English.',hi:'भाषा हिंदी पर सेट की गई (डेमो).',mr:'भाषा मराठीवर सेट केली (डेमो).'};toast(labels[lang]||labels.en)}
function setAuthMode(mode){toast(mode==='guest'?'Guest demo mode selected.':'OTP demo mode selected.')}
function sendMockOtp(){toast('Demo OTP: 123456 (no SMS is sent).')}function verifyMockOtp(){toast('Demo OTP verification only. No real authentication is configured.')}
function adminLogin(e){if(e)e.preventDefault();const pin=$('admin-pin')?.value;if(pin==='admin123'){if($('admin-login-box'))$('admin-login-box').style.display='none';if($('admin-dashboard'))$('admin-dashboard').style.display='block';refreshAdminDashboard();toast('Operator demo portal opened.')}else toast('Incorrect PIN. Use demo PIN admin123.');return false}function adminLogout(){if($('admin-login-box'))$('admin-login-box').style.display='block';if($('admin-dashboard'))$('admin-dashboard').style.display='none'}function refreshAdminDashboard(){if($('stat-total-buses'))$('stat-total-buses').textContent=buses.length;if($('stat-total-tickets'))$('stat-total-tickets').textContent=bookings.length;if($('stat-occupancy'))$('stat-occupancy').textContent=Math.min(100,Math.round(bookings.length/Math.max(1,buses.length*24)*100))+'%';if($('stat-total-revenue'))$('stat-total-revenue').textContent=money(bookings.reduce((s,b)=>s+(b.fare||0),0));if($('admin-bookings-tbody'))$('admin-bookings-tbody').innerHTML=bookings.length?bookings.map(b=>`<tr><td>${b.pnr}</td><td>${b.bus}</td><td>${b.from} → ${b.to}</td><td>${b.seat}</td><td>${money(b.fare)}</td></tr>`).join(''):'<tr><td colspan="5">No demo bookings yet.</td></tr>'}
function openAddBusModal(){showModal('add-bus-modal')}function closeAddBusModal(){hideModal('add-bus-modal')}function closeBusProfileModal(){hideModal('bus-profile-modal')}
function toggleAddon(name,price){if(addons[name])delete addons[name];else addons[name]=price;const total=(selectedBus?.price||0)+Object.values(addons).reduce((a,b)=>a+b,0);if($('seat-total'))$('seat-total').textContent=money(total);toast((addons[name]?'Added ':'Removed ')+name+' add-on')}
function selectUpiApp(app){window.selectedUpi=app;document.querySelectorAll('.upi-app-card').forEach(x=>x.classList.toggle('active',x.id==='upi-'+app));toast('Selected '+app.toUpperCase()+' demo payment option.')}
function initSmartBus(){const date=$('search-date');if(date){const d=new Date();date.min=d.toISOString().slice(0,10);if(!date.value)date.value=date.min}if($('nav-wallet-balance'))$('nav-wallet-balance').textContent=money(wallet);renderBuses();refreshAdminDashboard();document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m){m.classList.remove('open');m.style.display='none'}}));document.querySelectorAll('form').forEach(f=>{if(f.id==='price-drop-form')f.addEventListener('submit',e=>{e.preventDefault();closePriceDropModal();toast('Price alert saved in this demo only.')})})}
document.addEventListener('DOMContentLoaded',initSmartBus);

/* Compatibility fixes for the supplied SmartBus Go HTML. */
function openSeatModal(id){
  selectedBus=findBus(id); selectedSeat=null; addons={};
  const title=$('modal-bus-title'); if(title) title.textContent=selectedBus.name;
  const route=$('modal-bus-route'); if(route) route.textContent=selectedBus.from+' → '+selectedBus.to;
  const grid=$('seat-layout-grid');
  if(grid){
    grid.innerHTML='';
    for(let n=1;n<=24;n++){
      const taken=[3,8,12,17,21].includes(n);
      const btn=document.createElement('button'); btn.type='button'; btn.textContent=String(n).padStart(2,'0');
      btn.className='seat-option'+(taken?' booked':''); btn.disabled=taken;
      btn.style.cssText=`padding:12px;border-radius:9px;border:1px solid ${taken?'#fb7185':'#64748b'};background:${taken?'#512435':'#10243a'};color:white;cursor:${taken?'not-allowed':'pointer'};min-width:42px;`;
      btn.addEventListener('click',()=>chooseSeat(n)); grid.appendChild(btn);
    }
  }
  const inspector=$('seat-inspector-card'); if(inspector) inspector.innerHTML='<p>Select an available seat to continue.</p>';
  const form=$('passenger-checkout-form'); if(form) form.reset();
  updateFareSummary(); showModal('seat-modal');
}
function chooseSeat(n){
  selectedSeat=n;
  document.querySelectorAll('#seat-layout-grid button').forEach(btn=>{
    if(!btn.disabled){const active=Number(btn.textContent)===n;btn.style.background=active?'#e8b84a':'#10243a';btn.style.color=active?'#142033':'white';btn.style.borderColor=active?'#e8b84a':'#64748b';}
  });
  if($('summary-selected-seats')) $('summary-selected-seats').textContent=String(n).padStart(2,'0');
  if($('seat-inspector-card')) $('seat-inspector-card').innerHTML=`<strong>Seat ${String(n).padStart(2,'0')} selected</strong><p>${selectedBus.name}</p><p>${money(selectedBus.price)} base fare</p>`;
  updateFareSummary();
}
function fareDiscount(){const cat=$('passenger-category')?.value||'GENERAL';return cat==='STUDENT'?0.15:cat==='SENIOR'?0.20:0;}
function updateFareSummary(){
  const base=selectedBus?selectedBus.price:0, disc=Math.round(base*fareDiscount()), extra=Object.values(addons||{}).reduce((a,b)=>a+b,0), total=Math.max(0,base-disc+extra);
  if($('summary-base-fare')) $('summary-base-fare').textContent=money(base);
  if($('summary-discount-text')) $('summary-discount-text').textContent=`${Math.round(fareDiscount()*100)}% (${money(disc)})`;
  if($('summary-total-fare')) $('summary-total-fare').textContent=money(total);
  if($('checkout-base-amount')) $('checkout-base-amount').textContent=money(base);
  if($('checkout-discount-amount')) $('checkout-discount-amount').textContent='-'+money(disc);
  if($('checkout-addons-amount')) $('checkout-addons-amount').textContent='+'+money(extra);
  if($('checkout-final-payable')) $('checkout-final-payable').textContent=money(total);
  return total;
}
function handleAgeChange(){const age=Number($('passenger-age')?.value||0);if(age>=60&&$('passenger-category'))$('passenger-category').value='SENIOR';updateFareSummary();}
function proceedTo3TapCheckout(e){
  if(e)e.preventDefault();
  if(!selectedBus){toast('Please select a bus first.');return false;}
  if(!selectedSeat){toast('Please select an available seat first.');return false;}
  const form=$('passenger-checkout-form'); if(form&&!form.reportValidity())return false;
  const name=$('passenger-name')?.value.trim(), phone=$('passenger-phone')?.value.trim();
  if(!name||!phone){toast('Enter passenger name and 10-digit mobile number.');return false;}
  if($('checkout-bus-name'))$('checkout-bus-name').textContent=selectedBus.name+' · '+selectedBus.from+' → '+selectedBus.to;
  if($('checkout-passenger-text'))$('checkout-passenger-text').textContent=`${name} (${ $('passenger-age')?.value||'—'} yrs, ${$('passenger-gender')?.value||'—'}) • ${phone}`;
  if($('checkout-seats-text'))$('checkout-seats-text').textContent='#'+String(selectedSeat).padStart(2,'0');
  updateFareSummary(); hideModal('seat-modal'); showModal('checkout-modal'); return false;
}
function executeUpiPayment(){
  if(!selectedBus||!selectedSeat){toast('Select a bus and seat first.');return;}
  const pnr='PNR-'+Math.floor(100000+Math.random()*899999);
  const record={pnr,bus:selectedBus.name,from:selectedBus.from,to:selectedBus.to,seat:String(selectedSeat).padStart(2,'0'),fare:updateFareSummary(),date:new Date().toLocaleDateString('en-IN'),status:'Confirmed',passenger:$('passenger-name')?.value||'Guest'};
  bookings.push(record); localStorage.setItem('smartbusBookings',JSON.stringify(bookings));
  const ticket=$('ticket-printable-card'); if(ticket) ticket.innerHTML=`<div style="padding:24px;color:#142033;background:#fff;border-radius:14px"><h2>🚌 SmartBus Go</h2><h3>Booking Confirmed</h3><p><strong>PNR:</strong> ${record.pnr}</p><p><strong>Passenger:</strong> ${record.passenger}</p><p><strong>Bus:</strong> ${record.bus}</p><p><strong>Route:</strong> ${record.from} → ${record.to}</p><p><strong>Seat:</strong> ${record.seat}</p><p><strong>Date:</strong> ${record.date}</p><h3>Fare: ${money(record.fare)}</h3><p>Demo ticket — no real payment was processed.</p></div>`;
  hideModal('checkout-modal'); showModal('ticket-modal'); refreshAdminDashboard(); toast('Demo booking confirmed! PNR: '+pnr);
}
function toggleAddon(name,price){if(addons[name])delete addons[name];else addons[name]=price;updateFareSummary();toast((addons[name]?'Added ':'Removed ')+name+' add-on');}


/* Missing handlers used by buttons/forms in index.html */
function handleAddNewBus(e){
  if(e)e.preventDefault();
  const name=$('new-bus-name')?.value.trim();
  const from=$('new-bus-src')?.value.trim();
  const to=$('new-bus-dest')?.value.trim();
  const depart=$('new-bus-dep')?.value.trim();
  const arrive=$('new-bus-arr')?.value.trim();
  const type=$('new-bus-type')?.value||'AC Volvo';
  const price=Number($('new-bus-fare')?.value||0);
  if(!name||!from||!to||!depart||!arrive||price<=0){toast('Please complete all bus details.');return false;}
  const id=Math.max(0,...buses.map(b=>Number(b.id)||0))+1;
  buses.push({id,name,type,from,to,depart,arrive,price,seats:24,rating:4.5,comfort:4,women:false,speed:2});
  renderBuses();refreshAdminDashboard();
  e?.target?.reset();closeAddBusModal();toast('New demo bus route added.');return false;
}
function subscribePriceDropAlert(e){
  if(e)e.preventDefault();
  const fare=Number($('price-drop-target-fare')?.value||0);
  const contact=$('price-drop-contact-input')?.value.trim();
  if(!fare||!contact){toast('Enter a target fare and contact.');return false;}
  const alerts=JSON.parse(localStorage.getItem('smartbusPriceAlerts')||'[]');
  alerts.push({fare,contact,route:$('price-drop-route-title')?.textContent||'',createdAt:new Date().toISOString()});
  localStorage.setItem('smartbusPriceAlerts',JSON.stringify(alerts));
  closePriceDropModal();toast('Demo price alert saved in this browser. No message will be sent.');return false;
}
