// composables/useFormatter.js
export const useFormatter = () => {
  // 引入 i18n
  const { t } = useI18n();

  // 1. 业务状态映射
  const getStateName = (state) => {
    const map = {
      '-1': t('member.stateCancelled') || 'Cancelled',
      '0': t('member.statePendingPay') || 'Pending Pay',
      '1': t('member.statePendingUse') || 'To be Used',
      '2': t('member.stateUsed') || 'Used',
      '4': t('member.stateRefunded') || 'Refunded'
    };
    return map[String(state)] || t('member.stateUnknown') || 'Unknown';
  };

  // 2. 支付方式映射
  const getPayTypeName = (type) => {
    const map = {
      '1': t('member.payWechat') || 'WeChat',
      '2': t('member.payAlipay') || 'Alipay',
      '3': t('member.payBalance') || 'Balance',
      '4': 'PayPal'
    };
    return map[String(type)] || t('member.payUnknown') || 'Unknown';
  };

  // 3. 时间格式化 (顺便把这个也提出来，到处都能用)
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
    return date.toLocaleString();
  };

  return {
    getStateName,
    getPayTypeName,
    formatDate
  };
};