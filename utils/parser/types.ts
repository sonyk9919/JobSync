export enum EmploymentType {
  FULL_TIME = '정규직',
  CONTRACT = '계약직',
  UNKNOWN = '알 수 없음'
}

export enum CareerType {
  NONE = "경력무관",
  NEW = '신입',
  EXPERIENCED = '경력',
  ANY = '신입·경력',
  UNKNOWN = '알 수 없음'
}

export interface ParsedJob {
    position: string;
    company: string;
    dueDate: Date;
    employmentType: EmploymentType;
    careerRequirements: CareerType;
    url: string;
}