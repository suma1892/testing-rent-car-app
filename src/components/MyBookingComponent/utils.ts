export const PAYMENT_STATUSES = {
  pending: ['PENDING', 'CHECKOUT', 'RECONFIRMATION'],
  failed: ['EXPIRED', 'FAILED', 'CANCELLED'],
  success: ['SUCCESS', 'PAID', 'COMPLETED', 'FINISHED'],
  hiddenPaymentButton: [
    'CHECKOUT',
    'PAID',
    'SUCCESS',
    'FAILED',
    'CANCELLED',
    'COMPLETED',
    'FINISHED',
    'REJECTED',
    'WAITING_APPROVAL_DELETE_ORDER',
    'WAITING_APPROVAL_UPDATE_ORDER_CUSTOMER',
    'REVIEWING_IDENTITY',
    'SEARCHING_FOR_DRIVER',
    'REQUEST_CANCEL'
  ],
  showNotification: ['RECONFIRMATION', 'REJECTED', 'CANCELLED'],
  showConfirmationButton: ['CHECKOUT', 'PAID'],
  hideVerifyIdentityButton: ['COMPLETED', 'FINISHED'],
};

export const paymentStatusStyle = (paymentStatus: string) => {
  if (PAYMENT_STATUSES.success.includes(paymentStatus))
    return {color: '#089827'};
  if (PAYMENT_STATUSES.pending.includes(paymentStatus)) return {color: 'gray'};
  if (PAYMENT_STATUSES.failed.includes(paymentStatus))
    return {color: '#CF0303'};

  if (paymentStatus === 'WAITING_APPROVAL_UPDATE_ORDER_CUSTOMER') {
    return {color: '#FF9900'};
  }

  if (paymentStatus === 'REVIEWING_IDENTITY') {
    return {color: '#FF9900'};
  }

  return null;
};
