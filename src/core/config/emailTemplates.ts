export const emailTemplates = {
  verification: {
    subject: 'Verify your email address for Rent Portal',
    template: 'email-verification',
    dynamicTemplateData: {
      appName: 'Rent Portal',
      supportEmail: 'support@rentportal.com',
      helpUrl: `${window.location.origin}/help`,
    }
  },
  // Add other email templates here
} as const;

export type EmailTemplateType = keyof typeof emailTemplates;

export const getEmailTemplate = (type: EmailTemplateType) => {
  return emailTemplates[type];
};
