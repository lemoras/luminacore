/**
 * LuminaCore — Cloudflare Worker (ornek)
 *
 * Site Apache origin + Cloudflare Worker ile servis ediliyor. Guvenlik
 * basliklarinin GARANTI uygulanmasi icin onlari burada (edge) set ediyoruz.
 * CSP ihlal raporlarini da /csp-report ucundan bu Worker topluyor.
 *
 * Mevcut Worker'in varsa, asagidaki SECURITY_HEADERS ve /csp-report blogunu
 * kendi fetch handler'ina entegre et.
 */

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; " +
    "frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; " +
    "report-uri https://luminacore.onuryasar.org/csp-report; report-to csp-endpoint",
  "Reporting-Endpoints": 'csp-endpoint="https://luminacore.onuryasar.org/csp-report"',
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), " +
    "geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1) CSP ihlal raporlarini topla
    if (url.pathname === "/csp-report" && request.method === "POST") {
      try {
        const body = await request.text();
        console.log("CSP-REPORT", body);
      } catch (e) {}
      return new Response(null, { status: 204 });
    }

    // 2) Origin'den (Apache) cek ve guvenlik basliklarini ekle
    const response = await fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
