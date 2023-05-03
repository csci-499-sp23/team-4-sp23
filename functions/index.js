require("dotenv").config();
const cors = require("cors")({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
});

const functions = require("firebase-functions");


const {initializeApp} = require("firebase-admin/app");
const {getStudentsList, getMatches, getGeoLoc} = require("./src/matches");
initializeApp(functions.config().firestore);

// const {FirebaseFunctionsRateLimiter} =
//   require("firebase-functions-rate-limiter");
const admin = require("firebase-admin");
const {default: FirebaseFunctionsRateLimiter} =
  require("@omgovich/firebase-functions-rate-limiter");

// admin.initializeApp(functions.config().firestore);
const database = admin.firestore();

// rate limit to 5 call in 15 seconds
const limiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
      name: "rate_limiter_collection",
      maxCalls: 5,
      periodSeconds: 15,
    },
    database,
);


exports.getStudentAddresses = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const addresses = await getStudentsList().then((students) =>
      students.map((student) => student.street_add),
    );

    res.send({addresses});
  });
});

// replace mockStudent with actual stude

exports.getMatches = functions
    .runWith({secrets: ["GOOGLE_GEOCODE_API_KEY"]})
    .https.onCall(async (data, context) => {
      functions.logger.info("Hello from matches!", {
        structuredData: true,
      });

      // will throw HttpsException with proper warning
      await limiter.rejectOnQuotaExceededOrRecordUsage();


      // compute matches () [distance: 5, 10,20,50,100]
      // const matches = demoProfiles;
      const {distanceInKm = 10} = data;
      console.log({data, auth: context.auth});
      const [student = null] = await getStudentsList({
        filters: [
          {field: "email", operator: "==", value: context.auth.token.email},
        ],
      });

      console.log({student});
      if (student === null) {
        throw new Error("Error: you dont have an account in our records");
      }
      const matches = await getMatches({
        student,
        filters: {distanceInKm},
      });

      // write your code to pull matches here
      return {data: matches};
    });

exports.updateStudentLocation = functions.https.onCall((res, req) => {
  cors(req, res, () => {
    const {address = null} = req.body;

    if (!address) {
      return res.json({
        error: "Error: invalid address",
        data: {address},
      });
    }
    const latLonArr = getGeoLoc(address);

    res.send({result: {address, latLonArr}});
  });
});


exports.healthCheck = functions.https.onRequest((req, res) => {
  res.write("healthy");
  res.end();
});
