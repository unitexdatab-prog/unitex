import { motion } from 'framer-motion';
import { FiMap, FiCheck, FiCircle } from 'react-icons/fi';

const roadmaps = [
    {
        id: 1,
        title: 'Frontend Development',
        description: 'Master modern frontend technologies',
        color: '#A68B5B',
        steps: [
            { title: 'HTML & CSS Basics', completed: true },
            { title: 'JavaScript Fundamentals', completed: true },
            { title: 'React Framework', completed: false },
            { title: 'State Management', completed: false },
            { title: 'Testing & Deployment', completed: false }
        ]
    },
    {
        id: 2,
        title: 'Backend Development',
        description: 'Build scalable server-side applications',
        color: '#008080',
        steps: [
            { title: 'Node.js Basics', completed: true },
            { title: 'Express.js & APIs', completed: false },
            { title: 'Database Design', completed: false },
            { title: 'Authentication', completed: false },
            { title: 'Cloud Deployment', completed: false }
        ]
    },
    {
        id: 3,
        title: 'UI/UX Design',
        description: 'Create beautiful user experiences',
        color: '#FF7F50',
        steps: [
            { title: 'Design Principles', completed: false },
            { title: 'Color & Typography', completed: false },
            { title: 'Figma Mastery', completed: false },
            { title: 'Prototyping', completed: false },
            { title: 'User Research', completed: false }
        ]
    }
];

const Roadmaps = () => {
    const getProgress = (steps) => {
        const completed = steps.filter(s => s.completed).length;
        return Math.round((completed / steps.length) * 100);
    };

    return (
        <div className="animate-fadeIn">
            <h1 style={{ marginBottom: 8 }}>Roadmaps</h1>
            <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>
                Structured learning paths to guide your journey
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {roadmaps.map((roadmap, index) => (
                    <motion.div
                        key={roadmap.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card card-hover"
                    >
                        <div style={{ display: 'flex', gap: 20 }}>
                            {/* Left: Icon */}
                            <div style={{
                                width: 56,
                                height: 56,
                                background: roadmap.color,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <FiMap size={24} color="white" />
                            </div>

                            {/* Right: Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                    <div>
                                        <h3>{roadmap.title}</h3>
                                        <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>{roadmap.description}</p>
                                    </div>
                                    <span className="tag tag-primary">{getProgress(roadmap.steps)}%</span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{
                                    height: 4,
                                    background: 'var(--color-silver)',
                                    borderRadius: 999,
                                    marginBottom: 16,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${getProgress(roadmap.steps)}%`,
                                        height: '100%',
                                        background: roadmap.color,
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>

                                {/* Steps */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {roadmap.steps.map((step, stepIndex) => (
                                        <div
                                            key={stepIndex}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '8px 12px',
                                                background: step.completed ? 'rgba(244, 81, 28, 0.05)' : 'var(--color-silver)',
                                                borderRadius: 8
                                            }}
                                        >
                                            <div style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                border: `2px solid ${step.completed ? roadmap.color : 'var(--color-muted)'}`,
                                                background: step.completed ? roadmap.color : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {step.completed && <FiCheck size={12} color="white" />}
                                            </div>
                                            <span style={{
                                                color: step.completed ? 'var(--color-dark)' : 'var(--color-muted)',
                                                textDecoration: step.completed ? 'line-through' : 'none'
                                            }}>
                                                {step.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p style={{ color: 'var(--color-muted)', fontSize: 14, marginTop: 32, textAlign: 'center' }}>
                More roadmaps coming soon! 🚀
            </p>
        </div>
    );
};

export default Roadmaps;
