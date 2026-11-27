export interface CourseSummary {
    id: string;
    authorId: string;
    title: string;
    price: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
export interface MyCourseSummary extends CourseSummary {
    completedLessons: number;
    totalLessons: number;
}
export interface LessonSummary {
    id: string;
    title: string;
    isCompleted: boolean;
    ordinalNumber: number;
}

export interface CourseSyllabus {
    courseId: string;
    title: string;
    lessons: LessonSummary[];
    completedLessons: number;
    totalLessons: number;
    canComplete: boolean;
}
export interface CourseDetails {
    id: string;
    authorId: string;
    authorFirstName: string;
    authorLastName: string;
    title: string;
    description: string;
    price: number;
    status: string;
    lessons: Array<Omit<LessonSummary, 'isCompleted'>>;
}
