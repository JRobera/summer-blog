const axios = require("axios");

const verifyPayment = async (tx_ref) => {
  try {
    const verificationResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: "Bearer CHASECK_TEST-G5G9WXFBPQalTXApYVZMDnemScYHAjVt",
        },
      }
    );
    return verificationResponse.data.data.status;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while verifying the payment.");
  }
};

module.exports = { verifyPayment };
