// ✅ تهيئة EmailJS
(function(){
  emailjs.init("Rh0587UVj7X-V-Q-k");
})();

let cart = [];
let products = JSON.parse(localStorage.getItem("products") || "[]");
let orders = JSON.parse(localStorage.getItem("orders") || "[]");
let adminPwd = localStorage.getItem("adminPwd") || "admin123";

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const adminPanel = document.getElementById("adminPanel");
const adminProducts = document.getElementById("adminProducts");
const ordersList = document.getElementById("ordersList");

// 📦 عرض المنتجات
function renderProducts(){
  productList.innerHTML = "";
  products.forEach((p,i)=>{
    let div = document.createElement("div");
    div.className="product";
    div.innerHTML = `
      <img src="${p.image}" alt="">
      <div class="info">
        <b>${p.name}</b>
        <span>${p.price} دج</span>
      </div>
      <button class="btn" onclick="addToCart(${i})">➕</button>
    `;
    productList.appendChild(div);
  });
  renderAdminProducts();
}
function renderAdminProducts(){
  adminProducts.innerHTML="";
  products.forEach((p,i)=>{
    let d=document.createElement("div");
    d.className="product";
    d.innerHTML=`<b>${p.name}</b> - ${p.price} دج 
    <button class="btn danger" onclick="deleteProduct(${i})">حذف</button>`;
    adminProducts.appendChild(d);
  });
}

// 🛒 العربة
function addToCart(i){
  cart.push(products[i]);
  renderCart();
}
function renderCart(){
  cartItems.innerHTML="";
  let total=0;
  cart.forEach((c,i)=>{
    total+=Number(c.price);
    let d=document.createElement("div");
    d.textContent=`${c.name} - ${c.price} دج`;
    cartItems.appendChild(d);
  });
  totalPrice.textContent=total;
}

// ✉️ إرسال الطلب
function submitOrder(){
  let name=document.getElementById("userName").value;
  let email=document.getElementById("userEmail").value;
  let phone=document.getElementById("userPhone").value;
  if(!name || !email || !phone || cart.length===0){
    return alert("⚠️ املأ جميع البيانات وأضف منتجات.");
  }

  let orderDetails=cart.map(c=>`${c.name} - ${c.price} دج`).join("\n");

  emailjs.send("service_ena6hao","template_664ej1s",{
    user_name:name,
    user_email:email,
    user_phone:phone,
    order_list:orderDetails,
    total_price:totalPrice.textContent
  }).then(()=>{
    alert("✅ الطلب توصّل بنجاح!");
    orders.push({name,email,phone,items:cart,total:totalPrice.textContent});
    localStorage.setItem("orders",JSON.stringify(orders));
    cart=[];
    renderCart();
    renderOrders();
  },err=>{
    alert("❌ خطأ: "+JSON.stringify(err));
  });
}

// 📋 عرض الطلبات
function renderOrders(){
  ordersList.innerHTML="";
  orders.forEach(o=>{
    let div=document.createElement("div");
    div.className="order";
    div.innerHTML=`<b>${o.name}</b> - ${o.total} دج <div class="meta">${o.items.length} منتجات</div>`;
    ordersList.appendChild(div);
  });
}

// ➕ إضافة منتج
document.getElementById("btn-add-product").onclick=function(){
  let n=document.getElementById("prodName").value;
  let p=document.getElementById("prodPrice").value;
  let img=document.getElementById("prodImage").value;
  if(!n||!p||!img) return;
  products.push({name:n,price:p,image:img});
  localStorage.setItem("products",JSON.stringify(products));
  renderProducts();
};

// ❌ حذف منتج
function deleteProduct(i){
  products.splice(i,1);
  localStorage.setItem("products",JSON.stringify(products));
  renderProducts();
}

// 🗑️ حذف الطلبات
document.getElementById("btn-clear-orders").onclick=function(){
  if(confirm("حذف جميع الطلبات؟")){
    orders=[];
    localStorage.setItem("orders","[]");
    renderOrders();
  }
};

// 🔑 إدارة الأدمن
document.getElementById("btn-open-admin").onclick=function(){
  document.getElementById("loginDialog").showModal();
};
document.getElementById("loginCancel").onclick=function(){
  document.getElementById("loginDialog").close();
};
document.getElementById("loginSubmit").onclick=function(){
  let pwd=document.getElementById("loginPwd").value;
  if(pwd===adminPwd){
    adminPanel.classList.remove("hidden");
    document.getElementById("btn-logout-admin").classList.remove("hidden");
    document.getElementById("btn-open-admin").classList.add("hidden");
    document.getElementById("loginDialog").close();
  } else {
    alert("❌ كلمة المرور خاطئة");
  }
};
document.getElementById("btn-logout-admin").onclick=function(){
  adminPanel.classList.add("hidden");
  this.classList.add("hidden");
  document.getElementById("btn-open-admin").classList.remove("hidden");
};
document.getElementById("btn-change-pwd").onclick=function(){
  let old=document.getElementById("adminOldPwd").value;
  let nw=document.getElementById("adminNewPwd").value;
  if(old===adminPwd && nw){
    adminPwd=nw;
    localStorage.setItem("adminPwd",nw);
    alert("✅ تم تغيير كلمة المرور");
  } else alert("❌ خطأ في كلمة المرور");
};

// 📌 زر إرسال
document.getElementById("btn-send-order").onclick=submitOrder;

// 🔄 تحميل البيانات
renderProducts();
renderCart();
renderOrders();