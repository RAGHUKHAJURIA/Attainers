import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

const ModernHero = () => {
    return (
        <main className="overflow-hidden">
            <section>
                <div className="relative pt-24">
                    <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
                    <div className="mx-auto max-w-5xl px-6">
                        <div className="sm:mx-auto lg:mr-auto">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                            >
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 text-gray-900">
                                    Prepare, Track, and{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                        Achieve Your Dreams
                                    </span>
                                </h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-600">
                                    The ultimate platform for J&K Exam preparation. Access high-quality PDFs,
                                    video lectures, and previous papers all in one place.
                                </p>
                                <div className="mt-12 flex items-center gap-2">
                                    <div className="bg-blue-600/10 rounded-[14px] border border-blue-200 p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base bg-blue-600 hover:bg-blue-700">
                                            <Link to="/courses">
                                                <span className="text-nowrap">Start Learning Free</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-[42px] rounded-xl px-5 text-base">
                                        <Link to="/youtube" className="flex items-center gap-2">
                                            <Youtube className="w-5 h-5 text-red-500" />
                                            <span className="text-nowrap">Watch Demo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}>
                        <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                            <div
                                aria-hidden
                                className="bg-gradient-to-b to-white absolute inset-0 z-10 from-transparent from-35%"
                            />
                            <div className="bg-white relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-white">
                                <img
                                    className="bg-white aspect-[15/8] relative rounded-2xl border border-gray-100"
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2700&q=80"
                                    alt="Students studying together"
                                    width="2700"
                                    height="1440"
                                />
                            </div>
                        </div>
                    </AnimatedGroup>
                </div>
            </section>
            <section className="bg-white pb-16 pt-16 md:pb-32">
                <div className="group relative m-auto max-w-5xl px-6">
                    <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <Link
                            to="/courses"
                            className="block text-sm duration-150 hover:opacity-75 text-blue-600 font-medium">
                            <span>Explore All Resources</span>
                            <ChevronRight className="ml-1 inline-block size-3" />
                        </Link>
                    </div>
                    <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">PDFs</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🎥</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Videos</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Mock Tests</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📄</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Papers</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📅</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Updates</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">▶️</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">YouTube</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Schedules</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Courses</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ModernHero;
