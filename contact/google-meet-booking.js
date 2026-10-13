/* Upgrade the Meet enquiry button only after the owner provides a real
 * Google Calendar booking-page URL. Never invent a meeting room or appointment.
 */
(() => {
  "use strict";
  const button = document.getElementById("google-meet-action");
  const status = document.getElementById("google-meet-status");
  if (!button) return;

  function validBookingUrl(raw) {
    if (typeof raw !== "string" || raw.length > 1500) return false;
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.username || url.password) return false;
      if (url.hostname === "calendar.app.google") return url.pathname.length > 4;
      if (url.hostname === "calendar.google.com") {
        return /^\/calendar\/(?:u\/\d+\/)?appointments\/schedules\/[A-Za-z0-9_-]+/.test(url.pathname);
      }
      return false;
    } catch { return false; }
  }

  async function setup() {
    try {
      const response = await fetch("/contact/google-meet-booking.json", {cache:"no-store"});
      if (!response.ok) return;
      const config = await response.json();
      if (config.schema_version !== 1 || !validBookingUrl(config.google_meet_booking_url)) return;
      button.href = config.google_meet_booking_url;
      button.textContent = "Book Google Meet Time ↗";
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      if (status) status.textContent = "Choose an available time on our official Google Calendar booking page. You will receive a booking confirmation.";
    } catch {
      // Keep the native enquiry link usable when offline or unconfigured.
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, {once:true});
  else setup();
})();
