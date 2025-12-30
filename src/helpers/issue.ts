const ISSUE_PATTERN_RE = /(?<![a-zA-Z0-9])[A-Z][A-Z0-9]{1,}-\d+(?![a-zA-Z0-9])/gi;

export function extractIssueNumbers(string: string): string[] {
  const result: Set<string> = new Set();
  string.match(ISSUE_PATTERN_RE)?.forEach((issue) => result.add(issue.toUpperCase()));
  return [...result];
}
