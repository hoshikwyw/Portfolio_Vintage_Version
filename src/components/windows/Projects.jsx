import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useFetchProjects } from '../../queries/projectQueries';

const ProjectCard = ({ name, description, image, link, github, tags, status }) => {
  const isComingSoon = status === false;

  return (
    <div
      className={`h-full w-full flex flex-col overflow-hidden transition-all duration-200 ${isComingSoon ? 'opacity-60 pointer-events-none' : ''}`}
      style={{
        background: '#e8e0d4',
        border: '2px solid #8a8070',
        borderTopColor: '#d0c8b8',
        borderLeftColor: '#d0c8b8',
        borderRadius: '4px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '8px',
      }}
    >
      <div className="h-48 overflow-hidden relative" style={{ border: '2px inset #a0a090', background: '#c0b8a8' }}>
        <div className="absolute inset-0 bg-[#c0b8a8] animate-pulse"></div>
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
            onLoad={(e) => { e.target.previousSibling.style.display = 'none'; }}
          />
        )}
        {isComingSoon && (
          <div className="absolute inset-0 bg-[#2b2b3d]/80 flex items-center justify-center z-20">
            <span className="text-[#e0d8c8] text-sm font-bold uppercase tracking-wider">Coming Soon</span>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col gap-2 pt-2">
        {!isComingSoon ? (
          <>
            <h3 className="text-sm font-bold text-[#2b2b3d] uppercase tracking-wide">{name}</h3>
            <p className="text-[#4a4a4a] text-[11px] flex-grow leading-relaxed">{description}</p>

            <div className="flex flex-wrap gap-1 mb-2">
              {tags?.map((tag, index) => (
                <span
                  key={index}
                  className="text-[9px] font-bold text-[#2b2b3d] uppercase tracking-wide px-2 py-0.5"
                  style={{ border: '1px solid #8a8070', background: '#d0c8b8', borderRadius: '2px' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-auto gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-[#2b2b3d] text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 text-center flex-1 cursor-pointer hover:brightness-105"
                style={{
                  background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
                  border: '2px solid #7a7060',
                  borderTopColor: '#e0d8c8',
                  borderLeftColor: '#e0d8c8',
                  borderRadius: '3px',
                }}
              >
                Live Demo
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-[#2b2b3d] text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 text-center flex-1 cursor-pointer hover:brightness-105"
                style={{
                  background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
                  border: '2px solid #7a7060',
                  borderTopColor: '#e0d8c8',
                  borderLeftColor: '#e0d8c8',
                  borderRadius: '3px',
                }}
              >
                View Code
              </a>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full mt-auto gap-2">
            <span className="text-[#5a5a7a] font-bold text-xs uppercase">Coming Soon</span>
            <span className="text-[#2b2b3d] font-bold text-xs uppercase">{name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = ({ windowSize }) => {
  const { data: projects } = useFetchProjects();

  const slideWidth = Math.max(350, Math.min(100, windowSize?.width / 2));
  const slideHeight = Math.max(420, Math.min(420, windowSize?.height / 1.3));

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
    <div className="w-full h-full flex flex-col items-center project-container relative" style={{ maxWidth: '100vw' }}>
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView="auto"
        spaceBetween={12}
        centeredSlides={false}
        speed={800}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          setTimeout(() => { swiper.navigation?.init(); swiper.navigation?.update(); }, 100);
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        style={{ width: '100%', height: '100%', margin: '12px' }}
      >
        {sortedProjects?.map((project, index) => (
          <SwiperSlide
            key={index}
            style={{ width: `${slideWidth}px`, height: `${slideHeight}px`, transition: 'transform 0.8s ease', padding: '8px' }}
          >
            <div className="w-full h-full">
              <ProjectCard
                name={project?.title}
                description={project?.desc}
                image={project?.imgs?.[0] || null}
                link={project?.demolink}
                github={project?.repolink}
                tags={project?.languages}
                status={project?.status}
              />
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide style={{ width: `${slideWidth}px`, height: `${slideHeight}px`, padding: '8px' }} />
      </Swiper>

      <button ref={prevRef} className="custom-nav-button absolute z-10" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} aria-label="Previous project">
        <LeftOutlined style={{ fontSize: '14px' }} />
      </button>
      <button ref={nextRef} className="custom-nav-button absolute z-10" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} aria-label="Next project">
        <RightOutlined style={{ fontSize: '14px' }} />
      </button>
    </div>
  );
};

export default Projects;
