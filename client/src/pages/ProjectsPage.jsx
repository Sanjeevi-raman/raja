import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { CtaBand, PageHead } from '../components/ui';

export default function ProjectsPage({ go, content }) {
  const [active, setActive] = useState('All'); const projects = content?.projects || []; const categories = ['All', ...new Set(projects.map(project => project.category).filter(Boolean))]; const visible = projects.filter(project => active === 'All' || project.category === active);
  return <><PageHead crumb="Projects" title={<>Projects We <em>Support</em></>} desc="A selection of projects supplied with dependable electrical, hardware and safety solutions."/><section className="work"><div className="tabs">{categories.map(category => <button key={category} className={active === category ? 'selected' : ''} onClick={() => setActive(category)}>{category}</button>)}</div><div className="project-grid">{visible.map(project => <article key={project.id}><img src={project.image || 'https://placehold.co/800x500/e9edef/172125?text=Upload+Project+Image'} alt={project.name}/><h3>{project.name}</h3><small><MapPin size={13}/>{project.location}</small><small><Calendar size={13}/>{project.year}</small><p>{project.description}</p><b>{project.products}</b></article>)}</div>{!visible.length && <p>No projects have been added yet. Add them from Admin → Projects.</p>}</section><CtaBand go={go}/></>;
}
