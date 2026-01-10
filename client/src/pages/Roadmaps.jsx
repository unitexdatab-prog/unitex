import { motion } from 'framer-motion';
import { FiMap, FiCheck, FiCircle, FiTrendingUp } from 'react-icons/fi';

const roadmaps = [
    {
        id: 1,
        title: 'Frontend Architecture',
        description: 'Master modern frontend technologies and design systems.',
        color: 'var(--color-gold-buff)',
        steps: [
            { title: 'Information Architecture', completed: true },
            { title: 'Component Design Patterns', completed: true },
            { title: 'State Management Systems', completed: false },
            { title: 'Performance Optimization', completed: false },
            { title: 'Accessibility Standards', completed: false }
        ]
    },
    {
        id: 2,
        title: 'Backend Scalability',
        description: 'Build robust, scalable server-side infrastructure.',
        color: 'var(--color-bronze)',
        steps: [
            { title: 'API Design Principles', completed: true },
            { title: 'Database Normalization', completed: false },
            { title: 'Microservices Architecture', completed: false },
            { title: 'Security Best Practices', completed: false },
            { title: 'System Observability', completed: false }
        ]
    },
    {
        id: 3,
        title: 'Product Strategy',
        description: 'From ideation to launch and growth loops.',
        color: 'var(--color-obsidian)',
        steps: [
            { title: 'User Research Methods', completed: false },
            { title: 'Value Proposition Design', completed: false },
            { title: 'Metrics & Analytics', completed: false },
            { title: 'Growth Mechanics', completed: false },
            { title: 'Iterative Development', completed: false }
        ]
    }
];

const Roadmaps = () => {
    const getProgress = (steps) => {
        const completed = steps.filter(s => s.completed).length;
        return Math.round((completed / steps.length) * 100);
    };

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48 }}>
                <h1 className="t-headline-1">Roadmaps</h1>
                <p className="t-subhead">Structured paths for mastery.</p>
            </header>

            <div className="grid-12">
                {roadmaps.map((roadmap, index) => (
                    <motion.div
                        key={roadmap.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card"
                        style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }} // 3 Cards per row
                    >
                        <div style={{ marginBottom: 24 }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                background: roadmap.color,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                                color: '#FFF'
                            }}>
                                <FiMap size={24} />
                            </div>
                            <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 8 }}>{roadmap.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {roadmap.description}
                            </p>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span className="t-label">Progress</span>
                                <span className="badge">{getProgress(roadmap.steps)}%</span>
                            </div>
                            <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 99, marginBottom: 24 }}>
                                <div style={{ width: `${getProgress(roadmap.steps)}%`, height: '100%', background: roadmap.color, borderRadius: 99 }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {roadmap.steps.slice(0, 3).map((step, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: step.completed ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                                        {step.completed ? (
                                            <FiCheck color="var(--color-gold-buff)" />
                                        ) : (
                                            <FiCircle size={10} style={{ margin: 2 }} />
                                        )}
                                        <span style={{ textDecoration: step.completed ? 'line-through' : 'none' }}>{step.title}</span>
                                    </div>
                                ))}
                                {roadmap.steps.length > 3 && (
                                    <div style={{ paddingLeft: 24, fontSize: 12, color: 'var(--text-tertiary)' }}>
                                        + {roadmap.steps.length - 3} more steps
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 64, color: 'var(--text-tertiary)' }}>
                <p>New architectural blueprints are being drafted.</p>
            </div>
        </div>
    );
};

export default Roadmaps;
