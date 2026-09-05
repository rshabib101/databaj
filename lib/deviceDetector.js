/**
 * Utility to extract client device, network, IP, browser, location, and session information.
 */
export function extractClientMeta(request, clientPayload = {}) {
  const headers = request.headers;

  // 1. IP Address extraction
  const cfConnectingIp = headers.get('cf-connecting-ip');
  const xRealIp = headers.get('x-real-ip');
  const forwardedFor = headers.get('x-forwarded-for');
  const xClientIp = headers.get('x-client-ip');

  let ip = cfConnectingIp || xRealIp || xClientIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '') || request.ip || '';
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.includes('::ffff:127.0.0.1')) {
    ip = '127.0.0.1 (Localhost / Development)';
  }

  // 2. User-Agent Parsing
  const userAgent = headers.get('user-agent') || '';
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Desktop';

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }

  // Browser detection
  if (/edg\/([\d.]+)/i.test(userAgent)) {
    const v = userAgent.match(/edg\/([\d.]+)/i);
    browser = `Microsoft Edge ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/opr\/([\d.]+)|opera/i.test(userAgent)) {
    const v = userAgent.match(/opr\/([\d.]+)/i);
    browser = `Opera ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/chrome\/([\d.]+)/i.test(userAgent) && !/edg/i.test(userAgent)) {
    const v = userAgent.match(/chrome\/([\d.]+)/i);
    browser = `Google Chrome ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/firefox\/([\d.]+)/i.test(userAgent)) {
    const v = userAgent.match(/firefox\/([\d.]+)/i);
    browser = `Mozilla Firefox ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/safari\/([\d.]+)/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    const v = userAgent.match(/version\/([\d.]+)/i);
    browser = `Apple Safari ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/msie|trident/i.test(userAgent)) {
    browser = 'Internet Explorer';
  }

  // OS detection
  if (/windows nt 10\.0/i.test(userAgent)) {
    os = 'Windows 10 / 11';
  } else if (/windows nt 6\.3/i.test(userAgent)) {
    os = 'Windows 8.1';
  } else if (/windows nt 6\.2/i.test(userAgent)) {
    os = 'Windows 8';
  } else if (/windows nt 6\.1/i.test(userAgent)) {
    os = 'Windows 7';
  } else if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/android ([\d.]+)/i.test(userAgent)) {
    const v = userAgent.match(/android ([\d.]+)/i);
    os = `Android ${v ? v[1].split('.')[0] : ''}`.trim();
  } else if (/iphone os ([\d_]+)/i.test(userAgent)) {
    const v = userAgent.match(/iphone os ([\d_]+)/i);
    os = `iOS ${v ? v[1].replace(/_/g, '.') : ''}`.trim();
  } else if (/ipad.*os ([\d_]+)/i.test(userAgent)) {
    os = 'iPadOS';
  } else if (/mac os x ([\d_]+)/i.test(userAgent)) {
    const v = userAgent.match(/mac os x ([\d_]+)/i);
    os = `macOS ${v ? v[1].replace(/_/g, '.') : ''}`.trim();
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  }

  // 3. Location & City extraction from Cloudflare / Vercel headers or fallback
  let city = headers.get('x-vercel-ip-city') || 
             headers.get('cf-ipcity') || 
             headers.get('x-forwarded-city') || 
             clientPayload.city || 
             '';
  let country = headers.get('x-vercel-ip-country') || 
                headers.get('cf-ipcountry') || 
                headers.get('x-forwarded-country') || 
                clientPayload.country || 
                '';
  let region = headers.get('x-vercel-ip-country-region') || 
               headers.get('cf-region') || 
               '';
  let timezone = headers.get('x-vercel-ip-timezone') || 
                 headers.get('cf-timezone') || 
                 clientPayload.timezone || 
                 '';

  // Decode URI encoded city names (Vercel encodes some names)
  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      // keep as is
    }
  }

  // Fallback location hints from timezone if city is not set
  if (!city && timezone) {
    if (timezone.includes('Dhaka')) {
      city = 'Dhaka';
      if (!country) country = 'BD';
    } else if (timezone.includes('/')) {
      city = timezone.split('/')[1]?.replace(/_/g, ' ') || '';
    }
  }

  // 4. Cookies & Session hints
  const rawCookies = headers.get('cookie') || '';
  const cookieNames = [];
  if (rawCookies) {
    rawCookies.split(';').forEach((c) => {
      const name = c.split('=')[0]?.trim();
      if (name) cookieNames.push(name);
    });
  }

  const hasAuthTokenCookie = !!request.cookies?.get('databaj_token') || cookieNames.includes('databaj_token');

  // 5. Language & Screen
  const acceptLang = headers.get('accept-language');
  const language = clientPayload.language || (acceptLang ? acceptLang.split(',')[0].trim() : '');
  const screenResolution = clientPayload.screenResolution || '';

  return {
    ip,
    device,
    browser,
    os,
    city,
    country,
    region,
    timezone,
    language,
    screenResolution,
    userAgent,
    cookies: {
      hasAuthToken: hasAuthTokenCookie,
      cookieNames,
      cookieCount: cookieNames.length,
      cookieEnabled: clientPayload.cookieEnabled ?? true,
    },
    capturedAt: new Date(),
  };
}
