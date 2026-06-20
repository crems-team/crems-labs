export type OrgNodeType = 'PERSON' | 'VACANT' | 'GROUP';

export type OrgNode = {
  id: string;
  parentId: string | null;
  fullName: string | null;
  roleTitle: string;
  nodeType: OrgNodeType;
  sortOrder: number | string;
  avatarUrl: string | null;
  color: string | null;

  // GROUP helpers
  groupKey?: string;      // parentId|roleTitle
  groupCount?: number;    // count of people
};