export interface AcademicTermResponse {
  id: string;
  code: string;
  startsOn: string;
  endsOn: string;
}

export interface CreateAcademicTermRequest {
  code: string;
  startsOn: string;
  endsOn: string;
}

export interface UpdateAcademicTermRequest {
  code: string;
  startsOn: string;
  endsOn: string;
}
