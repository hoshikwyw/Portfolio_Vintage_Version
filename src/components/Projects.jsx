import React, { useRef, useEffect, useState } from 'react';
import ProjectCard from '../common/ProjectCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { projects } from '../utils/projects';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

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
        <div className="w-full h-full flex flex-col items-center justify-center p-5 project-container relative"
            style={{
                padding: '0',
                maxWidth: '100vw',
            }}
        >
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
                    padding: '20px 40px',
                }}
            >
                {projects.map((project, index) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            width: `${slideWidth}px`,
                            height: `${slideHeight}px`,
                            // width: `300px`,
                            // height: `500px`,
                            transition: 'transform 0.8s ease',
                        }}
                    >
                        <div className="w-full h-full">
                            <ProjectCard
                                name={project.name}
                                description={project.description}
                                image={project.image}
                                link={project.link}
                                github={project.github}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
                <SwiperSlide style={{ width: `${slideWidth}px`, height: `${slideHeight}px` }} />
            </Swiper>
            
            <button
                ref={prevRef}
                className="custom-nav-button absolute z-10 bg-black bg-opacity-50 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-opacity-70 transition-all duration-300"
                style={{
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                aria-label="Previous project"
            >
                <LeftOutlined style={{ fontSize: '24px' }} />
            </button>
            <button
                ref={nextRef}
                className="custom-nav-button absolute z-10 bg-black bg-opacity-50 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-opacity-70 transition-all duration-300"
                style={{
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                aria-label="Next project"
            >
                <RightOutlined style={{ fontSize: '24px' }} />
            </button>
        </div>
    );
};

export default Projects;