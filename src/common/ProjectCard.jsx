import React from 'react'

const ProjectCard = ({ name, description, image, link, github }) => {
  return (
    <div className="project-card border rounded-lg flex flex-col items-center gap-3" style={{ padding: '10px' }}>
      <div className="image-container">
        <img
          src={image}
          alt={`${name} image`}
          className="project-image rounded-lg border-2 border-amber-400"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex gap-3">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Live Demo
        </a>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default ProjectCard