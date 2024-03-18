// Generate url
exports.generateUrl = (cafeId) => {
  // generate code here
  const hostname =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASE_URL
      : process.env.LOCAL_BASE_URL;

  return `${hostname}?id=${cafeId}`;
};
