export interface EngineOption {
  size: string;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  layout: "I3" | "I4" | "I6" | "V6" | "V8" | "Electric";
  trims: string[];
}

export interface VehicleModelOption {
  years: [number, number];
  engines: EngineOption[];
}

export type VehicleCatalog = Record<string, Record<string, VehicleModelOption>>;

export const vehicleCatalog: VehicleCatalog = {
  Toyota: {
    "Land Cruiser": {
      years: [2008, 2026],
      engines: [
        { size: "4.0L", fuel: "Petrol", layout: "V6", trims: ["EXR", "GXR", "VXR"] },
        { size: "3.5L", fuel: "Petrol", layout: "V6", trims: ["GXR", "VXR", "GR Sport"] },
        { size: "4.5L", fuel: "Diesel", layout: "V8", trims: ["GXR", "VXR"] },
      ],
    },
    Prado: {
      years: [2010, 2026],
      engines: [
        { size: "2.7L", fuel: "Petrol", layout: "I4", trims: ["TX", "TXL"] },
        { size: "4.0L", fuel: "Petrol", layout: "V6", trims: ["GXR", "VXR"] },
        { size: "2.8L", fuel: "Diesel", layout: "I4", trims: ["TXL", "Adventure"] },
      ],
    },
    Camry: {
      years: [2012, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["S", "SE", "Grande"] },
        { size: "2.5L", fuel: "Hybrid", layout: "I4", trims: ["HEV", "Grande HEV"] },
      ],
    },
  },
  Nissan: {
    Patrol: {
      years: [2010, 2026],
      engines: [
        { size: "4.0L", fuel: "Petrol", layout: "V6", trims: ["XE", "SE", "LE"] },
        { size: "5.6L", fuel: "Petrol", layout: "V8", trims: ["SE", "LE", "Nismo"] },
        { size: "3.8L", fuel: "Petrol", layout: "V6", trims: ["SE", "LE"] },
      ],
    },
    "X-Trail": {
      years: [2014, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["S", "SV", "SL"] },
        { size: "1.5L", fuel: "Hybrid", layout: "I3", trims: ["e-Power S", "e-Power SL"] },
      ],
    },
    Altima: {
      years: [2013, 2026],
      engines: [{ size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["S", "SV", "SL"] }],
    },
  },
  Lexus: {
    LX: {
      years: [2010, 2026],
      engines: [
        { size: "5.7L", fuel: "Petrol", layout: "V8", trims: ["Premier", "Platinum", "Black Edition"] },
        { size: "3.5L", fuel: "Petrol", layout: "V6", trims: ["LX 600", "F Sport"] },
        { size: "3.3L", fuel: "Hybrid", layout: "V6", trims: ["LX 700h"] },
      ],
    },
    RX: {
      years: [2010, 2026],
      engines: [
        { size: "3.5L", fuel: "Petrol", layout: "V6", trims: ["Premier", "F Sport"] },
        { size: "2.5L", fuel: "Hybrid", layout: "I4", trims: ["RX 350h", "RX 500h"] },
      ],
    },
    ES: {
      years: [2012, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["Premier", "Platinum"] },
        { size: "2.5L", fuel: "Hybrid", layout: "I4", trims: ["ES 300h"] },
      ],
    },
  },
  "Land Rover": {
    "Range Rover Sport": {
      years: [2010, 2026],
      engines: [
        { size: "3.0L", fuel: "Petrol", layout: "I6", trims: ["SE", "HSE", "Dynamic"] },
        { size: "3.0L", fuel: "Diesel", layout: "I6", trims: ["SE", "HSE"] },
        { size: "5.0L", fuel: "Petrol", layout: "V8", trims: ["Autobiography", "SVR"] },
      ],
    },
    Defender: {
      years: [2020, 2026],
      engines: [
        { size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["S", "SE"] },
        { size: "3.0L", fuel: "Petrol", layout: "I6", trims: ["X-Dynamic", "X"] },
        { size: "5.0L", fuel: "Petrol", layout: "V8", trims: ["V8"] },
      ],
    },
  },
  Hyundai: {
    Tucson: {
      years: [2011, 2026],
      engines: [
        { size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["Smart", "Comfort", "Premium"] },
        { size: "1.6L", fuel: "Hybrid", layout: "I4", trims: ["HEV", "N Line HEV"] },
      ],
    },
    "Santa Fe": {
      years: [2012, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["Smart", "Comfort", "Calligraphy"] },
        { size: "1.6L", fuel: "Hybrid", layout: "I4", trims: ["HEV", "Calligraphy HEV"] },
      ],
    },
    Elantra: {
      years: [2012, 2026],
      engines: [{ size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["Smart", "Comfort", "N Line"] }],
    },
  },
  Kia: {
    Sportage: {
      years: [2011, 2026],
      engines: [
        { size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["LX", "EX", "GT-Line"] },
        { size: "1.6L", fuel: "Hybrid", layout: "I4", trims: ["HEV", "GT-Line HEV"] },
      ],
    },
    Sorento: {
      years: [2012, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["LX", "EX", "SX"] },
        { size: "1.6L", fuel: "Hybrid", layout: "I4", trims: ["HEV", "SX HEV"] },
      ],
    },
  },
  Mitsubishi: {
    Pajero: {
      years: [2008, 2021],
      engines: [
        { size: "3.5L", fuel: "Petrol", layout: "V6", trims: ["GLS", "Signature"] },
        { size: "3.8L", fuel: "Petrol", layout: "V6", trims: ["GLS", "Platinum"] },
        { size: "3.2L", fuel: "Diesel", layout: "I4", trims: ["GLS"] },
      ],
    },
    Outlander: {
      years: [2013, 2026],
      engines: [
        { size: "2.5L", fuel: "Petrol", layout: "I4", trims: ["GLX", "GLS"] },
        { size: "2.4L", fuel: "Hybrid", layout: "I4", trims: ["PHEV"] },
      ],
    },
  },
  Ford: {
    "F-150": {
      years: [2010, 2026],
      engines: [
        { size: "3.5L", fuel: "Petrol", layout: "V6", trims: ["XLT", "Lariat", "Raptor"] },
        { size: "5.0L", fuel: "Petrol", layout: "V8", trims: ["XLT", "Lariat"] },
        { size: "3.5L", fuel: "Hybrid", layout: "V6", trims: ["PowerBoost"] },
      ],
    },
    Explorer: {
      years: [2011, 2026],
      engines: [
        { size: "2.3L", fuel: "Petrol", layout: "I4", trims: ["XLT", "Limited"] },
        { size: "3.0L", fuel: "Petrol", layout: "V6", trims: ["ST", "Platinum"] },
      ],
    },
  },
  BMW: {
    X5: {
      years: [2010, 2026],
      engines: [
        { size: "3.0L", fuel: "Petrol", layout: "I6", trims: ["xDrive40i", "M Sport"] },
        { size: "3.0L", fuel: "Diesel", layout: "I6", trims: ["xDrive30d"] },
        { size: "4.4L", fuel: "Petrol", layout: "V8", trims: ["M60i", "X5 M"] },
      ],
    },
    X3: {
      years: [2011, 2026],
      engines: [
        { size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["xDrive20i", "xDrive30i"] },
        { size: "3.0L", fuel: "Petrol", layout: "I6", trims: ["M40i"] },
      ],
    },
  },
  "Mercedes-Benz": {
    "G-Class": {
      years: [2010, 2026],
      engines: [
        { size: "4.0L", fuel: "Petrol", layout: "V8", trims: ["G 500", "AMG G 63"] },
        { size: "3.0L", fuel: "Diesel", layout: "I6", trims: ["G 400d"] },
      ],
    },
    GLE: {
      years: [2015, 2026],
      engines: [
        { size: "2.0L", fuel: "Petrol", layout: "I4", trims: ["GLE 300", "AMG Line"] },
        { size: "3.0L", fuel: "Petrol", layout: "I6", trims: ["GLE 450", "AMG GLE 53"] },
        { size: "4.0L", fuel: "Petrol", layout: "V8", trims: ["AMG GLE 63"] },
      ],
    },
  },
  Tesla: {
    "Model Y": {
      years: [2020, 2026],
      engines: [
        { size: "Electric", fuel: "Electric", layout: "Electric", trims: ["Rear-Wheel Drive", "Long Range", "Performance"] },
      ],
    },
    "Model 3": {
      years: [2017, 2026],
      engines: [
        { size: "Electric", fuel: "Electric", layout: "Electric", trims: ["Rear-Wheel Drive", "Long Range", "Performance"] },
      ],
    },
  },
};

export const vehicleMakes = Object.keys(vehicleCatalog);
