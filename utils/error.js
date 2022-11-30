export const catchErr = err => {
  return err.response?.data?.message ? err.response.data.message : err.message ? err.message : err;
};
