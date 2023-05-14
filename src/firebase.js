import { collection, getDocs, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "./firebase-config";
import { docToJson, makeDeferred } from "./jsonUtils";


const cachedQuery = (collection, ...filters) => {
  const CACHE_WINDOW = 10 * 1_000;//cache for 10 seconds
  return query(collection, ...filters)
  // .cache(CACHE_WINDOW)
}
export const getProfiles = async (queryCollection = "student", filterFn = (ref) => ref.get()) => {
  try {
    const profilesRef = db.collection(queryCollection);
    // const profilesSnapshot = await (filterFn ? profilesRef.where(filterFn).get() : profilesRef.get());
    const profilesSnapshot = await filterFn(profilesRef);
    const profiles = profilesSnapshot.map(docToJson);

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

async function getStudentInfo(email) {
  //  return  getProfiles("students",)
  const studentRef = collection(db, "students").where("email", "==", email);
  const studentsSnapshot = await studentRef.get();

  const students = []

  studentsSnapshot.forEach((doc) => {
    students.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  const [firstStudent] = students;

  return firstStudent

  // return

  // const unsubscribe = getDocs(studentRef).then( (snapshot) => {
  //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   setStudentData(data);
  // });
}


async function getSurveyQuestions(questionIds) {
  let deferred = makeDeferred()
  const collectionRef = cachedQuery(collection(db, 'surv_questions'), where('question_code', 'in', questionIds))
  getDocs(collectionRef).then((snapshot) => {
    const survey_questions = snapshot.docs.map(docToJson)
    //pass the survey_questions to the deferred promise
    deferred.res(survey_questions)
  })
  // deferred = convertSnapshotToJson(snapshotResponses)
  return /** @type {Promise<import("./../index").Question[]>} */ (deferred.promise)
}

async function getSurveyAnswers(answerIds) {
  let deferred = makeDeferred()

  const collectionRef = cachedQuery(collection(db, 'surv_answers'), where('answer_code', 'in', answerIds))
  getDocs(collectionRef).then(snapshot => {
    deferred.res(snapshot.docs.map(docToJson))
  })
  return deferred.promise
}

async function getQuestionAndAnswers(studentDocId) {

  const collectionQuery = cachedQuery(collection(db, 'question_answers'), where('user_id', '==', studentDocId))

  const answers = await getDocs(collectionQuery).then((snapshot) => snapshot.docs.map(docToJson))
  return answers

}

async function getStudentSurveyResponses(studentId) {
  const user_id = studentId;


  try {
    let responses = await getQuestionAndAnswers(user_id)
    let surveyQuestions = await getSurveyQuestions(responses.map(qa => qa.question_code))
    let answerOptions = await getSurveyAnswers(responses.map(qa => qa.answer_code))
    // Todo: use the studentEmail to retrieve questions and responses for this student
    // return them as [{question:'some question', response:'some response'},....]
    const result = {
      responses,
      questions: Object.fromEntries(surveyQuestions.map(res => [res.question_code, res])),
      options: Object.fromEntries(answerOptions.map(res => [res.answer_code, res]))
    };

    return result;
  } catch (error) {
    console.error(error)
  }




}

/**
 * @type {string} function name
 *
 */
function getCallableFunction(functionName) {
  /**@typdef {Promise<{data:T}>} FunctionsResponse<T> */
  return httpsCallable(functions, functionName);
}

export const functionsApi = {
  getMatches: /** @type {Promise<{data: {data: import('./../index').Student[]}}>} */ (getCallableFunction("getMatches")),
  getStudentAddresses: getCallableFunction("getStudentAddresses"),
  dynamicFunction: (functionName) => getCallableFunction(functionName),
  getStudentSurveyResponses,
  getStudentInfo
};

//syncronous function
function getRandomNumbr() {
  return Math.random();
}
console.log(getRandomNumbr());

//async functions
function promAsyncGetRandomNumber() {
  return new Promise((res, rej) => {
    res(getRandomNumbr());
  });
}

promAsyncGetRandomNumber().then((response) => console.log(response));
