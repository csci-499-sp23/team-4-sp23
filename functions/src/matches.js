const {getFirestore} = require("firebase-admin/firestore");
const {getGeoLoc, convertDistanceTCoordUnit} = require("./getGeoLoc");

// async function getLatLon(address, zip) {}
const docToJson = (doc) => {
  return {id: doc.id, ...doc.data()};
};


const getStudentsList = async ({filters} = {filters: []}) => {
  const query = await getFirestore().collection("students");


  const reducedQuery = filters.reduce((acc, currentFilter) => {
    const {field, operator, value} = currentFilter;
    acc = acc.where(field, operator, value);
    return acc;
  }, query);

  const studentsRef = await reducedQuery.get();

  /** @type {Student[]}*/
  const result = studentsRef.docs.map(async (studentDoc) => {
    const student = docToJson(studentDoc);

    let school = null;
    if (student?.school_id?.length) {
      const schoolPath = ["schools", studentDoc.data().school_id].join("/");
      const schoolDoc = await getFirestore().doc(schoolPath).get();
      school = docToJson(schoolDoc);
      console.log({school});
    }

    student.school = school;

    return student;
  });
  return Promise.all(result);
};

/** @typedef {number} DistanceKm */
const getMatches = async (
    /** @type {{ filters:{distanceInKm: DistanceKm },student}} */
    {filters, student},
) => {
  if (student === null) {
    throw new Error("Error: you dont have an account in our records");
  }
  // get intetest geo lon lat
  const geoLoc = await getGeoLoc(student);

  if (geoLoc === null) {
    console.log("Error: no geoLoc for student", {student});
    return [];
  }
  console.log({student, geoLoc});

  const interestWithGeoLoc = {...student, geoLoc};

  const [latDx, lonDx] = [
    convertDistanceTCoordUnit(filters.distanceInKm, "lat"),
    convertDistanceTCoordUnit(filters.distanceInKm, "lon"),
  ];
  const boundary = {
    // latMin: 0, // interest.lon + lon
    latMin: interestWithGeoLoc.geoLoc.lat - latDx,
    latMax: interestWithGeoLoc.geoLoc.lat + latDx,
    lonMin: interestWithGeoLoc.geoLoc.lon - lonDx,
    lonMax: interestWithGeoLoc.geoLoc.lon + lonDx,
  };

  // get all students
  const students = await getStudentsList({
    filters: [
      {field: "school_id", operator: "==", value: student.school_id},
      {field: "email", operator: "not-in", value: [student.email]}, // exclude user with same email as us
    ],
  });
  // .slice(0, 10);

  // attach geoloc lon lat
  const studentsWithGeoLoc = await Promise.all(
      students.map(async (student) => {
        const geoLoc = await getGeoLoc(student);
        return {...student, geoLoc};
      }),
  );
  console.log({students});
  // quadrantBox
  const studentsInRegionOfInterest = studentsWithGeoLoc.filter((student) => {
    // if lat out of bounds false or lon out of bounds
    const {geoLoc} = student;
    if (!geoLoc) {
      return false;
    }

    const {lat = null, lon = null} = geoLoc;

    if (
      lat == null ||
      lon == null ||
      lat < boundary.latMin ||
      lat > boundary.latMax ||
      lon < boundary.lonMin ||
      lon > boundary.lonMax
    ) {
      return false; // this student is outside outside boundary
    }

    return true;
  });
  // return true;
  // we want to be able to generate students
  // that are only within the same boundary of the student of interest
  // extra filters
  // end of othr filters if needed
  return studentsInRegionOfInterest;
};

module.exports = {
  getStudentsList,
  getMatches,
};
