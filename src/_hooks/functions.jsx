export const generateJWT = (val) => {
  const payload         = { val, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 };
  const encodedPayload  = btoa(JSON.stringify(payload));
  return `${encodedPayload}.ArcaneF22`;
};

export const JSN = (i, e) => {
    if (e != false) {
        try {
            return <pre style={{ fontSize: '11px' }}>{JSON.stringify(i, null, 2)}</pre>;
        } catch {
            return <pre style={{ fontSize: '11px', color: 'red' }}>Circular structure</pre>;
        }
    }
};

export const JSNParse = (input, fallback = []) => {
  try {
    if (input === null || input === undefined || input === '') return fallback;
    if (typeof input === 'object') return input;
    if (typeof input !== 'string') { input = String(input); }
    const parsed = JSON.parse(input);
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return parsed;
  } catch {
    return fallback;
  }
};


export const isZero = (i) => {
    const check = (val) => {
        const v = typeof val === 'string' ? val.trim() : val;
        return (
            v == 0 || 
            v == '0' || 
            v == '' || 
            v == null || 
            v == undefined || 
            (typeof v == 'number' && isNaN(v)) ||
            (typeof v == 'string' && v.length > 0 && isNaN(Number(v)))
        );
    };

    if (Array.isArray(i)) {
        return i.some(check);
    }

    return check(i);
};

export const isNull = (i, ii) => {
  const v = typeof i === 'string' ? i.trim() : i;

  if (
    v === '' ||
    v === null ||
    v === undefined ||
    ((ii === 'Num' || ii === 0) ? (v === 0 || isNaN(v)) : false)
  ) {
    return true;
  } else {
    return false;
  }

};

export const NumForce = (input, e = 2) => {
    const dec = e ?? 5;

    if (Array.isArray(input)) {
        return input.map(item => NumForce(item, dec));
    }

    const val = input ?? 0;
    const clean = String(val)
        .replace(/[^0-9.-]/g, '') 
        .replace(/(?!^)-/g, '')  
        .replace(/-+/g, '-')
        .replace(/\.(?=.*\.)/g, '');

    if (clean === '' || clean === '-' || isNaN(clean)) return 0;

    const num = parseFloat(clean);
    return Number.isFinite(num)
        ? parseFloat(num.toFixed(dec)).valueOf()
        : 0;
};

export const Money = (i,e) => {

    const newNdx    = NumForce(e) || 2
    const num       = NumForce(i);

    const hasDecimal = num % 1 !== 0;

    return num.toLocaleString('en-US', {
        minimumFractionDigits: hasDecimal ? newNdx : 0,
        maximumFractionDigits: newNdx,
    });

};

export const textCase = (i, e = 1) => {

  if (!i || typeof i !== 'string') return '';

  let str = i.trim();

  switch (e) {
    case 0: 
      return str.toLowerCase();

    case 1: 
      return str
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    case 2: 
      return str.toUpperCase();

    default:
      return str; 
  }
};

export const textSanitize = (i,e) => {

    if (!i || typeof i !== 'string') return '';

    let txt = String(i || '').replace(/[^a-zA-Z0-9$!#()%*@/'&\-+?,.\s]/g, '').replace(/\s+/g, ' ').trim(); 

    if( e == 0 ) txt = txt?.toLowerCase();
    if( e == 1 ) txt = txt?.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    if( e == 2 ) txt = txt?.toUpperCase();
    if( e == 3 ) txt = txt?.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());

    txt = txt.replace(/\b[Ii][Dd]\b/g, 'ID');

    return txt;

}

export const dateText = (i) => {
    const n = new Date(i)
    const o = { month: 'long', day: 'numeric', year: 'numeric' };
    const w = n.toLocaleDateString('en-US', o);
    return w;
}


export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    
    const lat_A = NumForce(lat1);
    const lat_B = NumForce(lat2);
    const lng_A = NumForce(lon1);
    const lng_B = NumForce(lon2);

    const R = 6371; // km

    const dLat = (lat_B - lat_A) * (Math.PI / 180);
    const dLon = (lng_B - lng_A) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat_A * (Math.PI / 180)) *
        Math.cos(lat_B * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return parseFloat(distance.toFixed(2)); // km to 2 decimal places
};
