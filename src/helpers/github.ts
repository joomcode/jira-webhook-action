import {getInput} from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';
import {extractIssueNumbers} from './issue';
import {UnwrapOcktokitResponse} from './types';

type OctokitType = InstanceType<typeof GitHub>;

let instance: OctokitType | undefined = undefined;
function octokit(): OctokitType {
  if (!instance) {
    instance = getOctokit(getInput('github_token'), {
      userAgent: 'jira-webhook-action',
    });
  }
  return instance;
}

export type CommitType = UnwrapOcktokitResponse<
  OctokitType['rest']['repos']['listCommits']
>[number];

export type PullRequestType = NonNullable<typeof context.payload.pull_request>;

type IssueIdsByCommitsType = {
  ids: Set<string>;
  bySha: Map<string, string[]>;
};

export function getIssueIdsByCommits(
  commits: Array<{sha: string; commit: {message: string}}>,
): IssueIdsByCommitsType {
  const ids = new Set<string>();
  const bySha = new Map<string, string[]>();
  commits.map((commit) => {
    const list = extractIssueNumbers(commit.commit.message);
    list.map((id) => ids.add(id));
    bySha.set(commit.sha, list);
  });

  return {
    ids,
    bySha,
  };
}

export async function getCommit(ref: string): Promise<CommitType> {
  const githubCommit = await octokit().rest.repos.getCommit({
    ...context.repo,
    ref,
  });

  return githubCommit.data;
}

export async function getPullRequestIssueIds(pr: PullRequestType): Promise<string[]> {
  const commits = await getPullRequestCommits(pr);
  const {ids} = getIssueIdsByCommits(commits);

  if (typeof pr.title === 'string') {
    extractIssueNumbers(pr.title).map((id) => ids.add(id));
  }

  if (typeof pr.head?.ref === 'string') {
    extractIssueNumbers(pr.head.ref).map((id) => ids.add(id));
  }

  return [...ids];
}

export async function getPullRequestCommits(pr: PullRequestType): Promise<CommitType[]> {
  const commits = await octokit().paginate(octokit().rest.pulls.listCommits, {
    ...context.repo,
    pull_number: pr.number,
  });
  return commits || [];
}

export async function getCommitsBetween(base: string, head: string): Promise<CommitType[]> {
  const response = await octokit().paginate(octokit().rest.repos.compareCommits, {
    ...context.repo,
    base,
    head,
  });

  return response.commits || [];
}
