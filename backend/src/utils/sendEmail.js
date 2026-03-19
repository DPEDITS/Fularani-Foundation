const sendEmail = async (options) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Call Resend's HTTP REST API to bypass Render's SMTP firewall
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "Fularani Foundation <noreply@kb.fularanifoundation.org>", // Must be a verified domain on Resend
      to: options.email,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Resend API Error:", errorData);
    throw new Error(errorData.message || "Failed to send email with Resend");
  }

  const data = await response.json();
  return data;
};

export default sendEmail;
