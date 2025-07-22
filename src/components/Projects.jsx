import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const projects = [
    {
        name: "miniCollector",
        description: "A collection of mini games and features including calculators, puzzles, and interactive tools.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60", // Game controller placeholder
        link: "#",
        github: "#",
        tags: ["React", "Games", "Interactive"]
    },
    {
        name: "EDU",
        description: "An e-learning platform for selling online courses with payment integration and user progress tracking.",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60", // Education placeholder
        link: "#",
        github: "#",
        tags: ["Next.js", "E-commerce", "Education"]
    },
    {
        name: "EDU Dashboard",
        description: "Admin panel for managing courses, users, and content on the EDU platform with analytics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60", // Dashboard placeholder
        link: "#",
        github: "#",
        tags: ["React", "Admin", "Dashboard"]
    },
    {
        name: "FoodCourt",
        description: "Recipe and food ingredient website with search functionality and meal planning tools.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60", // Food placeholder
        link: "#",
        github: "#",
        tags: ["Next.js", "Food", "Recipes"]
    },
    {
        name: "OroVibe",
        description: "Guide to relaxing places with location-based recommendations and user reviews.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60", // Beach placeholder
        link: "#",
        github: "#",
        tags: ["React", "Travel", "Guide"]
    }
];

const ProjectCard = ({ name, description, image, link, github, tags }) => {
    return (
        <div className="h-full w-full bg-amber-50 rounded-lg border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden flex flex-col">
            <div className=" h-52 overflow-hidden relative">
                <div className="absolute inset-0 bg-stone-300 animate-pulse"></div>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
                    onLoad={(e) => {
                        e.target.previousSibling.style.display = 'none';
                    }}
                />
            </div>
            <div className="p-4 flex-grow flex flex-col" style={{ padding: '10px 18px' }}>
                <h3 className="text-xl font-bold text-stone-900 mb-2">{name}</h3>
                <p className="text-stone-700 mb-4 flex-grow">{description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            style={{ padding: '3px 10px', marginBottom: '10px' }}
                            className="bg-stone-200 text-stone-800 px-2 py-1 rounded-full text-xs font-medium border border-stone-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between mt-auto" style={{ margin: '10px 0' }}>
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 hover:text-stone-900 font-medium text-sm border-b border-stone-700 hover:border-stone-900 transition-colors duration-200"
                    >
                        Live Demo
                    </a>
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 hover:text-stone-900 font-medium text-sm border-b border-stone-700 hover:border-stone-900 transition-colors duration-200"
                    >
                        View Code
                    </a>
                </div>
            </div>
        </div>
    );
};

const Projects = ({ windowSize }) => {
    const slideWidth = Math.max(400, Math.min(100, windowSize?.width / 2));
    const slideHeight = Math.max(450, Math.min(450, windowSize?.height / 1.3));

    const [swiperInstance, setSwiperInstance] = useState(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance, windowSize]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-5 project-container relative bg-amber-50"
            style={{
                padding: '0',
                maxWidth: '100vw',
            }}
        >
            {/* <h2 className="text-3xl font-bold text-stone-800 mb-8 w-full text-center pt-8">
                My Projects
            </h2> */}

            <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView="auto"
                spaceBetween={20}
                centeredSlides={false}
                speed={800}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: true,
                }}
                onSwiper={(swiper) => {
                    setSwiperInstance(swiper);
                    setTimeout(() => {
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }, 100);
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: '40px',
                    margin: '20px',
                }}
            >
                {projects.map((project, index) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            width: `${slideWidth}px`,
                            height: `${slideHeight}px`,
                            transition: 'transform 0.8s ease',
                            padding: '10px',
                        }}
                    >
                        <div className="w-full h-full">
                            <ProjectCard
                                name={project.name}
                                description={project.description}
                                image={project.image}
                                link={project.link}
                                github={project.github}
                                tags={project.tags}
                            />
                        </div>
                    </SwiperSlide>
                ))}
                <SwiperSlide style={{ width: `${slideWidth}px`, height: `${slideHeight}px`, padding: '10px' }} />
            </Swiper>

            <button
                ref={prevRef}
                className="custom-nav-button absolute z-10 bg-stone-700 bg-opacity-80 text-amber-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                aria-label="Previous project"
            >
                <LeftOutlined style={{ fontSize: '18px' }} />
            </button>
            <button
                ref={nextRef}
                className="custom-nav-button absolute z-10 bg-stone-700 bg-opacity-80 text-amber-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                aria-label="Next project"
            >
                <RightOutlined style={{ fontSize: '18px' }} />
            </button>
        </div>
    );
};

export default Projects;