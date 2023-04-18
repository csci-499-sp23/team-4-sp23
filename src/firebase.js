// import { db } from "./firebase"; // assuming you have a firebase.js file that exports the db object
import { auth, db } from "./firebase-config";


export const getProfiles = async (queryCollection = "student", filterFn = (ref) => ref.get()) => {
  try {
    const profilesRef = db.collection(queryCollection);
    // const profilesSnapshot = await (filterFn ? profilesRef.where(filterFn).get() : profilesRef.get());
    const profilesSnapshot = await filterFn(profilesRef);
    const profiles = [];

    profilesSnapshot.forEach((doc) => {
      profiles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return profiles;
  } catch (error) {
    console.error("Error getting students: ", error);
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error logging in: ", error);
    return null;
  }
};

export const updateStudentProfile = async (profile) => {
  try {
    const studentsRef = db.collection("students");
    const query = studentsRef.where("email", "==", profile.email);
    const snapshot = await query.get();

    if (snapshot.empty) {
      // no existing document with this email, create a new one
      await studentsRef.add(profile);
    } else {
      // update the existing document with this email
      const docRef = snapshot.docs[0].ref;
      await docRef.update(profile);
    }
    return true;
  } catch (error) {
    console.error("Error updating student profile: ", error);
    return false;
  }
};

export const doesProfileExist = async ({ email }) => {
  if (!email) {
    throw new Error("Error: email invalid");
  }
  //check in parents profile
  const allResultsPromise = [
    //check if we saved previously for this email as student
    getProfiles("students", (ref) => ref.where("email", "==", email)),
    //check if we saved previously a profile for this email as parent
    getProfiles("parents", (ref) => ref.where("email", "==", email)),
  ];

  //check in students profile
  return Promise.all(allResultsPromise).then((resultsArray) => {
    let profileType = null;
    const [students, parents] = resultsArray;

    const count = (students?.length ?? 0) + (parents?.length ?? 0);
    const exists = Boolean(count > 0);

    if (students?.length > 0) {
      profileType = "student";
    } else if (parents?.length > 0) {
      profileType = "parent";
    }
    return { exists, profileType };
  });
};
