export const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
};

export const formatBoolean = (value: boolean | undefined) => {
  return value ? 'Yes' : 'No';
};

export const formatPercentage = (value: number | undefined) => {
  if (value === undefined) return 'N/A';
  return `${value}%`;
};

export const formatNumber = (value: string | number | undefined) => {
  if (value === undefined || value === '') return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return 'N/A';
  
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  
  return num.toString();
};

export const getSecurityStatus = (isHoneypot: boolean | undefined, cannotSell: boolean | undefined) => {
  if (isHoneypot) {
    return {
      status: 'error',
      message: 'High Risk - Potential Honeypot'
    };
  }
  if (cannotSell) {
    return {
      status: 'warning',
      message: 'Medium Risk - Selling Restrictions'
    };
  }
  return {
    status: 'success',
    message: 'Low Risk'
  };
}; 