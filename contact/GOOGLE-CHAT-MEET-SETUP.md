# Google Chat + Google Meet contact setup

The **AI Suraj Teach** website now offers:

1. **Google Chat**: a contact card on `/contact/` that opens the official Google Chat web app. The visitor can copy the verified business contact email `kamdevsuraj03@gmail.com`, select **New chat** in Google Chat, enter the address and send a direct-message request. This is NOT a fabricated direct-chat URL; a first-time external DM might need to be accepted and Google Chat access depends on both accounts' settings.
2. **Google Meet inquiry**: a clearly labeled **Request Google Meet Call** link that selects **Request a Google Meet video call** in the same Netlify contact form. The customer can give preferred day, time and timezone. The business owner receives the fields in Netlify Forms and the configured submission email notification, then emails a meeting invitation. This is **not** an automatically booked meeting.
3. **Direct Google Calendar appointment booking (optional)**: once the owner has created their own Google Calendar appointment schedule with **Google Meet video conferencing** enabled, add the resulting **public booking page URL** to `contact/google-meet-booking.json` as `google_meet_booking_url`. Only a valid URL on `calendar.google.com/calendar/appointments/schedules/...` or `calendar.app.google/...` upgrades the Meet CTA to `Book Google Meet Time` and opens the actual booking page. Invalid, unknown or missing URLs safely retain the contact form.

## Configure automatic Google Meet bookings (one-time)

- Sign in to your own Google account at https://calendar.google.com/
- Choose **Create → Appointment schedule**, select an appointment duration and the times when you are available.
- Under **Location and conferencing**, choose **Google Meet video conferencing**, then save.
- On the resulting appointment schedule choose **Share → Copy link** for the public booking page (usually a `calendar.app.google` or `calendar.google.com/calendar/appointments/schedules/` URL).
- Edit `contact/google-meet-booking.json` in your website repo, change `"google_meet_booking_url": null` to the actual **public** booking link (as a quoted JSON string), commit and deploy to Netlify.
- Visit `/contact/`, check that **Book Google Meet Time** opens the booking page, then try a test booking using an address you control. Verify the actual calendar invitation, meeting URL and time in your Google Calendar account.

Do **not** paste a random `meet.google.com/abc-defg-hij` room URL or a customer-specific/private invite as a permanent booking link. It may allow people to enter the wrong meeting, bypass availability and expose ongoing meetings. If a public booking page isn't available, the form fallback is the supported solution.

## Netlify email notification

Both Google Chat follow-up and Google Meet request use the already established **website-quote-request** Netlify form. Your notification to `kamdevsuraj03@gmail.com` should deliver Name, Email, Business Name, Project Details, Service and Preferred Meeting Time. Verify a test submission appears in Netlify's **Verified submissions** and in your Gmail inbox. Notification delivery is not guaranteed merely by code deployment.

## References

- Google Chat direct messages: https://support.google.com/chat/answer/7652736
- Google Calendar appointment schedules: https://support.google.com/calendar/answer/10729749
- Google Calendar booking pages: https://support.google.com/calendar/answer/11608416
