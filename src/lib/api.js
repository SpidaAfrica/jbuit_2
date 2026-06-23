/**
 * JBUIT API client.
 * Handles the CSRF handshake and talks to the secured PHP backend.
 *
 * Set VITE_API_BASE in your .env (e.g. https://api.jbuit.com or
 * https://jbuit.com/backend/api). Defaults to "/backend/api" for same-origin.
 */

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  "/backend/api";

let csrfToken = null;

/** Fetch a CSRF token once and cache it (cookie is set HttpOnly by the server). */
async function getCsrf() {
  if (csrfToken) return csrfToken;
  const res = await fetch(`${API_BASE}/csrf.php`, {
    method: "GET",
    credentials: "include", // needed so the paired cookie is stored
  });
  if (!res.ok) throw new Error("Could not start a secure session.");
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

/** POST JSON to an endpoint with the CSRF header attached. */
async function postJson(path, payload) {
  const token = await getCsrf();
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token,
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }

  if (res.status === 419) {
    // token expired — clear and let caller retry once
    csrfToken = null;
  }

  return { status: res.status, ok: res.ok && data.ok !== false, data };
}

export const api = {
  /** Submit the contact form. */
  async submitLead({ name, email, message, company }) {
    return postJson("lead.php", { name, email, message, company });
  },
  /** Submit a course enrollment. */
  async enroll({ name, email, phone, plan, note, company }) {
    return postJson("enroll.php", { name, email, phone, plan, note, company });
  },
  /** Start a course payment — returns Paystack authorization_url to redirect to. */
  async courseInit({ name, email, company }) {
    return postJson("course-init.php", { name, email, company });
  },
  /** Verify a course payment after Paystack redirect — returns access token. */
  async courseVerify({ reference }) {
    return postJson("course-verify.php", { reference });
  },
};
