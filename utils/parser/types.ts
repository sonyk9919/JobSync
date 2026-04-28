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

export enum EducationType {
    ANY = '학력무관',
    HIGH_SCHOOL = '고등학교 졸업',
    ASSOCIATE = '초대졸',
    BACHELOR = '대졸',
    GRADUATE = '대학원졸업',
    MASTER = '석사',
    DOCTOR = '박사',
    UNKNOWN = '알 수 없음',
}

export interface ParsedJob {
    company: string;
    dueDate: Date;
    educationType: EducationType;
    employmentType: EmploymentType;
    careerRequirements: CareerType;
    url: string;
}