import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useFetchProjects } from '../queries/projectQueries';

const ProjectCard = ({ name, description, image, link, github, tags, status }) => {
  const isComingSoon = status === false;

  return (
    <div
      style={{ padding: '10px' }}
      className={`h-full w-full bg-blue-200/50 backdrop-blur-md rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl 
        transition-all duration-300 overflow-hidden flex flex-col 
        ${isComingSoon ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <div style={{ padding: '10px' }} className="h-52 overflow-hidden relative p-4">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10 rounded-2xl"
          onLoad={(e) => {
            e.target.previousSibling.style.display = 'none';
          }}
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
            <span className="text-white text-lg font-bold">🚧 Coming Soon 🚧</span>
          </div>
        )}
      </div>

      <div style={{ padding: '10px' }} className=" flex-grow flex flex-col gap-2">
        {!isComingSoon ? (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-700 mb-4 flex-grow">{description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags?.map((tag, index) => (
                <span
                  key={index}
                  style={{ padding: '3px 6px' }}
                  className="bg-indigo-300 text-white px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-auto">
              <a
                href={link}
                type="button"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-indigo-600 hover:text-indigo-800 font-medium text-sm border-b border-indigo-300 hover:border-indigo-600 transition-colors duration-200 custom-link"
              >
                Live Demo
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-indigo-600 hover:text-indigo-800 font-medium text-sm border-b border-indigo-300 hover:border-indigo-600 transition-colors duration-200 custom-link"
              >
                View Code
              </a>
            </div>

          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full mt-auto gap-2">
            <span className="text-gray-600 font-medium text-sm">Coming Soon</span>
            <span className="text-black font-medium text-sm">{name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = ({ windowSize }) => {
  const { data: projects, isLoading, error } = useFetchProjects();

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

  const sortedProjects = projects ? [...projects].sort((a, b) => a.id - b.id) : [];

  return (
    <div
      className="w-full h-full flex flex-col items-center project-container relative"
      style={{
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
            swiper.navigation?.init();
            swiper.navigation?.update();
          }, 100);
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        style={{
          width: '100%',
          height: '100%',
          margin: '20px',
        }}
      >
        {sortedProjects?.map((project, index) => (
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
                name={project?.title}
                description={project?.desc}
                image={project?.imgs ? project?.imgs[0] : ''}
                link={project?.demolink}
                github={project?.repolink}
                tags={project?.languages}
                status={project?.status}
              />
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide style={{ width: `${slideWidth}px`, height: `${slideHeight}px`, padding: '10px' }} />
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="custom-nav-button absolute z-10 bg-indigo-600 bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
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
        className="custom-nav-button absolute z-10 bg-indigo-600 bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
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
