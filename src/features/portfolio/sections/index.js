import HeroSection from './HeroSection'
import ExperienceSection from './ExperienceSection'
import SkillsSection from './SkillsSection'
import ProjectsSection from './ProjectsSection'
import ContactSection from './ContactSection'

/**
 * The page's sections, top to bottom. `nav` is the header link's label; a
 * section without one (the hero) is reached through the brand mark instead.
 * Adding a section here is all it takes to give it a header link.
 */
export const SECTIONS = [
  { id: 'top', Component: HeroSection },
  { id: 'experience', nav: 'Experience', Component: ExperienceSection },
  { id: 'skills', nav: 'Skills', Component: SkillsSection },
  { id: 'projects', nav: 'Projects', Component: ProjectsSection },
  { id: 'contact', nav: 'Contact', Component: ContactSection },
]
