import { UserSearchResult } from './user-search-result/user-search-result';
import { ProjectSearchResult } from './project-search-result/project-search-result';
import { JobSearchResult } from './job-search-result/job-search-result';

export class AppSearchResult {
  customers: UserSearchResult[] = [];
  employees: UserSearchResult[] = [];
  technicians: UserSearchResult[] = [];
  projects: ProjectSearchResult[] = [];
  jobs: JobSearchResult[] = [];
}

