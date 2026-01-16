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

/* INVOICE TYPE SWITCH */
const radios = document.querySelectorAll('input[name="invType"]');

function setInvoiceType(type){
  if(type === "simplified"){
    invTitle.innerText = "Simplified Tax Invoice";
    invTitleAr.innerText = "فاتورة ضريبية مبسطة";
  }else{
    invTitle.innerText = "Tax Invoice";
    invTitleAr.innerText = "فاتورة ضريبية";
  }
  localStorage.invoiceType = type;
}

radios.forEach(r=>{
  r.addEventListener("change",()=>setInvoiceType(r.value));
});

const savedType = localStorage.invoiceType || "tax";
document.querySelector(`input[value="${savedType}"]`).checked = true;
setInvoiceType(savedType);

/* ITEMS */
let row = 0;
function addRow(){
  row++;
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row}</td>
    <td><input></td>
    <td><input type="number" value="1" oninput="calc()"></td>
    <td><input type="number" value="0" oninput="calc()"></td>
    <td class="line">0.00</td>`;
  items.querySelector("tbody").appendChild(tr);
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
  let v = sum * 0.15;
  sub.innerText = sum.toFixed(2);
  vat.innerText = v.toFixed(2);
  total.innerText = (sum+v).toFixed(2);
  QRCode.toCanvas(qr, total.innerText);
}

/* SAVE + HISTORY */
function saveInvoice(){
  let h = JSON.parse(localStorage.history || "[]");
  h.push({
    no:invoiceNo.innerText,
    type:localStorage.invoiceType || "tax",
    total:total.innerText
  });
  localStorage.history = JSON.stringify(h);
  alert("Invoice Saved");
}

addRow();
