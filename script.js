// إعداد Google Sheet
const sheetID = "1qZDFFzhS4JxKFnlcauirnDRTggBwk6fbINrgHSLGBzw";
const sheetName = "Sheet1";
const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

// عناصر DOM
const productList = document.getElementById('productList');
const cartLines = document.getElementById('cartLines');
const totalPriceEl = document.getElementById('totalPrice');
const orderField = document.getElementById('orderField');
const totalField = document.getElementById('totalField');
const searchInput = document.getElementById('search');
const refreshBtn = document.getElementById('refreshBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// الحالة
let products = [];
let cart = [];

// تحميل المنتجات من Google Sheets
async function loadProducts(){
  productList.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#888">...جاري التحميل</div>';
  try {
    const res = await fetch(gvizUrl);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows || [];
    products = rows.map(r => ({
      name: r.c[0] ? r.c[0].v : '',
      price: r.c[1] ? Number(r.c[1].v) : 0,
      image: r.c[2] ? r.c[2].v : ''
    })).filter(p => p.name);
    renderProducts(products);
  } catch (err) {
    productList.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#c00">⚠️ تأكدي أن الجدول Public</div>';
  }
}

// عرض المنتجات
function renderProducts(list){
  if(!list.length){
    productList.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#666">لا توجد منتجات</div>';
    return;
  }
  productList.innerHTML = '';
  list.forEach((p,i)=>{
    const box=document.createElement('div');
    box.className='product';
    box.innerHTML=`
      <img src="${p.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="price">${p.price} دج</div>
      <div class="actions">
        <button class="btn primary" onclick="addToCart(${i})">➕ أضف</button>
      </div>`;
    productList.appendChild(box);
  });
}

// إضافة للعربة
function addToCart(i){
  const p=products[i];
  if(!p) return;
  const found=cart.find(x=>x.name===p.name);
  if(found) found.qty++;
  else cart.push({...p,qty:1});
  updateCartUI();
}

// تحديث العربة
function updateCartUI(){
  cartLines.innerHTML='';
  let total=0;
  cart.forEach((c,i)=>{
    total+=c.price*c.qty;
    const line=document.createElement('div');
    line.className='cart-line';
    line.innerHTML=`
      <div>${c.name} (${c.qty}×${c.price})</div>
      <div>${c.price*c.qty} دج <button onclick="removeFromCart(${i})">حذف</button></div>`;
    cartLines.appendChild(line);
  });
  totalPriceEl.textContent=total+' دج';
  totalField.value=total;
  orderField.value=cart.map(c=>`${c.name} - ${c.qty} × ${c.price} دج`).join('\n');
}
function removeFromCart(i){
  cart.splice(i,1);
  updateCartUI();
}

// إرسال الفورم
function prepareAndSubmit(e){
  if(cart.length===0){
    alert("⚠️ العربة فارغة");
    e.preventDefault();return false;
  }
  return true;
}

// البحث
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase();
  renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
});

// أزرار
refreshBtn.addEventListener('click',loadProducts);
clearCartBtn.addEventListener('click',()=>{cart=[];updateCartUI();});

// تحميل أولي
loadProducts();