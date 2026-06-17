import { useState } from 'react'
import Loading from './components/sections/Loading.jsx'
import Layout from './components/layout/Layout.jsx'
import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Skills from './components/sections/Skills.jsx'
import Projects from './components/sections/Projects.jsx'
import Experience from './components/sections/Experience.jsx'
import Contact from './components/sections/Contact.jsx'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loading onComplete={() => setLoading(false)} />}
      <Layout>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </Layout>
    </>
  )
}

export default App
