export interface Student {
  // cddefglssz
  city;
  dob;
  email;
  first_name;
  last_name;
  school_id;
  state;
  zip;
  street_add;
  id;
}

//same as options
export interface SurveyAnswer {
  answer: string;
  answer_code: number;
}

export interface Question {
  question: string;
  questin_code: number;
  presentable: boolean;
//   answer_codes: [,,,,,,,,]
}

export interface QuestionAnswer {
  answer_code: number;
  question_code: number;
  user_id: string;
}

export interface ProfileSurvey {
    responses: QuestionAnswer[],
    options: Record<number,SurveyAnswer>
    questions: Record<number,Question>
}
