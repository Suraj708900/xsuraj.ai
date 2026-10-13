# Get every verified customer enquiry in kamdevsuraj03@gmail.com

The site uses native Netlify Forms, with **two separate lead-capture forms**:

| Website form | Name in Netlify dashboard | Data in submission |
| --- | --- | --- |
| /contact/ | `website-quote-request` | Service, name, email, business name, project details, privacy consent |
| /payment/ | `secure-payment-request` | Selected plan, customer name, email, business name, requirements, privacy acknowledgement |

Both forms include a hidden `form-name` field, spam honeypot, and the email subject:

`New AI Suraj Teach enquiry - %{formName} (#%{submissionId})`

## One-time activation in the Netlify UI (required)

**Adding code to GitHub does NOT enable emailed notifications by itself.** To send each verified new submission to `kamdevsuraj03@gmail.com`, an authorized team member must:

1. Sign into the Netlify account that owns **xsurajteach**: https://app.netlify.com/projects/xsurajteach
2. Open **Forms**. If shown **Enable form detection**, enable it and redeploy the latest `main` commit. New forms are detected only on deploy.
3. Verify `website-quote-request` and, if interested in plan leads too, `secure-payment-request` appear under Active forms.
4. Open **Forms > Submission notifications > Add notification**, select **Email notification**.
5. Enter the destination email **`kamdevsuraj03@gmail.com`**. For **Form**, choose **All forms** to receive leads from both the quote form and plan inquiry form, or select only `website-quote-request` for website quotes. **Save**.
6. If multiple rules already exist, check for duplicates to avoid duplicate emails.
7. In a separate private/incognito browser window visit https://xsurajteach.netlify.app/contact/?service=website, use an email address you control, fill in Name, Service, Business Name and Project Details with an obvious **TEST QUOTE** label, consent, and submit.
8. Confirm the test appears in the Netlify **Forms > website-quote-request > Verified submissions** page. Then check the recipient Gmail Inbox, Promotions and Spam folders for mail from `formresponses@netlify.com`.
9. Repeat with `/payment/` if its notifications are needed. Delete test submissions if you don't want the test customer data retained.

Important:
- The Thank You page only confirms the browser navigated to the next page. If the submission does not appear in **Verified submissions**, investigate form detection, deploy, form spam filtering and server handling before claiming an email was delivered.
- Notifications are sent for **verified submissions**, not every attempt or spam/bot post.
- Customers do **not** need Gmail. They submit the contact form; the verified lead is stored in Netlify and the business owner is notified by email.
- Keep form submissions free of secrets, payment-card or patient medical data.
- Make sure any Netlify plan's form usage limits are not exceeded.
- Do not expose email account credentials, Gmail app passwords, SMTP or API keys on public GitHub or in HTML.
- This setup does **not** change the PayPal setup and does not accept money.

Reference: https://docs.netlify.com/manage/forms/setup/ and https://docs.netlify.com/manage/forms/notifications/ and https://docs.netlify.com/manage/forms/submissions/
