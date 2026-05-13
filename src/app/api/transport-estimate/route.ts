import { NextRequest, NextResponse } from 'next/server';

/**
 * Approximate transport-cost estimator (no external logistics integration).
 *
 * Logic:
 *  - We don't know exact GPS, so we use the first 3 digits of pincode as a
 *    coarse "region code" and look up centroid coordinates of major Indian
 *    pincode regions. For unknown regions we fall back to a flat estimate.
 *  - Distance = great-circle (Haversine) between centroids, in km.
 *  - Cost = base + per-km rate, with a minimum.
 *
 * This is intentionally simple — Phase 3 MVP. Can be swapped for Google
 * Distance Matrix API later by replacing the `pincodeToLatLng` helper.
 */

// Minimal centroid table for first-3-digit pincode groups (approx).
// Source: simplified geocentre of each Indian postal region.
const PINCODE_CENTROIDS: Record<string, [number, number]> = {
  // Gujarat (Rajkot HQ)
  '360': [22.3039, 70.8022], // Rajkot
  '361': [22.4707, 70.0577],
  '362': [21.5222, 70.4579],
  '363': [22.7196, 71.6369],
  '364': [21.7645, 72.1519],
  '380': [23.0225, 72.5714], // Ahmedabad
  '382': [23.2156, 72.6369],
  '390': [22.3072, 73.1812], // Vadodara
  '395': [21.1702, 72.8311], // Surat

  // Maharashtra
  '400': [19.076, 72.8777],  // Mumbai
  '411': [18.5204, 73.8567], // Pune
  '440': [21.1458, 79.0882], // Nagpur

  // Delhi NCR
  '110': [28.6139, 77.209],  // Delhi
  '120': [28.4595, 77.0266], // Gurgaon
  '201': [28.5355, 77.391],  // Noida

  // Karnataka
  '560': [12.9716, 77.5946], // Bangalore
  '570': [12.2958, 76.6394], // Mysore

  // Tamil Nadu
  '600': [13.0827, 80.2707], // Chennai
  '641': [11.0168, 76.9558], // Coimbatore

  // Telangana / AP
  '500': [17.385, 78.4867],  // Hyderabad
  '530': [17.6868, 83.2185], // Visakhapatnam

  // West Bengal
  '700': [22.5726, 88.3639], // Kolkata

  // Kerala
  '682': [9.9312, 76.2673],  // Kochi
  '695': [8.5241, 76.9366],  // Trivandrum

  // Rajasthan
  '302': [26.9124, 75.7873], // Jaipur
  '342': [26.2389, 73.0243], // Jodhpur

  // MP / UP
  '462': [23.2599, 77.4126], // Bhopal
  '226': [26.8467, 80.9462], // Lucknow
  '208': [26.4499, 80.3319], // Kanpur

  // Punjab/Haryana
  '141': [30.901, 75.8573],  // Ludhiana
  '160': [30.7333, 76.7794], // Chandigarh

  // Bihar / Odisha
  '800': [25.5941, 85.1376], // Patna
  '751': [20.2961, 85.8245], // Bhubaneswar
};

function pincodeToLatLng(pin: string): [number, number] | null {
  if (!/^\d{6}$/.test(pin)) return null;
  const prefix = pin.slice(0, 3);
  return PINCODE_CENTROIDS[prefix] || null;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

interface Estimate {
  fromPincode: string;
  toPincode: string;
  distanceKm: number;
  estCostMin: number;
  estCostMax: number;
  estDeliveryDays: number;
  note: string;
  approximate: true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get('from') || '360003').trim();
  const to = (searchParams.get('to') || '').trim();
  const weightKg = parseFloat(searchParams.get('weight') || '100');

  if (!to) {
    return NextResponse.json({ success: false, error: 'Delivery pincode required' }, { status: 400 });
  }

  const fromCoord = pincodeToLatLng(from) || PINCODE_CENTROIDS['360'];
  const toCoord = pincodeToLatLng(to);

  if (!toCoord) {
    return NextResponse.json({
      success: true,
      data: {
        fromPincode: from,
        toPincode: to,
        distanceKm: 0,
        estCostMin: 0,
        estCostMax: 0,
        estDeliveryDays: 0,
        note: 'We could not auto-estimate for this pincode. Please contact us on WhatsApp for a precise quote.',
        approximate: true,
      } satisfies Estimate,
    });
  }

  const distance = Math.round(haversineKm(fromCoord, toCoord));
  // Road distance ~1.25x great-circle for India
  const roadKm = Math.round(distance * 1.25);

  // Base cost model
  // - Per-tonne-per-km baseline ~ ₹3.5 (full-truck, large shipments).
  // - Small parcels are charged via min freight.
  const tonnes = Math.max(0.05, weightKg / 1000);
  const perKmRate = 3.5;
  const baseRange = roadKm * perKmRate * tonnes;
  const minCharge = Math.max(800, roadKm * 6); // typical min for surface freight
  const estCostMin = Math.max(minCharge, Math.round(baseRange));
  const estCostMax = Math.round(estCostMin * 1.4);

  // Delivery time: ~ 350 km/day surface + 1 day handling
  const days = Math.max(2, Math.ceil(roadKm / 350) + 1);

  return NextResponse.json({
    success: true,
    data: {
      fromPincode: from,
      toPincode: to,
      distanceKm: roadKm,
      estCostMin,
      estCostMax,
      estDeliveryDays: days,
      note: 'Approximate estimate based on surface freight, full-truck rates. Final cost depends on quantity, packaging and transporter — confirmed at order time.',
      approximate: true,
    } satisfies Estimate,
  });
}
