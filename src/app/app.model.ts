export class Grantee {
  nsfAwardId: string;
  topic: string;
  organization: string;
  title: string;
  abs: string;
  version: number;
  attendanceStatus: string;
  awardAmountToDate: number;
  expDate: string;
  piEmail: string;
  piName: string;
  posterNum: string;
  programDirector: string;
  startDate: string;
  program: string;
}

export class Rep {
  uuid: string;
  name: string;
  interviewRequests: Req[];
  selectionsComplete: boolean;
  version: number;
}

export class Req {
  nsfAwardId: string;
  priority: number;
}
