const stripe = require('stripe')('sk_test_51LJaHJIvndITSaVYpSPnqPxT69FtM0FG5OY8X2pirE8iFjBFPB4Zefm6Zplb94IcvQfPtTOvNGQnBSHUqILZb6p600EEcSzjUB');
const express = require('express');
const app = express();
app.use(express.static('public'));
const endpointSecret = "we_1LOd6GIvndITSaVYBXh7ELqQ";

var admin = require("firebase-admin");

var serviceAccount = require("/adminKey.json");
const { getDatabase } = require('firebase-admin/database');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const db = getDatabase();
const jobs = db.ref('Jobs/');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tswpropertysolution-default-rtdb.firebaseio.com"
});
const YOUR_DOMAIN = 'https://tswpropertysolutions.com.au';
let Details

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/checkout', async (req, res) => {
 
  Details = (JSON.parse(req.body.Details));

  var cleanPrice = Number( Math.ceil(req.body.ServicePrice)) * 100
  console.log(cleanPrice);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
            product_data:{
              name:req.body.OrderRef,
              description: req.body.Cleantype + " - " + req.body.CleanDetails,
            },
            currency:"aud",
            unit_amount_decimal:cleanPrice,
          },
          quantity: 1,
      },
    ],
    
    success_url: `${YOUR_DOMAIN}/Success`,
    cancel_url: `${YOUR_DOMAIN}/booking`,
  });

  res.redirect(303, session.url);
});
console.log(Details)

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const EventsessionFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      console.log(EventsessionFailed)
      break;
    case 'checkout.session.async_payment_succeeded':
      const Eventsessionsucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      console.log(Eventsessionsucceeded)
      break;
    case 'subscription_schedule.canceled':
      const subscriptionScheduleCanceled = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.canceled
      console.log(subscriptionScheduleCanceled)
      break;
    case 'subscription_schedule.created':
      const subscriptionScheduleCreated = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.created
      console.log(subscriptionScheduleCreated)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));


function CreateTask(){
  /*
  RefNum:{
    Date: 
    Status:
    Time:
    Payment:
    Information:{
        
    },
    Tasks:{
      Number:{}
    }
  }

  */


    }

