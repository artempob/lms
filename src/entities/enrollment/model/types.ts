export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'REVOKED';

export interface Enrollment {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    status: EnrollmentStatus;
    enrolledAt: string;
}

export interface LessonProgress {
    id: string;
    enrollmentId: string;
    lessonId: string;
    completedAt: string;
}