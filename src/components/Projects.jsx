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
      style={{ padding: '12px' }}
      className={`h-full w-full bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] border-[1.5px] border-black/15 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_12px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] 
        transition-all duration-300 overflow-hidden flex flex-col font-sans backdrop-blur-sm
        ${isComingSoon ? 'opacity-70 pointer-events-none' : 'hover:-translate-y-1'}`}
    >
      <div style={{ padding: '12px' }} className="h-52 overflow-hidden relative p-4 border-[1.5px] border-black/10 rounded-xl bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] animate-pulse"></div>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10 rounded-lg"
          onLoad={(e) => {
            e.target.previousSibling.style.display = 'none';
          }}
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b4e]/90 to-[#6b5b95]/90 flex items-center justify-center z-20 border-[1.5px] border-[#d4af37]/30 rounded-xl backdrop-blur-sm">
            <span className="text-white text-lg font-bold uppercase tracking-wider">🚧 Coming Soon 🚧</span>
          </div>
        )}
      </div>

      <div style={{ padding: '12px' }} className=" flex-grow flex flex-col gap-3">
        {!isComingSoon ? (
          <>
            <h3 className="text-xl font-bold text-[#2d1b4e] mb-1 uppercase tracking-wide">{name}</h3>
            <p className="text-[#3d3d3d] mb-4 flex-grow font-medium leading-relaxed">{description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags?.map((tag, index) => (
                <span
                  key={index}
                  style={{ padding: '6px 12px' }}
                  className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] text-[#2d1b4e] rounded-lg text-xs font-bold border-[1.5px] border-[#d4af37]/30 uppercase tracking-wide shadow-[0_2px_4px_rgba(212,175,55,0.2)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-auto gap-3">
              <a
                href={link}
                type="button"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-[#2d1b4e] hover:text-white font-semibold text-sm border-[1.5px] border-[#2d1b4e]/20 px-4 py-2 rounded-xl bg-white/80 hover:bg-gradient-to-br hover:from-[#2d1b4e] hover:to-[#6b5b95] transition-all duration-300 custom-link uppercase tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(45,27,78,0.3)]"
              >
                Live Demo
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-[#2d1b4e] hover:text-white font-semibold text-sm border-[1.5px] border-[#2d1b4e]/20 px-4 py-2 rounded-xl bg-white/80 hover:bg-gradient-to-br hover:from-[#2d1b4e] hover:to-[#6b5b95] transition-all duration-300 custom-link uppercase tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(45,27,78,0.3)]"
              >
                View Code
              </a>
            </div>

          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full mt-auto gap-2">
            <span className="text-[#6b5b95] font-bold text-sm uppercase">Coming Soon</span>
            <span className="text-[#2d1b4e] font-bold text-sm uppercase">{name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = ({ windowSize }) => {
  const { data: projects } = useFetchProjects();

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
        className="custom-nav-button absolute z-10"
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
        className="custom-nav-button absolute z-10"
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
