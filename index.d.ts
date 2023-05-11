export interface Student {
    // cddefglssz
    city
    dob
    email
    first_name
    last_name
    school_id
    state
    zip
    street_add
    id
}

export interface SurveyAnswer {
    answer: string
    answer_code: number
}

export interface Question {
    question: string
    questin_code: number
}


export interface QuestionAnswer {
    answer_code: number
    question_code: number
    user_id: string
}

