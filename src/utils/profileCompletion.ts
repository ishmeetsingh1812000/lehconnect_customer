type ProfileAddress = {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
};

type ProfileData = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: ProfileAddress | null;
};

const hasValue = (value?: string | null) => Boolean(value?.trim());

export const getProfileCompletion = (profile: ProfileData) => {
  const steps = [
    {
      key: "basic",
      label: "Basic Info",
      detail: "First and last name",
      complete: hasValue(profile.firstName) && hasValue(profile.lastName),
    },
    {
      key: "mobile",
      label: "Mobile Verified",
      detail: profile.phone || "Add a mobile number",
      complete: hasValue(profile.phone),
    },
    {
      key: "email",
      label: "Email Added",
      detail: profile.email || "Add an email address",
      complete: hasValue(profile.email),
    },
    {
      key: "address",
      label: "Saved Address",
      detail:
        profile.address?.city && profile.address?.pincode
          ? `${profile.address.city}, ${profile.address.pincode}`
          : "Add a complete address",
      complete:
        hasValue(profile.address?.street) &&
        hasValue(profile.address?.city) &&
        hasValue(profile.address?.state) &&
        hasValue(profile.address?.pincode) &&
        hasValue(profile.address?.country),
    },
  ];

  const completedSteps = steps.filter((step) => step.complete).length;

  return {
    steps,
    percentage: Math.round((completedSteps / steps.length) * 100),
  };
};
