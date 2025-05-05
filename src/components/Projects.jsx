import React from 'react'
import ProjectCard from '../common/ProjectCard'
import ProjectNavi from '../common/ProjectNavi'
import { projects } from '../utils/projects'

const Projects = () => {
    return (
        <div className=' w-full h-full flex flex-col items-center justify-start gap-5 p-5'>
            <div className="flex flex-nowrap gap-5 w-full h-full overflow-x-auto">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        name={project.name}
                        description={project.description}
                        image={project.image}
                        link={project.link}
                        github={project.github}
                    />
                ))}
            </div>
            <div className="">
                <ProjectNavi />
            </div>
        </div>
    )
}
export default Projects