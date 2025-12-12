import React from 'react'

const ProjectCard = ({ name, description, image, link, github }) => {
  return (
    <div className="project-card border-2 border-[#000000] rounded-sm flex flex-col items-center gap-3 bg-white/95 font-mono" style={{ padding: '10px' }}>
      <div className="image-container border-2 border-[#000000] rounded-sm overflow-hidden">
        <img
          src={image}
          alt={`${name} image`}
          className="project-image border-2 border-[#000000]"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#45473a] uppercase tracking-wide">{name}</h3>
        <p className="text-sm text-[#45473a] font-medium">{description}</p>
      </div>
      <div className="flex gap-3">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5768ad] hover:text-[#45473a] font-bold text-sm border-2 border-[#000000] px-3 py-1 rounded-sm bg-[#dfdde0] hover:bg-[#c0e692] transition-colors uppercase tracking-wide"
        >
          Live Demo
        </a>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5768ad] hover:text-[#45473a] font-bold text-sm border-2 border-[#000000] px-3 py-1 rounded-sm bg-[#dfdde0] hover:bg-[#c0e692] transition-colors uppercase tracking-wide"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default ProjectCard