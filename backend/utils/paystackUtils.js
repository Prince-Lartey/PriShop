export const createSubaccount = async ({ name, email, mobileMoneyDetails, bankDetails }) => {
    const payload = {
        business_name: name,
        primary_contact_email: email,
        settlement_bank: bankDetails?.bankCode || null,
        account_number: bankDetails?.accountNumber || null,
        mobile_money_details: mobileMoneyDetails
            ? {
                provider: mobileMoneyDetails.provider,
                mobile_number: mobileMoneyDetails.phoneNumber,
            }
            : null,
        percentage_charge: 2.5, // Platform commission percentage
    };

    const response = await axios.post("https://api.paystack.co/subaccount", payload, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });

    return response.data.data; // Return the subaccount data
};