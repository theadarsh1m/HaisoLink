

async function run() {
  const res = await fetch('http://localhost:3000/api/inspect-db');
  const data = await res.json();
  
  const zones = new Set();
  data.areas.forEach((a: any) => {
    if (a.zone.name !== 'Default Region') zones.add(a.zoneId);
  });
  
  const zoneIds = Array.from(zones);
  console.log("Valid Zone IDs:", zoneIds.length);
  
  for (const sz of zoneIds) {
    for (const dz of zoneIds) {
      const hasStandard = data.rateCards.some((r: any) => r.sourceZoneId === sz && r.destinationZoneId === dz && r.orderType === 'STANDARD');
      const hasExpress = data.rateCards.some((r: any) => r.sourceZoneId === sz && r.destinationZoneId === dz && r.orderType === 'EXPRESS');
      if (!hasStandard || !hasExpress) {
        console.error(`MISSING RateCard for ${sz} -> ${dz}`);
      }
    }
  }
  console.log("Check complete.");
}
run();
