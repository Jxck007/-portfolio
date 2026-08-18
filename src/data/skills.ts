export interface SkillDetail {
  id: string;
  name: string;
  category: 'languages' | 'backend' | 'databases' | 'devops';
  categoryLabel: string;
  description: string;
  experienceSummary: string;
  officialUrl: string;
  iconName: string;
  color: string;
  tags: string[];
}

export const SKILLS_DATA: Record<string, SkillDetail> = {
  python: {
    id: 'python',
    name: 'Python',
    category: 'languages',
    categoryLabel: 'Language',
    description: 'High-level, interpreted programming language known for readable syntax and rich ecosystem spanning data engineering, web backends, and algorithmic systems.',
    experienceSummary: 'Architecting REST APIs, automation pipelines, and data processing systems with Flask and SQLAlchemy.',
    officialUrl: 'https://www.python.org/',
    iconName: 'SiPython',
    color: '#eab308',
    tags: ['Scripting', 'Backend', 'API Development', 'Algorithms']
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    category: 'languages',
    categoryLabel: 'Language / Query',
    description: 'Standard declarative language for relational database management, schema design, index optimization, and complex analytical queries.',
    experienceSummary: 'Writing optimized relational schemas, joins, window functions, and transaction-safe migrations.',
    officialUrl: 'https://en.wikipedia.org/wiki/SQL',
    iconName: 'TbDatabase',
    color: '#60a5fa',
    tags: ['RDBMS', 'Query Optimization', 'Indexes', 'Data Modeling']
  },
  dart: {
    id: 'dart',
    name: 'Dart',
    category: 'languages',
    categoryLabel: 'Language',
    description: 'Client-optimized language for fast apps on any platform, powering high-performance cross-platform Flutter mobile applications.',
    experienceSummary: 'Building strongly typed reactive UI state, asynchronous event streams, and cross-platform native modules.',
    officialUrl: 'https://dart.dev/',
    iconName: 'SiDart',
    color: '#38bdf8',
    tags: ['Cross-Platform', 'OOP', 'Type Safety', 'Mobile Engine']
  },
  html5: {
    id: 'html5',
    name: 'HTML5',
    category: 'languages',
    categoryLabel: 'Markup',
    description: 'Semantic markup standard underpinning all modern web browsers, accessibility standards (ARIA), and DOM structure.',
    experienceSummary: 'Crafting semantic, accessible, SEO-optimized markup structures and canvas elements.',
    officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    iconName: 'SiHtml5',
    color: '#f97316',
    tags: ['Semantic Web', 'DOM', 'Accessibility', 'Standards']
  },
  css3: {
    id: 'css3',
    name: 'CSS3',
    category: 'languages',
    categoryLabel: 'Styling',
    description: 'Style sheet language for modern layouts, responsive design, CSS Grid, Flexbox, transitions, keyframe animations, and custom properties.',
    experienceSummary: 'Building pixel-accurate responsive layouts, micro-interactions, dark mode themes, and design token systems.',
    officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    iconName: 'TbBrandCss3',
    color: '#3b82f6',
    tags: ['Responsive Design', 'Animations', 'Tailwind', 'Layouts']
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    category: 'languages',
    categoryLabel: 'Language',
    description: 'Dynamic scripting language powering modern interactive frontend web applications and Node.js backend runtimes.',
    experienceSummary: 'Developing reactive SPA architectures, async event-loop logic, DOM manipulation, and full-stack utilities.',
    officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    iconName: 'SiJavascript',
    color: '#fde047',
    tags: ['ES6+', 'Async/Await', 'Full-Stack', 'Interactive UI']
  },
  flask: {
    id: 'flask',
    name: 'Flask',
    category: 'backend',
    categoryLabel: 'Backend Framework',
    description: 'Lightweight WSGI Python web application framework offering modular flexibility, blueprints, and clean RESTful endpoint construction.',
    experienceSummary: 'Developing low-latency microservices, authentication middlewares, database ORM bindings, and background workers.',
    officialUrl: 'https://flask.palletsprojects.com/',
    iconName: 'SiFlask',
    color: '#d4d4d8',
    tags: ['Microservices', 'REST APIs', 'Blueprints', 'Routing']
  },
  flutter: {
    id: 'flutter',
    name: 'Flutter',
    category: 'backend',
    categoryLabel: 'UI Toolkit',
    description: 'Google’s multi-platform UI framework for compiling natively compiled applications for mobile, web, and desktop from a single codebase.',
    experienceSummary: 'Engineering 60fps smooth mobile applications with custom canvas rendering, BLoC/Provider state architectures, and offline caching.',
    officialUrl: 'https://flutter.dev/',
    iconName: 'SiFlutter',
    color: '#22d3ee',
    tags: ['Mobile (iOS & Android)', 'Widgets', 'High FPS', 'Cross-Platform']
  },
  reactnative: {
    id: 'reactnative',
    name: 'React Native',
    category: 'backend',
    categoryLabel: 'Mobile Framework',
    description: 'Framework for building native Android and iOS mobile applications using React and JavaScript/TypeScript component models.',
    experienceSummary: 'Creating native bridge integrations, animated gesture handlers, and performant cross-platform mobile apps.',
    officialUrl: 'https://reactnative.dev/',
    iconName: 'SiReact',
    color: '#22d3ee',
    tags: ['Native Bridge', 'React Hooks', 'Mobile Ecosystem', 'Expo']
  },
  sqlalchemy: {
    id: 'sqlalchemy',
    name: 'SQLAlchemy',
    category: 'backend',
    categoryLabel: 'ORM & Query Builder',
    description: 'The Python SQL toolkit and Object Relational Mapper that gives application developers the full power and flexibility of SQL.',
    experienceSummary: 'Designing declarative schema models, relationships, connection pools, and migration pipelines with Alembic.',
    officialUrl: 'https://www.sqlalchemy.org/',
    iconName: 'TbDatabase',
    color: '#f87171',
    tags: ['ORM', 'Database Driver', 'Alembic Migrations', 'Transactions']
  },
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases',
    categoryLabel: 'Relational Database',
    description: 'Powerful open-source object-relational database system with robust ACID compliance, JSONB support, and high concurrency performance.',
    experienceSummary: 'Configuring enterprise relational stores, indexing strategies, complex relational joins, and automated backup routines.',
    officialUrl: 'https://www.postgresql.org/',
    iconName: 'SiPostgresql',
    color: '#38bdf8',
    tags: ['ACID Compliance', 'JSONB', 'Extensions', 'Enterprise DB']
  },
  sqlite: {
    id: 'sqlite',
    name: 'SQLite',
    category: 'databases',
    categoryLabel: 'Embedded Database',
    description: 'C-language library that implements a small, fast, self-contained, high-reliability, full-featured SQL database engine.',
    experienceSummary: 'Embedding lightweight zero-configuration storage engines in edge applications, local test suites, and mobile apps.',
    officialUrl: 'https://www.sqlite.org/',
    iconName: 'SiSqlite',
    color: '#818cf8',
    tags: ['Embedded', 'Zero-Config', 'Local Storage', 'Ultra-Fast']
  },
  firebase: {
    id: 'firebase',
    name: 'Firebase',
    category: 'databases',
    categoryLabel: 'Cloud Platform & DB',
    description: 'Google’s serverless application development platform providing Firestore NoSQL real-time databases, authentication, and storage.',
    experienceSummary: 'Integrating real-time Firestore listeners, JWT Authentication, cloud security rules, and serverless background functions.',
    officialUrl: 'https://firebase.google.com/',
    iconName: 'SiFirebase',
    color: '#fbbf24',
    tags: ['Firestore', 'Realtime Sync', 'Auth', 'Serverless']
  },
  git: {
    id: 'git',
    name: 'Git',
    category: 'devops',
    categoryLabel: 'Version Control',
    description: 'Distributed version control system designed to handle everything from small to very large projects with speed and efficiency.',
    experienceSummary: 'Executing advanced branch workflows, interactive rebasing, merge conflict resolution, and atomic commit hygiene.',
    officialUrl: 'https://git-scm.com/',
    iconName: 'SiGit',
    color: '#f97316',
    tags: ['VCS', 'Branching', 'Collaboration', 'Code History']
  },
  github: {
    id: 'github',
    name: 'GitHub',
    category: 'devops',
    categoryLabel: 'Developer Platform',
    description: 'Cloud hosting platform for version control and collaboration, issue tracking, code reviews, and packages.',
    experienceSummary: 'Managing repository governance, automated pull request validation, releases, and open-source contributions.',
    officialUrl: 'https://github.com/',
    iconName: 'SiGithub',
    color: '#ffffff',
    tags: ['Open Source', 'Pull Requests', 'Code Review', 'Releases']
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    categoryLabel: 'Containerization',
    description: 'Set of PaaS products that use OS-level virtualization to deliver software in packages called containers.',
    experienceSummary: 'Writing multi-stage Dockerfiles, compose environments, container hardening, and reproducible local test environments.',
    officialUrl: 'https://www.docker.com/',
    iconName: 'SiDocker',
    color: '#38bdf8',
    tags: ['Containers', 'Dockerfiles', 'Reproducibility', 'Cloud Native']
  },
  githubactions: {
    id: 'githubactions',
    name: 'GitHub Actions',
    category: 'devops',
    categoryLabel: 'CI/CD Automation',
    description: 'Continuous integration and continuous delivery platform that allows you to automate your build, test, and deployment pipeline.',
    experienceSummary: 'Authoring automated testing workflows, lint validation checks, container builds, and deployment triggers.',
    officialUrl: 'https://github.com/features/actions',
    iconName: 'SiGithubactions',
    color: '#60a5fa',
    tags: ['CI/CD', 'Automated Testing', 'Workflows', 'DevOps']
  },
  render: {
    id: 'render',
    name: 'Render',
    category: 'devops',
    categoryLabel: 'Cloud Platform',
    description: 'Unified cloud to build and run all your apps and websites with free TLS certificates, global CDN, and auto-deployments.',
    experienceSummary: 'Deploying managed background workers, web services, database instances, and automated preview environments.',
    officialUrl: 'https://render.com/',
    iconName: 'SiRender',
    color: '#34d399',
    tags: ['PaaS', 'Continuous Deployment', 'Web Services', 'Managed Cloud']
  },
  django: {
    id: 'django',
    name: 'Django',
    category: 'backend',
    categoryLabel: 'Backend Framework',
    description: 'High-level Python web framework that encourages rapid development and clean, pragmatic design with batteries-included ORM and admin interface.',
    experienceSummary: 'Building scalable backend web applications, authentication systems, and database models with Django ORM.',
    officialUrl: 'https://www.djangoproject.com/',
    iconName: 'SiDjango',
    color: '#10b981',
    tags: ['Batteries-Included', 'ORM', 'Scalable Backend', 'Security']
  },
  jenkins: {
    id: 'jenkins',
    name: 'Jenkins',
    category: 'devops',
    categoryLabel: 'Automation Server',
    description: 'Leading open source automation server providing hundreds of plugins to support building, deploying and automating any project.',
    experienceSummary: 'Configuring Jenkins declarative pipelines, automated build agents, and continuous deployment workflows.',
    officialUrl: 'https://www.jenkins.io/',
    iconName: 'SiJenkins',
    color: '#ef4444',
    tags: ['CI/CD', 'Pipelines', 'Automation', 'Build Server']
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'databases',
    categoryLabel: 'Open Source Firebase / Postgres',
    description: 'Open source Firebase alternative providing PostgreSQL database, Authentication, instant real-time subscriptions, and Edge Functions.',
    experienceSummary: 'Leveraging Supabase Postgres, realtime websockets for live event leaderboards, and row level security policies.',
    officialUrl: 'https://supabase.com/',
    iconName: 'SiSupabase',
    color: '#3ecf8e',
    tags: ['PostgreSQL', 'Realtime', 'Auth', 'Edge Functions']
  },
  aws: {
    id: 'aws',
    name: 'AWS',
    category: 'devops',
    categoryLabel: 'Cloud Infrastructure',
    description: 'Comprehensive cloud computing platform providing compute, storage, networking, and managed database services.',
    experienceSummary: 'Hands-on learning with AWS core primitives including EC2, S3, IAM, and cloud deployment pipelines.',
    officialUrl: 'https://aws.amazon.com/',
    iconName: 'FaAws',
    color: '#ff9900',
    tags: ['Cloud', 'EC2', 'S3', 'Infrastructure']
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    category: 'devops',
    categoryLabel: 'Edge Deployment',
    description: 'Frontend cloud platform that provides developers with the developer experience and infrastructure to deploy websites and web services instantly.',
    experienceSummary: 'Optimizing edge middleware, instant static builds, serverless API routes, and global CDN caching.',
    officialUrl: 'https://vercel.com/',
    iconName: 'SiVercel',
    color: '#ffffff',
    tags: ['Serverless', 'Edge CDN', 'Instant Deploys', 'Frontend Cloud']
  }
};
