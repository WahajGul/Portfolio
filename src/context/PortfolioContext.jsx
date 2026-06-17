import { createContext, useContext, useState } from 'react'

const PortfolioContext = createContext(null)

const defaultSkills = [
  { name: 'React', proficiency: 90 },
  { name: 'Node.js', proficiency: 85 },
  { name: 'TypeScript', proficiency: 80 },
  { name: 'Next.js', proficiency: 85 },
  { name: 'PostgreSQL', proficiency: 75 },
  { name: 'MongoDB', proficiency: 70 },
  { name: 'Docker', proficiency: 65 },
  { name: 'GraphQL', proficiency: 70 },
]

const defaultProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    demoLink: '#',
    repoLink: '#',
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'Collaborative task management tool featuring real-time updates, drag-and-drop boards, and team workflows.',
    techStack: ['Next.js', 'TypeScript', 'MongoDB', 'Socket.io'],
    demoLink: '#',
    repoLink: '#',
  },
  {
    id: 3,
    title: 'Real-Time Chat Application',
    description:
      'Scalable messaging platform with end-to-end encryption, file sharing, and group chat capabilities.',
    techStack: ['React', 'GraphQL', 'Redis', 'WebSockets'],
    demoLink: '#',
    repoLink: '#',
  },
]

export function PortfolioProvider({ children }) {
  const [skills, setSkills] = useState(defaultSkills)
  const [projects, setProjects] = useState(defaultProjects)
  const [theme, setTheme] = useState('dark')

  const addSkill = (skill) => setSkills((prev) => [...prev, skill])
  const removeSkill = (index) =>
    setSkills((prev) => prev.filter((_, i) => i !== index))

  const addProject = (project) =>
    setProjects((prev) => [
      ...prev,
      { ...project, id: Date.now() },
    ])
  const removeProject = (id) =>
    setProjects((prev) => prev.filter((p) => p.id !== id))

  return (
    <PortfolioContext.Provider
      value={{
        skills,
        projects,
        addSkill,
        removeSkill,
        addProject,
        removeProject,
        theme,
        setTheme,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
