const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripeKey = 'sk_test_51PYRUrCPU6aHM3KcYuTvcNnND776TnxBOvkGyZiSuBrUFKAE5qLXq9xQ2PgXqGsSg7HB2QEKmxZ0JqXgNkQiKfJ900kzAH19gM';

router.post("/payment", async (req, res) => {
    const { productName, productPrice, signUpUser } = req.body;
    const stripe = Stripe(stripeKey);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: productName,
                            images: [],
                        },
                        unit_amount: productPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `https://app-aqwebsite-demo-cenus-001.azurewebsites.net/signupactivation?search=${Buffer.from(signUpUser).toString('base64')}`,
            cancel_url: `https://app-aqwebsite-demo-cenus-001.azurewebsites.net/notfound`,
        });
        // console.log(session.url);
        res.status(200).send({ url: session.url });
    } catch (err) {
        res.send(err);
    }
});


module.exports = router;