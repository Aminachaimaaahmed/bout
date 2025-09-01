(function(){
  // Public Key
  emailjs.init("Rh0587UVj7X-V-Q-k"); 
})();

function submitOrder(){
  let name = document.getElementById("userName").value;
  let email = document.getElementById("userEmail").value;
  let phone = document.getElementById("userPhone").value;
  let orderDetails = cart.map(c => `${c.name} - ${c.price} DA`).join("\n");

  emailjs.send(
    "service_ena6hao",     // ✅ Service ID
    "template_664ej1s",    // ✅ Template ID
    {
      user_name: name,
      user_email: email,
      user_phone: phone,
      order_list: orderDetails,
      total_price: document.getElementById("totalPrice").innerText
    }
  )
  .then(() => {
    alert("✅ الطلب توصّل لإيميلك بنجاح!");
    cart = [];
    renderCart();
  }, (err) => {
    alert("❌ خطأ: " + JSON.stringify(err));
  });
}