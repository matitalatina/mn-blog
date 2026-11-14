import React from 'react';

import { ProjectsPage } from '../../components/ProjectsPage';
import { SiteHead } from '../../components/SiteHead';
import { getUi } from '../../i18n/ui';

export const Head = () => (
  <SiteHead>
    <title>{getUi('en').projectsHeadTitle}</title>
    <link rel="alternate" hrefLang="it" href="https://www.mattianatali.it/it/projects/" />
    <link rel="alternate" hrefLang="en" href="https://www.mattianatali.it/en/projects/" />
    <link rel="alternate" hrefLang="x-default" href="https://www.mattianatali.it/it/projects/" />
  </SiteHead>
);

const Projects = () => <ProjectsPage lang="en" />;

export default Projects;
