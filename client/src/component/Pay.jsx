import React from "react";
import { v4 as uuidv4 } from "uuid";

function Pay({ fname, lname, email, amount }) {
  const tx_ref = fname + "-tx-" + uuidv4();
  return (
    <form method="POST" action="https://api.chapa.co/v1/hosted/pay">
      <input
        type="hidden"
        name="public_key"
        value={import.meta.env.VITE_CHAPA_PUBLIC_KEY}
      />
      <input type="hidden" name="tx_ref" value={tx_ref} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="currency" value="ETB" />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="first_name" value={fname} />
      <input type="hidden" name="last_name" value={lname} />
      <input type="hidden" name="title" value="Let us do this" />
      <input
        type="hidden"
        name="description"
        value="Paying with Confidence with cha"
      />
      <input
        type="hidden"
        name="logo"
        value="https://chapa.link/asset/images/chapa_swirl.svg"
      />
      <input
        type="hidden"
        name="callback_url"
        value={`https://summer-blog-api.onrender.com/payment-callback?tx_ref=${tx_ref}`}
      />
      <input
        type="hidden"
        name="return_url"
        value={`https://summer-blog-api.onrender.com/payment-callback?tx_ref=${tx_ref}`}
      />
      <input type="hidden" name="meta[title]" value="test" />
      <button
        type="submit"
        className="bg-[#557a95] p-2 rounded-md hover:text-white/70 -translate-x-1/2 relative left-1/2"
      >
        Donate Now
      </button>
    </form>
  );
}

export default Pay;
