function orderPlacedOnline() {
  var nameOnCard = document.getElementById("name-on-card").value;
  var cardNumber = document.getElementById("card-number").value;
  var expDate = document.getElementById("exp-date").value;
  var cvv = document.getElementById("cvv").value;
  var errors = document.getElementById("checkout-form-errors");

  if (nameOnCard == 0 || cardNumber == 0 || expDate == 0 || cvv == 0) {
    errors.innerHTML = `Fields can't remain empty`;
  } else {
    errors.style.display = "none";
    var toastHTML =
      '<span>Order Placed Successfully</span> <i class="material-icons">check_circle</i>';
    M.toast({ html: toastHTML });
    console.log("else statement");
    window.location = "index.html";
  }
}

function onlinePayChecked() {
  document.getElementById("online-pay-label").style.color = "#000000";
  document.getElementById("cod-pay-label").style.color = "#9e9e9e";
  document.getElementById("form-card-payment").style.display = "block";
  document.getElementById("form-cod-payment").style.display = "none";
}
function codChecked() {
  document.getElementById("online-pay-label").style.color = "#9e9e9e";
  document.getElementById("cod-pay-label").style.color = "#000000";
  document.getElementById("form-card-payment").style.display = "none";
  document.getElementById("form-cod-payment").style.display = "block";
}

// function orderPlacedCod() {
//   // downloadInvoice();
//   var toastHTML =
//     '<span>Order Placed Successfully</span>&nbsp;&nbsp; <i class="material-icons">check_circle</i>';
//   M.toast({ html: toastHTML });
//   window.location = "index.html";
// }

function orderPlacedCod() {
  var toastHTML =
    '<span>Order Placed Successfully</span>&nbsp;&nbsp; <i class="material-icons">check_circle</i>';
  M.toast({ html: toastHTML });

  // Generate and download invoice
  generateOrderInvoice();

  // Redirect after a short delay
  setTimeout(() => {
    window.location = "index.html";
  }, 2000);
}

function generateOrderInvoice() {
  try {
    // Ensure jsPDF is available
    if (!window.jspdf) {
      console.error("jsPDF library not loaded.");
      alert("Error: Unable to generate PDF. Please try again.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Generate Unique Order ID
    const orderId = `ORDER-${Date.now()}`;

    // Get Current Date
    const currentDate = new Date().toLocaleDateString();

    // Fetch User Data
    const userEmail = firebase.auth().currentUser?.email || "Not Provided";

    // Fetch Cart Items
    const items = document.querySelectorAll(".checkoutCart tr");
    let yPosition = 60;
    let totalAmount = 0;
    let itemDetails = "";

    items.forEach((item, index) => {
      const name = item.children[1].textContent;
      const price = parseFloat(
        item.children[2].textContent.replace("₹", "").trim()
      );
      totalAmount += price;

      itemDetails += `${name} - 1 x ₹${price} = ₹${price}\n`;
    });

    // Invoice Content
    doc.setFontSize(12);
    doc.text("HONEYBADGER- ORDER INVOICE", 10, 10);
    doc.text("------------------------------------------", 10, 15);
    doc.text(`Order ID: ${orderId}`, 10, 20);
    doc.text(`Date: ${currentDate}`, 10, 25);
    doc.text(`Customer: ${userEmail}`, 10, 30);
    doc.text("------------------------------------------", 10, 35);
    doc.text("ITEMS:", 10, 40);

    let y = 45;
    items.forEach((item, index) => {
      const name = item.children[1].textContent;
      const price = parseFloat(
        item.children[2].textContent.replace("₹", "").trim()
      );
      doc.text(`${index + 1}. ${name} - 1 x ₹${price} = ₹${price}`, 10, y);
      y += 10;
    });

    doc.text("------------------------------------------", 10, y);
    y += 5;
    doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 10, y);
    y += 5;
    doc.text(`Credits Used: ₹0.00`, 10, y);
    y += 5;
    doc.text(`Credits Earned: ₹${(totalAmount * 0.012).toFixed(2)}`, 10, y);
    y += 5;
    doc.text(`Final Amount: ₹${totalAmount.toFixed(2)}`, 10, y);
    y += 5;
    doc.text(`Payment Method: CASH`, 10, y);
    y += 5;
    doc.text("------------------------------------------", 10, y);
    y += 5;
    doc.text("Contact: support@honeybadger.com", 10, y);
    y += 5;
    doc.text("Website: www.honeybadger.com", 10, y);
    y += 5;
    doc.text("Thank you for shopping with us!", 10, y);
    y += 5;
    doc.text("------------------------------------------", 10, y);

    // Save the PDF with Order ID
    doc.save(`Invoice_${orderId}.pdf`);
  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Error generating invoice. Please try again.");
  }
}
