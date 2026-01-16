date.innerText = new Date().toLocaleString();

/* INVOICE NUMBER */
function genInvoice(){
  let y = new Date().getFullYear();
  let d = JSON.parse(localStorage.inv || '{"y":0,"c":0}');
  if(d.y !== y){ d.y = y; d.c = 0; }
  d.c++;
  localStorage.inv = JSON.stringify(d);
  return y + "-" + String(d.c).padStart(4,"0");
}
invoiceNo.innerText = genInvoice();

/* SETTINGS */
function openSettings(){ settings.style.display="block"; loadStock(); }
function closeSettings(){ settings.style.display="none"; }
function openHistory(){ history.style.display="block"; loadHistory(); }
function closeHistory(){ history.style.display="none"; }

vatRate.value = localStorage.vatRate || 15;
vatRate.oninput = ()=> localStorage.vatRate = vatRate.value;

/* STOCK */
function addStock(){
  let s = JSON.parse(localStorage.stock || "[]");
  s.push({name:itemName.value, price:itemPrice.value});
  localStorage.stock = JSON.stringify(s);
  itemName.value = itemPrice.value = "";
  loadStock();
}
function loadStock(){
  let s = JSON.parse(localStorage.stock || "[]");
  stockList.innerHTML="";
  s.forEach((i,idx)=>{
    stockList.innerHTML += `<li>${i.name} - ${i.price}
      <button onclick="delStock(${idx})">❌</button></li>`;
  });
}
function delStock(i){
  let s = JSON.parse(localStorage.stock);
  s.splice(i,1);
  localStorage.stock = JSON.stringify(s);
  loadStock();
}

/* ITEMS */
let row = 0;
function addRow(){
  row++;
  let s = JSON.parse(localStorage.stock || "[]");
  let opts = s.map(i=>`<option data-p="${i.price}">${i.name}</option>`).join("");
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row}</td>
    <td><select onchange="setPrice(this)">${opts}</select></td>
    <td><input type="number" value="1" oninput="calc()"></td>
    <td><input type="number" value="0" oninput="calc()"></td>
    <td class="line">0.00</td>`;
  items.querySelector("tbody").appendChild(tr);
}

function setPrice(sel){
  let p = sel.selectedOptions[0]?.dataset.p || 0;
  sel.parentNode.parentNode.children[3].children[0].value = p;
  calc();
}

/* TOTAL */
function calc(){
  let sum = 0;
  document.querySelectorAll("#items tbody tr").forEach(r=>{
    let q = r.children[2].children[0].value;
    let p = r.children[3].children[0].value;
    let l = q * p;
    r.querySelector(".line").innerText = l.toFixed(2);
    sum += l;
  });
  let v = sum * (vatRate.value/100);
  sub.innerText = sum.toFixed(2);
  vat.innerText = v.toFixed(2);
  total.innerText = (sum+v).toFixed(2);
  QRCode.toCanvas(qr, total.innerText);
}

/* SAVE + HISTORY */
function saveInvoice(){
  let h = JSON.parse(localStorage.history || "[]");
  h.push({no:invoiceNo.innerText, date:date.innerText, total:total.innerText});
  localStorage.history = JSON.stringify(h);
  alert("Invoice Saved");
}
function loadHistory(){
  let h = JSON.parse(localStorage.history || "[]");
  historyList.innerHTML="";
  h.forEach(i=>{
    historyList.innerHTML += `<li>${i.no} - ${i.total}</li>`;
  });
}

addRow();
