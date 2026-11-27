export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    content: string | null;
    videoUrl?: string | null;
    isCompleted: boolean;
    canComplete: boolean;
}
