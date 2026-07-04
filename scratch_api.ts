async function test() {
  const payload = {
    pickupLat: 19.9397283,
    pickupLng: 73.1511469,
    pickupName: "Surya",
    destLat: 20.714378,
    destLng: 76.8199682,
    destName: "Paras",
    orderType: "STANDARD",
    paymentType: "PREPAID",
    length: 20,
    width: 20,
    height: 20,
    actualWeight: 10
  };

  const res = await fetch("http://localhost:3000/api/orders/calculate-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}
test();
