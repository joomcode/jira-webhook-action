import {extractIssueNumbers} from '../issue'; // Replace 'yourModule' with the actual path to your module

describe('extractIssueNumbers function', () => {
  it('should extract issue numbers from a string', () => {
    const input = 'Fixing issues ABC-123 and XYZ-456';
    const expectedOutput = ['ABC-123', 'XYZ-456'];

    expect(extractIssueNumbers(input)).toEqual(expectedOutput);
  });

  it('should handle no issue numbers', () => {
    const input = 'No issues mentioned';
    const expectedOutput: string[] = [];

    expect(extractIssueNumbers(input)).toEqual(expectedOutput);
  });

  it('should extract issue numbers when surrounded by non-alphanumeric characters', () => {
    const input = 'Issue: (ABC-789), Dash-123, Colon:XYZ-456';
    const expectedOutput = ['ABC-789', 'DASH-123', 'XYZ-456'];

    expect(extractIssueNumbers(input)).toEqual(expectedOutput);
  });

  it('should handle issue numbers without a prefix', () => {
    const input = '123-456 should not match';
    const expectedOutput: string[] = [];

    expect(extractIssueNumbers(input)).toEqual(expectedOutput);
  });

  it('should extract multiple issue numbers in a single match', () => {
    const input = 'Multiple matches ABC-123, DEF-456, GHI-789';
    const expectedOutput = ['ABC-123', 'DEF-456', 'GHI-789'];

    expect(extractIssueNumbers(input)).toEqual(expectedOutput);
  });
});
