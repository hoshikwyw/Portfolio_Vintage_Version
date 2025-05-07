import React, { useRef, useEffect } from 'react';
import ProjectCard from '../common/ProjectCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { projects } from '../utils/projects';
import 'swiper/css';
import 'swiper/css/navigation';

const Projects = ({ windowSize }) => {
    const slideWidth = Math.max(200, Math.min(300, windowSize?.width / 4));
    const slideHeight = Math.max(250, Math.min(400, windowSize?.height / 2));

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        // Ensure Swiper updates navigation buttons after refs are set
        if (prevRef.current && nextRef.current) {
            const buttons = document.querySelectorAll('.custom-nav-button');
            buttons.forEach((button) => (button.style.display = 'block'));
        }
    }, [prevRef, nextRef]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start gap-5 p-5 project-container relative">
            <Swiper
                modules={[Navigation]}
                slidesPerView="auto"
                spaceBetween={50}
                centeredSlides={false}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                onSwiper={(swiper) => {
                    // Re-assign navigation buttons after Swiper is initialized
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                style={{
                    padding: '20px',
                    width: `${windowSize.width}px`,
                    height: `${windowSize.height - 10}px`,
                }}
            >
                {projects.map((project, index) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            width: `${slideWidth}px`,
                            height: `${slideHeight}px`,
                        }}
                    >
                        <ProjectCard
                            name={project.name}
                            description={project.description}
                            image={project.image}
                            link={project.link}
                            github={project.github}
                        />
                    </SwiperSlide>
                ))}
                {/* Add fake slides */}
                <SwiperSlide
                    style={{
                        width: `${slideWidth}px`,
                        height: `${slideHeight}px`,
                        backgroundColor: 'transparent',
                    }}
                />
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
                ref={prevRef}
                className="custom-nav-button left-0"
                style={{
                    top: `${windowSize.height / 2}px`,
                    fontSize: `${Math.max(20, windowSize.width / 50)}px`,
                }}
            >
                &#9664;
            </button>
            <button
                ref={nextRef}
                className="custom-nav-button right-0"
                style={{
                    top: `${windowSize.height / 2}px`,
                    fontSize: `${Math.max(20, windowSize.width / 50)}px`,
                }}
            >
                &#9654;
            </button>
        </div>
    );
};

export default Projects;