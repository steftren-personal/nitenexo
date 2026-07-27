// Shared branded HTML shell for transactional emails — table-based markup so
// it renders consistently in Outlook/older clients. Mirrors the visual
// language in email-templates/termin-bestaetigung.html.

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderEmailShell({
  preheader,
  eyebrow,
  heading,
  bodyHtml,
  cardHtml,
  ctaLabel,
  ctaHref,
  footerNote,
}: {
  preheader: string;
  eyebrow: string;
  heading: string;
  bodyHtml: string;
  cardHtml?: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
}) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f8; font-family:'Helvetica Neue', Arial, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2f8; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 12px 32px rgba(21,15,35,0.12);">

          <tr>
            <td style="background-color:#150f23; padding:36px 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">
                    Nite<span style="color:#c2ef4e;">Nexo</span>
                  </td>
                </tr>
              </table>
              <div style="height:3px; width:48px; background-color:#c2ef4e; border-radius:2px; margin-top:16px;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 8px;">
              <p style="margin:0 0 8px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6a5fc1;">
                ${escapeHtml(eyebrow)}
              </p>
              <h1 style="margin:0 0 16px; font-size:26px; line-height:1.3; color:#150f23;">
                ${escapeHtml(heading)}
              </h1>
              <div style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#43395c;">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          ${
            cardHtml
              ? `<tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5fb; border:1px solid #e4ddf2; border-radius:14px;">
                <tr>
                  <td style="padding:20px 24px;">
                    ${cardHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          ${
            ctaLabel && ctaHref
              ? `<tr>
            <td style="padding:0 40px 36px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#c2ef4e; border-radius:10px;">
                    <a href="${ctaHref}" style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:#150f23; text-decoration:none;">
                      ${escapeHtml(ctaLabel)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:#ece7f6;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px 36px;">
              ${footerNote ? `<p style="margin:0 0 4px; font-size:13px; color:#79628c;">${escapeHtml(footerNote)}</p>` : ""}
              <p style="margin:0; font-size:13px; color:#79628c;">
                NiteNexo Solutions · Schumanngasse 9/13, 1180 Wien · <a href="mailto:stef.tren@gmail.com" style="color:#6a5fc1; text-decoration:none;">stef.tren@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}