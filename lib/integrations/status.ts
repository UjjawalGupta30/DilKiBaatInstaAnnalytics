export type IntegrationStatus = {
  configured: boolean;
  label: string;
  detail: string;
};

export function getIntegrationStatuses() {
  const instagramConfigured = Boolean(
    process.env.META_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID && process.env.META_GRAPH_API_VERSION,
  );
  const whatsappConfigured = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_RECIPIENT,
  );
  const redditConfigured = Boolean(
    process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET,
  );

  return {
    instagram: {
      configured: instagramConfigured,
      label: instagramConfigured ? "Configured" : "Pending",
      detail: instagramConfigured ? "Meta credentials detected" : "Meta developer setup required",
    },
    whatsapp: {
      configured: whatsappConfigured,
      label: whatsappConfigured ? "Configured" : "Pending",
      detail: whatsappConfigured ? "Business Cloud credentials detected" : "WhatsApp setup required",
    },
    reddit: {
      configured: redditConfigured,
      label: redditConfigured ? "Configured" : "Pending",
      detail: redditConfigured ? "Reddit credentials detected" : "Developer access required",
    },
  } satisfies Record<string, IntegrationStatus>;
}
