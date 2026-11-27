import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { GuestRoute } from './routes/GuestRoute';
import { AuthorRoute } from './routes/AuthorRoute';
import { MainLayout } from './layouts/MainLayout';
import { Loader } from '@/shared/ui/loader';
import './styles/index.scss';

const CatalogPage = lazy(() => import('@/pages/catalog').then(m => ({ default: m.CatalogPage })));
const LoginPage = lazy(() => import('@/pages/login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/register').then(m => ({ default: m.RegisterPage })));
const MyCoursesPage = lazy(() => import('@/pages/my-courses').then(m => ({ default: m.MyCoursesPage })));
const CoursePlayerPage = lazy(() => import('@/pages/course-player').then(m => ({ default: m.CoursePlayerPage })));
const CourseDetailsPage = lazy(() => import('@/pages/course-details').then(m => ({ default: m.CourseDetailsPage })));
const CreateCoursePage = lazy(() => import('@/pages/create-course').then(m => ({ default: m.CreateCoursePage })));
const LessonPage = lazy(() => import('@/pages/lesson').then(m => ({ default: m.LessonPage })));
const CourseEditorPage = lazy(() => import('@/pages/course-editor').then(m => ({ default: m.CourseEditorPage })));
const TeachingPage = lazy(() => import('@/pages/teaching').then(m => ({ default: m.TeachingPage })));
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage').then(m => ({ default: m.ProfilePage })));

export const App: React.FC = () => (
    <AuthProvider>
        <BrowserRouter>
            <Suspense fallback={<Loader center />}>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<CatalogPage />} />
                            <Route path="/my-courses" element={<MyCoursesPage />} />
                            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
                            <Route path="/courses/:courseId/player" element={<CoursePlayerPage />} />
                            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route element={<AuthorRoute />}>
                                <Route path="/courses/new" element={<CreateCoursePage />} />
                                <Route path="/courses/:courseId/edit" element={<CourseEditorPage />} />
                                <Route path="/teaching" element={<TeachingPage />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </AuthProvider>
);
