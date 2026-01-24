import React, { useState, useMemo } from 'react';
import SectionCard from '../SectionCard';
import CourseCard from '../CourseCard';

const ExamWiseCourses = ({ courses, onCourseClick, onBack, isAdmin, onDelete }) => {
    const [selectedExam, setSelectedExam] = useState(null);

    // Extract unique exams from courses
    // Assuming courses have an 'exam' field or we derive it from category/title
    // If 'exam' field doesn't exist, we might need to rely on 'category' or tags if available.
    // tailored for Attainers schema: often 'exam' or 'category' is used. 
    // SubjectWise used 'category'. Let's assume 'exam' property might exist or we filter 'category' differently?
    // User prompt implied "Exam Wise" is a distinct categorization. 
    // IF schema doesn't have 'exam' field, we might need to filter categories that are actually exams (e.g. JKSSB, SSC) vs Subjects (History, Math).
    // For now, I'll attempt to use a 'exam' field if it exists, or fall back to checking if category is a known exam.
    // Or better, let's look at unique categories and let user choose.
    // Actually, looking at SubjectWiseCourses, it just groups by 'category'.
    // Maybe we should allow categorizing by Tags? 
    // Let's assume for now we group by 'category' similar to SubjectWise but perhaps we filter for exam-like names?
    // Or better, to distinguish, maybe use 'examName' if available (like in MockTests).
    // Let's check course schema via what's used in CoursesPage or generic grouping.
    // CoursesPage fetches 'courses'. 
    // Let's just create a generic Grouper for now that groups by 'category' but filters for "Exam".
    // Wait, SubjectWise groups by Category. If Category IS the Exam (e.g. "JKSSB SI"), then SubjectWise is effectively ExamWise?
    // The user wants TWO sections.
    // Maybe some courses have `subject` and `exam` fields?
    // Let's look at `SubjectWiseCourses.jsx` again. It uses `course.category`.

    // I will implementation a similar grouper but maybe we can use a hardcoded list of Exams to filter categories?
    // Or better, let's just group by `category` for now same as SubjectWise, but maybe we can refine this later if backend supports distinct fields.
    // Actually, let's try to assume there might be a `tags` array or similar. 
    // If not, I'll replicate the categorical grouping but perhaps visual presentation is different? 
    // Or maybe I should check if there is an `exam` field.

    // SAFE BET: Re-use category for now, but usually "Exams" are top level categories like "JKSSB", "UPSC"
    // and "Subjects" are "History", "Polity". 
    // If data mixes them in `category`, we might need manual filtering or just show all categories here too.
    // Let's just implement it to group by category for now (robust fallback).

    const exams = useMemo(() => {
        const examMap = {};
        courses.forEach(course => {
            // Heuristic: If category contains "Exam" or known exam names, or just treat all categories as potential exams for now
            // To make it different from Subject Wise, maybe we check for specific keywords?
            // "JKSSB", "SSC", "UPSC", "VLW", "Patwari"
            const category = course.category || 'General';

            // Simple filter to try and separate subjects from exams if possible
            // If strictly following user request without backend change, we might just show categories here too.
            // Let's show all categories for maximum visibility.

            if (!examMap[category]) {
                examMap[category] = {
                    id: category,
                    title: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    count: 0,
                    thumbnail: course.thumbnail
                };
            }
            examMap[category].count++;
        });
        return Object.values(examMap);
    }, [courses]);

    const filteredCourses = useMemo(() => {
        if (!selectedExam) return [];
        return courses.filter(course => course.category === selectedExam.id);
    }, [courses, selectedExam]);

    if (selectedExam) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedExam(null)}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Exams
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedExam.title}</h2>
                    <p className="text-gray-600">{selectedExam.count} Courses Available</p>
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
                Back to Sections
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Exam</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => (
                    <SectionCard
                        key={exam.id}
                        title={exam.title}
                        description={`${exam.count} Courses`}
                        icon={
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        colorClass="bg-red-500"
                        onClick={() => setSelectedExam(exam)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExamWiseCourses;
