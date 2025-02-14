export interface Notice {
  id?: string;
  type: string;
  date: string;
  courtType: string;
  individualOrPanel: string;
  city: string;
  courtCategory: string;
  branchNumber: string;
  archiveNumber: string;
  noticeNumber: string;
  caseNumber: string;
  plaintiff: string;
  defendant: string;
  panelMembers: string;
  reportDate: string;
  trackingCode: string;
  cooperatedExperts: string;
  nonCooperatedExperts: string;
  amount: string;
  status: string;
}