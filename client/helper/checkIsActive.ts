const PREMIUM_ID = '6831be446c59cd4bad808bb5'

export const checkIsActive = (expiredAt: Date) => {
  if (!expiredAt) return false;

  const currentDate = new Date();
  return currentDate.getTime() < new Date(expiredAt)?.getTime();
}

export const isPremium = (user: any) => {
  if (!user) return false;
  const premium = user.services.find((service: any) => service._id === PREMIUM_ID);

  if (!premium) return false;
  return checkIsActive(premium?.expiredAt);
}
