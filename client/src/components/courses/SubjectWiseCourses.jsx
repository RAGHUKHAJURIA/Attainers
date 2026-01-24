import React, { useState, useMemo } from 'react';
import SectionCard from '../SectionCard'; // Assuming in components/SubjectWise/ or just components/
import CourseCard from '../CourseCard';

const SubjectWiseCourses = ({ courses, onCourseClick, onBack, isAdmin, onDelete }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Extract unique categories (subjects) and count courses for each
    const subjects = useMemo(() => {
        const subjectMap = {};
        courses.forEach(course => {
            // Normalize category: capitalize words, remove hyphens
            const category = course.category || 'Other';
            if (!subjectMap[category]) {
                subjectMap[category] = {
                    id: category,
                    title: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    count: 0,
                    // safe to pick first thumbnail as representative or use a generic one
                    thumbnail: course.thumbnail
                };
            }
            subjectMap[category].count++;
        });
        return Object.values(subjectMap);
    }, [courses]);

    const filteredCourses = useMemo(() => {
        if (!selectedSubject) return [];
        return courses.filter(course => course.category === selectedSubject.id);
    }, [courses, selectedSubject]);

    if (selectedSubject) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedSubject(null)}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Subjects
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubject.title}</h2>
                    <p className="text-gray-600">{selectedSubject.count} Courses Available</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            onClick={onCourseClick}
                            isAdmin={isAdmin}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Sections
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Subject</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <SectionCard
                        key={subject.id}
                        title={subject.title}
                        description={`${subject.count} Courses`}
                        icon={
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
                        colorClass="bg-indigo-500"
                        onClick={() => setSelectedSubject(subject)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubjectWiseCourses;
