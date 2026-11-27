export interface CreateCourseRequest {
    title: string;
    description?: string;
    price: number;
}

export interface CreateCourseResponse {
    id: string;
}